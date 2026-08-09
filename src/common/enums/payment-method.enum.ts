export enum PaymentMethod {
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  NEFT = 'neft',
  QR_CODE = 'qr_code',
}

export enum PaymentStatus {
  PENDING = 'pending',
  AWAITING_NEFT = 'awaiting_neft',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentStage {
  ADVANCE = 'advance',
  BALANCE = 'balance',
}
