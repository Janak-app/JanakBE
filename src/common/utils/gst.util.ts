export const GST_RATE = 0.18;

export function calculateGst(baseAmount: number): {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
} {
  const gstAmount = Math.round(baseAmount * GST_RATE);
  return {
    baseAmount,
    gstAmount,
    totalAmount: baseAmount + gstAmount,
  };
}
