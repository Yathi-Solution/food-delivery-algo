import { Order } from '../interfaces/order.interface';
import { PRIORITY_MAP } from '../constants/delivery.constants';

/**
 * Gets the priority value for an order type
 * @param orderType - The order type
 * @returns Priority number (lower = higher priority)
 */
export function getOrderPriority(orderType: Order['type']): number {
  return PRIORITY_MAP[orderType];
}

/**
 * Sorts orders by priority (hot items first)
 * @param orders - Array of orders to sort
 * @returns Sorted orders array
 */
export function sortOrdersByPriority(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => getOrderPriority(a.type) - getOrderPriority(b.type));
}

/**
 * Filters orders by high priority (hot items)
 * @param orders - Array of orders to filter
 * @returns High priority orders
 */
export function getHighPriorityOrders(orders: Order[]): Order[] {
  return orders.filter(order => getOrderPriority(order.type) === 1);
}

/**
 * Creates a location key from block and tower
 * @param block - Block identifier
 * @param tower - Tower identifier
 * @returns Location key string
 */
export function createLocationKey(block: string, tower: string): string {
  return `${block}-${tower}`;
}

/**
 * Gets the location key for an order
 * @param order - Order object
 * @returns Location key string
 */
export function getOrderLocationKey(order: Order): string {
  return createLocationKey(order.block, order.tower);
}
