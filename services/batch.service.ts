import { Order, Batch } from '../interfaces/order.interface';
import { HOLD_TOLERANCE } from '../constants/delivery.constants';
import { getOrderLocationKey, sortOrdersByPriority, getHighPriorityOrders } from '../utils/order.util';

/**
 * Service for managing order batching operations
 */
export class BatchService {
  /**
   * Creates batches from orders within the specified time window
   * @param orders - Array of orders to batch
   * @param timeWindowMins - Time window in minutes
   * @param currentTime - Current time in minutes
   * @returns Map of location keys to batches
   */
  static batchOrders(
    orders: Order[],
    timeWindowMins: number,
    currentTime: number
  ): Map<string, Batch> {
    const groups = new Map<string, Order[]>();
    
    // Group orders by location within time window
    orders.forEach(order => {
      if (order.readyInMinutes <= timeWindowMins) {
        const key = getOrderLocationKey(order);
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(order);
      }
    });

    const batches = new Map<string, Batch>();
    
    // Create batches from groups
    groups.forEach((groupOrders, key) => {
      const sortedOrders = sortOrdersByPriority(groupOrders);
      const earliestReadyTime = Math.min(...groupOrders.map(o => o.readyInMinutes));
      
      batches.set(key, {
        orders: sortedOrders,
        locationKey: key,
        startTime: currentTime,
        earliestReadyTime,
        maxHoldTimeExceeded: false,
      });
    });

    return batches;
  }

  /**
   * Updates hold states for all batches based on current time
   * @param batches - Map of batches to update
   * @param currentTime - Current time in minutes
   */
  static updateBatchHoldStates(batches: Map<string, Batch>, currentTime: number): void {
    batches.forEach(batch => {
      const elapsedHold = currentTime - batch.earliestReadyTime;
      const maxTolerance = Math.max(...batch.orders.map(order => HOLD_TOLERANCE[order.type]));
      
      batch.maxHoldTimeExceeded = elapsedHold >= maxTolerance;
    });
  }

  /**
   * Determines if a batch should be held based on order readiness and tolerance
   * @param batch - Batch to evaluate
   * @param currentTime - Current time in minutes
   * @returns True if batch should be held
   */
  static shouldHoldBatch(batch: Batch, currentTime: number): boolean {
    const highPriorityOrders = getHighPriorityOrders(batch.orders);
    if (highPriorityOrders.length === 0) return false;

    const maxHotReady = Math.max(...highPriorityOrders.map(o => o.readyInMinutes));
    const elapsedHold = currentTime - batch.earliestReadyTime;
    const maxTolerance = Math.max(...batch.orders.map(order => HOLD_TOLERANCE[order.type]));

    // Hold if hot items aren't ready and within tolerance
    if (maxHotReady > currentTime && elapsedHold < maxTolerance) {
      return true;
    }

    // Release if tolerance exceeded
    if (elapsedHold >= maxTolerance) {
      if (!batch.maxHoldTimeExceeded) {
        batch.maxHoldTimeExceeded = true;
      }
      return false;
    }

    return false;
  }
}
