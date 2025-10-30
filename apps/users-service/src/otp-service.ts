import { Injectable } from '@nestjs/common';
// import { Twilio } from 'twilio';
import axios from 'axios';

@Injectable()
export class OTPService {
  // private client: Twilio;
  // private verifySid: string;
  private username: string;
  private apiKey: string;
  private sender: string;

  constructor() {
    // this.client = new Twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN,
    // );
    // this.verifySid = process.env.TWILIO_VERIFY_SID || "";
    this.username = process.env.QATARSMS_USERNAME || '';
    this.apiKey = process.env.QATARSMS_APIKEY || '';
    this.sender = process.env.QATARSMS_SENDER || 'Camion';
  }
  async sendSms(to: string, body: string): Promise<any> {
    const sanitizedTo = to.replace(/^\+/, '');
    const params = new URLSearchParams();
    params.append('username', this.username);
    params.append('apikey', this.apiKey);
    params.append('to', sanitizedTo);
    params.append('text', body);
    if (this.sender) params.append('sender', this.sender);
    // return this.client.messages.create({
    //   body,
    //   to, // recipient
    //   from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
    // });

    const resp = await axios.post('https://bhsms.net/httppost/', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 15000,
    });
    const data: string = typeof resp.data === 'string' ? resp.data : String(resp.data);
    if (data.includes('ORDERID:')) {
      return { provider: 'qatarsms', response: data };
    }
    const known = [
      'AUTH_FAILED',
      'IPADDR_DENIED',
      'NO_CREDIT',
      'INVLD_SENDER',
      'NO_DEFAULTSENDER',
      'NO_RECIPIENTS',
      'INVLD_RECIPIENTS',
      'NO_TEXT',
      'INVLD_SCHEDULE',
    ];
    const match = known.find(code => data.includes(code));
    const message = match ? `QatarSMS error: ${match}` : `QatarSMS unexpected response: ${data}`;
    throw new Error(message);
  }
  async sendOTP(phone: string): Promise<any> {
    // return this.client.verify.v2.services(this.verifySid).verifications.create({
    //   to: phone,
    //   channel: 'sms',
    // });
    return { success: false, message: 'SMS OTP via provider is not enabled' };
  }

  async verifyOTP(phone: string, code: string): Promise<boolean> {
    // const result = await this.client.verify.v2
    //   .services(this.verifySid)
    //   .verificationChecks.create({
    //     to: phone,
    //     code,
    //   });
    // return result.status === 'approved';
    throw new Error('SMS OTP verification via provider is not enabled');
  }
}
