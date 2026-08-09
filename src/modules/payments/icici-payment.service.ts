import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class IciciPaymentService {
  private readonly logger = new Logger(IciciPaymentService.name);
  private readonly initiateUrl: string;
  private readonly commandUrl: string;
  private readonly merchantId: string;
  private readonly aggregatorId: string;
  private readonly key: string;

  constructor(private configService: ConfigService) {
    this.initiateUrl = 'https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale';
    this.commandUrl = 'https://pgpayuat.icicibank.com/tsp/pg/api/command';
    this.merchantId = this.configService.get<string>('ICICI_MERCHANT_ID', '');
    this.aggregatorId = this.configService.get<string>('ICICI_AGGREGATOR_ID', '');
    this.key = this.configService.get<string>('ICICI_KEY', '');
  }

  generateSecureHash(payload: Record<string, any>): string {
    const hashText = Object.keys(payload)
      .filter((k) => k !== 'secureHash')
      .sort()
      .map((k) => payload[k])
      .join('');

    return crypto.createHmac('sha256', this.key).update(hashText).digest('hex');
  }

  private formatTxnDate(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }

  async initiateSale(params: {
    merchantTxnNo: string;
    amount: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    returnUrl: string;
    addlParam1?: string;
    addlParam2?: string;
  }) {
    const payload: Record<string, any> = {
      merchantId: this.merchantId,
      merchantTxnNo: params.merchantTxnNo,
      amount: params.amount,
      currencyCode: '356',
      payType: '0',
      customerEmailID: params.customerEmail,
      transactionType: 'SALE',
      returnURL: params.returnUrl,
      txnDate: this.formatTxnDate(),
      customerMobileNo: params.customerMobile,
      customerName: params.customerName,
      addlParam1: params.addlParam1 ?? '000',
      addlParam2: params.addlParam2 ?? '000',
    };

    payload.secureHash = this.generateSecureHash(payload);

    this.logger.log(`Initiating sale for txn: ${params.merchantTxnNo}`);

    try {
      const response = await axios.post(this.initiateUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return { request: payload, response: response.data };
    } catch (err) {
      this.logger.error(`ICICI initiate error — status: ${err.response?.status}, body: ${JSON.stringify(err.response?.data)}`);
      throw err;
    }
  }

  async checkStatus(merchantTxnNo: string) {
    const payload: Record<string, any> = {
      merchantId: this.merchantId,
      merchantTxnNo,
      originalTxnNo: merchantTxnNo,
      transactionType: 'STATUS',
    };

    payload.secureHash = this.generateSecureHash(payload);

    this.logger.log(`Checking status for txn: ${merchantTxnNo}`);

    const response = await axios.post(this.commandUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  }
}
