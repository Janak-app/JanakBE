export function generateOrderId(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, '0');
  return `JP-${year}-${padded}`;
}

export function generateQuoteId(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, '0');
  return `Q-${year}-${padded}`;
}

export function generateServiceRequestId(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, '0');
  return `SRV-${year}-${padded}`;
}
