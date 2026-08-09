export enum OrderStatus {
  PENDING = 'pending',
  PENDING_ADVANCE_PAYMENT = 'pending_advance_payment',
  ADVANCE_PAID = 'advance_paid',
  PROCESSING = 'processing',
  ASSIGNED_FOR_SHIPPING = 'assigned_for_shipping',
  PENDING_BALANCE_PAYMENT = 'pending_balance_payment',
  BALANCE_PAID = 'balance_paid',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
