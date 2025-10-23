/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import axios from 'axios';
import * as crypto from 'crypto';
import { CartItem } from 'apps/cart-service/src/entities/cart.entity';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private WC_BASE_URL = process.env.WC_BASE_URL;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    @Inject('AFFILIATE_SERVICE')
    private readonly affiliateClient: ClientProxy,
  ) { }

  private SKIPCASH_BASE_URL = process.env.SKIPCASH_BASE_URL;

  private async sendNotification(userId: string, title: string, body: string) {
    try {
      const { deviceToken } = await firstValueFrom(
        this.usersClient.send({ cmd: 'get-user-device-token' }, { userId }).pipe(
          timeout(3000),
          catchError(() => {
            this.logger.warn(`No notification token found for user ${userId}`);
            return [{ deviceToken: null }];
          }),
        ),
      );

      if (!deviceToken) return;

      await firstValueFrom(
        this.notificationsClient.send({ cmd: 'send_push_notification' }, {
          token: deviceToken,
          title,
          body,
          userId,
        }).pipe(
          timeout(3000),
          catchError((err) => {
            this.logger.error(`Failed to send notification: ${err.message}`);
            return [];
          }),
        ),
      );
    } catch (err) {
      this.logger.error('Error sending notification', err.stack);
    }
  }

  private async createWCOrder(dto: CreateOrderDto, items: CartItem[]) {
    try {
      const url = `${this.WC_BASE_URL}/checkout/complete`;
      const wcItems = items.map((item) => ({
        product_id: Number(item.productId),
        quantity: item.quantity,
        variation:
          item.variation?.map((v: any) => ({
            attribute: v.attribute,
            value: v.value,
          })) || [],
      }));
      if (!wcItems)
        throw new RpcException('Cart is empty, Please add items to cart');
      const order_data = {
        items: wcItems,
        customer_data: dto.customer_data,
        payment_method: "cod",
        payment_data: dto.payment_data,
      };

      const res = await axios.post(url, order_data);
      return res;
    } catch (error) {
      throw new NotFoundException(
        `Error in WooCommerce Create Order: ${error}`,
      );
    }
  }

  private async cancelWCOrder(orderID: string) {
    try {
      const url = `${this.WC_BASE_URL}/checkout/${orderID}`;
      const res = await axios.delete(url);
      return res;
    } catch (error) {
      throw new NotFoundException(
        `Error in WooCommerce Create Order: ${error}`,
      );
    }
  }

  async createSkipCashPayment(orderId: string, amount: number, customerData: any) {
    try {
      const url = `${this.SKIPCASH_BASE_URL}/api/v1/payments`;

      const payload = {
        Uid: this.generateUUID(),
        KeyId: process.env.SKIPCASH_KEY_ID,
        Amount: amount.toFixed(2),
        FirstName: customerData.first_name,
        LastName: customerData.last_name,
        Phone: customerData.phone,
        Email: customerData.email,
        Street: customerData.address_1,
        City: customerData.city,
        State: customerData.state,
        Country: customerData.country,
        PostalCode: customerData.postcode,
        TransactionId: String(orderId),
        Custom1: "",
      };

      const signature = this.generateSkipCashSignature(payload);
      const res = await axios.post(url, payload, {
        headers: {
          'Authorization': signature,
          'Content-Type': 'application/json'
        }
      });

      return res.data;
    } catch (error) {
      this.logger.error(`SkipCash payment failed: ${error.message}`);

      let customMessage = 'Please check your information and try again';

      if (error.response?.status === 400) {
        if (error.response?.data?.errorMessage?.includes('Signature')) {
          customMessage = 'Payment verification failed. Please review your details and try again';
        } else {
          customMessage = 'Invalid payment details. Please check your information and try again';
        }
      } else if (error.response?.status === 401) {
        customMessage = 'Payment authentication failed. Please try again';
      } else if (error.response?.status === 422) {
        customMessage = 'Payment information is incomplete. Please fill all required fields';
      } else if (error.response?.status === 500) {
        customMessage = 'Payment service temporarily unavailable. Please try again in a few minutes';
      }

      throw new NotFoundException(customMessage);
    }
  }

  private generateSkipCashSignature(payload: any): string {
    const orderedFields = [
      'Uid', 'KeyId', 'Amount', 'FirstName', 'LastName',
      'Phone', 'Email', 'Street', 'City', 'State',
      'Country', 'PostalCode', 'TransactionId', 'Custom1'
    ];

    const nonEmptyFields = orderedFields
      .filter(key => payload[key] && payload[key] !== '')
      .map(key => `${key}=${String(payload[key]).trim()}`)
      .join(',');

    console.log('Signature Base String:', nonEmptyFields);

    const signature = crypto
      .createHmac('sha256', process.env.SKIPCASH_KEY_SECRET || '')
      .update(nonEmptyFields)
      .digest('base64');

    return signature;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async createOrder(userId: string, items: CartItem[], dto: CreateOrderDto): Promise<Order> {
    try {
      let customerData = dto.customer_data;
      if (!customerData) {
        customerData = await firstValueFrom(
          this.usersClient.send({ cmd: 'getUserAddress' }, userId).pipe(
            timeout(3000),
            catchError(() => {
              this.logger.warn(`User ${userId} address not found`);
              return [null];
            }),
          ),
        );
        if (!customerData) {
          throw new RpcException('User address data is required');
        }
      }

      if (dto.customer_data) {
        await firstValueFrom(
          this.usersClient.send({ cmd: 'updateUserAddress' }, { userId, addressDto: dto.customer_data }),
        );
      }

      const updatedDto = { ...dto, customer_data: customerData };
      const res = await this.createWCOrder(updatedDto, items);

      const total = parseFloat(
        items.reduce(
          (sum: number, item) => sum + (Number(item.price ?? 0) * Number(item.quantity ?? 1)),
          0,
        ).toFixed(2)
      );

      const discountPercentage = items.length > 0 ? items[0].discountPercentage ?? 0 : 0;
      const discount = parseFloat(((total * discountPercentage) / 100).toFixed(2));
      const totalAfterDiscount = parseFloat((total - discount).toFixed(2));

      const totalAfterDiscountNum = totalAfterDiscount;
      const shippingCostNum = parseFloat(Number(customerData.shipping_option.cost).toFixed(2));

      const totalAfterDiscountAndShipping = parseFloat(
        (totalAfterDiscountNum + shippingCostNum).toFixed(2)
      );

      const skipCashPayment = await this.createSkipCashPayment(
        res.data.order_id,
        totalAfterDiscountAndShipping,
        customerData,
      );

      const order = this.orderRepository.create({
        wcOrderId: res.data.order_id,
        wcOrderStatus: res.data.order_status,
        wcPaymentStatus: res.data.payment_status,
        wcOrderKey: res.data.order_key,
        total: totalAfterDiscount.toFixed(2),
        shippingCost: shippingCostNum.toFixed(2),
        userId,
        items,
        customerData,
        paymentMethod: 'skipcash',
        paymentData: dto.payment_data,
        isPaid: false,
        isDelivered: false,
        skipCashTransactionId: skipCashPayment.resultObj.transactionId,
        skipCashPaymentUrl: skipCashPayment.resultObj.payUrl,
      });

      await this.orderRepository.save(order);

      const couponCode = items.length > 0 ? items[0].couponCode : undefined;
      if (couponCode) {
        try {
          await firstValueFrom(
            this.affiliateClient.send('affiliate.addCommission', {
              couponCode,
              saleAmount: totalAfterDiscount,
            }).pipe(timeout(5000)),
          );
        } catch (err) {
          this.logger.warn(`Failed to add affiliate commission: ${err.message || err}`);
        }
      }

      await this.sendNotification(
        userId,
        'Order Created 🛒',
        `Your order (${order.wcOrderId}) total: ${totalAfterDiscount.toFixed(2)} has been created successfully.`,
      );

      return order;
    } catch (error) {
      throw toRpc(error, 'Failed to create order');
    }
  }

  async getOrderById(id: string) {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order)
        throw new RpcException({ statusCode: 404, message: 'Order not found' });
      return order;
    } catch (error) {
      throw toRpc(error, 'Failed to get order by id');
    }
  }

  async getOrdersByUser(userId: string) {
    try {
      return await this.orderRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw toRpc(error, 'Failed to get orders by user');
    }
  }

  async markAsPaid(id: string) {
    try {
      const order = await this.getOrderById(id);
      order.isPaid = true;
      order.paidAt = new Date();
      await this.sendNotification(
        order.userId,
        'Order Paid 💵',
        `Your order (${order.wcOrderId}) has been marked as paid.`
      );
      return await this.orderRepository.save(order);
    } catch (error) {
      throw toRpc(error, 'Failed to mark order as paid');
    }
  }

  async markOrderPaidByTransaction(transactionId: string, paymentData: any) {
    try {
      const order = await this.orderRepository.findOne({
        where: { skipCashTransactionId: transactionId }
      });

      if (!order) {
        throw new RpcException({
          statusCode: 404,
          message: `Order not found for transaction: ${transactionId}`
        });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentData = paymentData;
      order.wcPaymentStatus = 'paid';

      await this.orderRepository.save(order);

      await this.sendNotification(
        order.userId,
        'Payment Confirmed 💳',
        `Your payment for order (${order.wcOrderId}) has been confirmed successfully.`
      );

      this.logger.log(`Order ${order.id} marked as paid via webhook`);
      return order;
    } catch (error) {
      throw toRpc(error, 'Failed to mark order as paid');
    }
  }

  async cancelOrderByTransaction(transactionId: string, reason: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { skipCashTransactionId: transactionId }
      });

      if (!order) {
        throw new RpcException({
          statusCode: 404,
          message: `Order not found for transaction: ${transactionId}`
        });
      }

      order.wcOrderStatus = 'cancelled';
      order.wcPaymentStatus = 'failed';

      await this.orderRepository.save(order);

      await this.sendNotification(
        order.userId,
        'Order Cancelled ❌',
        `Your order (${order.wcOrderId}) has been cancelled due to payment failure.`
      );

      this.logger.log(`Order ${order.id} cancelled: ${reason}`);
      return order;
    } catch (error) {
      throw toRpc(error, 'Failed to cancel order');
    }
  }

  async markAsDelivered(id: string) {
    try {
      const order = await this.getOrderById(id);
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await this.sendNotification(
        order.userId,
        'Order Delivered 🚚',
        `Your order (${order.wcOrderId}) has been delivered.`
      );

      return await this.orderRepository.save(order);
    } catch (error) {
      throw toRpc(error, 'Failed to mark order as delivered');
    }
  }

  async deleteOrder(id: string) {
    try {
      const result = await this.orderRepository.delete(id);
      if (result.affected === 0) {
        throw new RpcException({ statusCode: 404, message: 'Order not found' });
      }
      await this.sendNotification(
        id,
        'Order Deleted 🗑️',
        `Your order (${id}) has been deleted successfully.`
      );
      return { affected: result.affected };
    } catch (error) {
      throw toRpc(error, 'Failed to delete order');
    }
  }

  async getOrdersByStatus(userId: string, status: string) {
    try {
      const filters: any = { userId };

      if (status === 'complete' || status === 'completed') {
        filters.wcOrderStatus = 'completed';
      } else if (status === 'paid') {
        filters.isPaid = true;
      } else if (status === 'delivered') {
        filters.isDelivered = true;
      } else if (status === 'pending') {
        filters.isPaid = false;
        filters.isDelivered = false;
      }

      return await this.orderRepository.find({
        where: filters,
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw toRpc(error, 'Failed to get orders by status');
    }
  }

  async getAllOrders() {
    try {
      return await this.orderRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw toRpc(error, 'Failed to get all orders');
    }
  }

  async countAllOrders() {
    try {
      return await this.orderRepository.count();
    } catch (error) {
      throw toRpc(error, 'Failed to count all orders');
    }
  }

  async countCompletedOrders() {
    try {
      return await this.orderRepository.count({ where: { isPaid: true, isDelivered: true } });
    } catch (error) {
      throw toRpc(error, 'Failed to count completed orders');
    }
  }

  async countPendingOrders() {
    try {
      return await this.orderRepository.count({ where: { isPaid: false, isDelivered: false } });
    } catch (error) {
      throw toRpc(error, 'Failed to count pending orders');
    }
  }

  async countCancelledOrders() {
    try {
      return await this.orderRepository.count({ where: { wcOrderStatus: 'cancelled' } });
    } catch (error) {
      throw toRpc(error, 'Failed to count cancelled orders');
    }
  }
}

function toRpc(error: any, fallbackMsg?: string) {
  if (error instanceof RpcException) return error;
  const statusCode = error?.getStatus?.() || 500;
  const message = error?.message || fallbackMsg || 'Orders microservice error';
  return new RpcException({ statusCode, message });
}
