/**
 * WebSocket Events for Real-Time Order Tracking
 */

// Client → Server Events
export interface ClientToServerEvents {
  // Customer subscribes to order updates
  'order:subscribe': (orderId: string) => void;
  
  // Customer unsubscribes from order updates
  'order:unsubscribe': (orderId: string) => void;
  
  // Kitchen staff connects
  'kitchen:connect': () => void;
  
  // Kitchen staff disconnects
  'kitchen:disconnect': () => void;
}

// Server → Client Events
export interface ServerToClientEvents {
  // Order status updated (to customer)
  'order:statusUpdate': (data: OrderStatusUpdatePayload) => void;
  
  // New order arrived (to kitchen)
  'kitchen:newOrder': (data: NewOrderPayload) => void;
  
  // Order status updated (to kitchen)
  'kitchen:orderUpdate': (data: OrderStatusUpdatePayload) => void;
  
  // Connection confirmed
  'connected': (data: { socketId: string }) => void;
}

// Payload Types
export interface OrderStatusUpdatePayload {
  orderId: string;
  orderNumber: string;
  status: string;
  previousStatus?: string;
  changedBy?: string;
  notes?: string;
  timestamp: string;
}

export interface NewOrderPayload {
  orderId: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  estimatedPrepTime: number;
  user?: {
    phone?: string;
    name?: string;
  };
  timestamp: string;
}