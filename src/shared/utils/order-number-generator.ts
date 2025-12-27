/**
 * Generate unique order number in format: ORD-YYYYMMDD-XXX
 * Example: ORD-20241228-001
 */
export function generateOrderNumber(sequence: number): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  const sequenceStr = String(sequence).padStart(3, '0');
  
  return `ORD-${dateStr}-${sequenceStr}`;
}

/**
 * Get today's date in YYYYMMDD format for filtering orders
 */
export function getTodayDateString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}`;
}

/**
 * Extract date and sequence from order number
 */
export function parseOrderNumber(orderNumber: string): {
  date: string;
  sequence: number;
} | null {
  const regex = /^ORD-(\d{8})-(\d{3})$/;
  const match = orderNumber.match(regex);
  
  if (!match) {
    return null;
  }
  
  return {
    date: match[1],
    sequence: parseInt(match[2], 10),
  };
}
