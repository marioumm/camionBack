/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Req, Res, Inject, NotFoundException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import axios from 'axios';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  
  constructor(
    @Inject('ORDERS_SERVICE') private readonly orderClient: ClientProxy
  ) {}

  private WC_BASE_URL = process.env.WC_BASE_URL;
  private SKIPCASH_WEBHOOK_KEY = process.env.SKIPCASH_WEBHOOK_KEY;

  private verifySkipCashSignature(payload: string, signature: string): boolean {
    if (!this.SKIPCASH_WEBHOOK_KEY) {
      this.logger.error('SKIPCASH_WEBHOOK_KEY is not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.SKIPCASH_WEBHOOK_KEY)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  private async cancelWCOrder(orderID: string) {
    try {
      const url = `${this.WC_BASE_URL}/checkout/${orderID}`;
      const res = await axios.delete(url);
      this.logger.log(`WooCommerce order ${orderID} cancelled successfully`);
      return res;
    } catch (error) {
      this.logger.error(`Failed to cancel WooCommerce order ${orderID}:`, error.message);
      throw new NotFoundException(`Error cancelling WooCommerce order: ${error.message}`);
    }
  }

  @Post('skipcash')
  async handleSkipCashWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      // const signature = req.headers['x-skipcash-signature'] as string;
      // const rawBody = JSON.stringify(req.body);
      
      // if (!signature || !this.verifySkipCashSignature(rawBody, signature)) {
      //   this.logger.warn('Invalid SkipCash webhook signature');
      //   return res.status(401).json({ error: 'Invalid signature' });
      // }

      const event = req.body;
      this.logger.log('SkipCash Webhook received:', JSON.stringify(event, null, 2));

      const { 
        transactionId, 
        status, 
        amount, 
        currency,
        paymentId,
        // custom1 
      } = event;

      if (!transactionId) {
        this.logger.error('Missing transactionId in webhook payload');
        return res.status(400).json({ error: 'Missing transactionId' });
      }

      if (status === 'completed' || status === 'success' || status === 'paid') {
        this.logger.log(`Payment completed for transaction: ${transactionId}`);
        
        try {
          await this.orderClient.send(
            { cmd: 'mark_order_paid_by_transaction' },
            { 
              transactionId,
              paymentData: {
                skipCashPaymentId: paymentId,
                amount,
                currency,
                status,
                paidAt: new Date()
              }
            }
          ).toPromise();
          
          this.logger.log(`Order marked as paid for transaction: ${transactionId}`);
        } catch (error) {
          this.logger.error(`Failed to mark order as paid:`, error);
        }
      }

      else if (status === 'failed' || status === 'cancelled' || status === 'canceled') {
        this.logger.log(`Payment failed/cancelled for transaction: ${transactionId}`);
        
        try {
          await this.cancelWCOrder(transactionId);
          
          await this.orderClient.send(
            { cmd: 'cancel_order_by_transaction' },
            { 
              transactionId,
              reason: `Payment ${status}`,
              cancelledAt: new Date()
            }
          ).toPromise();
          
          this.logger.log(`Order cancelled for transaction: ${transactionId}`);
        } catch (error) {
          this.logger.error(`Failed to cancel order:`, error);
        }
      }

      return res.json({ 
        received: true, 
        status: 'processed',
        transactionId 
      });

    } catch (error) {
      this.logger.error('Error processing SkipCash webhook:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        received: false 
      });
    }
  }
}
