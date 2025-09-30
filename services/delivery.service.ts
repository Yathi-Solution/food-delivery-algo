import { Order, Pilot, DeliveryResult, DeliveryConfig } from '../interfaces/order.interface';
import { BatchService } from './batch.service';
import { AssignmentService } from './assignment.service';
import { RoutingService } from './routing.service';
import { NEARBY_DISTANCE_THRESHOLD } from '../constants/delivery.constants';

/**
 * Main service for orchestrating delivery operations
 */
export class DeliveryService {
  /**
   * Orchestrates the complete delivery process
   * @param orders - Array of orders to deliver
   * @param pilots - Array of available pilots
   * @param config - Delivery configuration
   * @returns Delivery result with assignments and routes
   */
  static async orchestrateDelivery(
    orders: Order[],
    pilots: Pilot[],
    config: DeliveryConfig
  ): Promise<DeliveryResult> {
    // Create batches from orders
    const batches = BatchService.batchOrders(
      orders,
      config.timeWindowMins,
      config.currentTime
    );

    // Assign pilots to batches
    const assignments = AssignmentService.assignPilotsWithHold(
      pilots,
      batches,
      config.currentTime,
      config.nearbyDistanceThreshold
    );

    // Generate optimized routes for each pilot
    const pilotRoutes = new Map<string, Order[]>();
    
    for (const pilot of pilots) {
      if (assignments.has(pilot.id) && pilot.currentBatch.length > 0) {
        const batchKey = assignments.get(pilot.id)!;
        const optimizedRoute = RoutingService.routeOptimize(pilot.currentBatch, batchKey);
        pilotRoutes.set(pilot.id, optimizedRoute);
      }
    }

    return { assignments, pilotRoutes };
  }

  /**
   * Validates delivery inputs
   * @param orders - Array of orders
   * @param pilots - Array of pilots
   * @param config - Delivery configuration
   * @throws Error if validation fails
   */
  static validateInputs(orders: Order[], pilots: Pilot[], config: DeliveryConfig): void {
    if (!orders || orders.length === 0) {
      throw new Error('Orders array cannot be empty');
    }

    if (!pilots || pilots.length === 0) {
      throw new Error('Pilots array cannot be empty');
    }

    if (config.timeWindowMins <= 0) {
      throw new Error('Time window must be positive');
    }

    if (config.currentTime < 0) {
      throw new Error('Current time cannot be negative');
    }

    if (config.nearbyDistanceThreshold <= 0) {
      throw new Error('Nearby distance threshold must be positive');
    }

    // Validate pilot capacities
    for (const pilot of pilots) {
      if (pilot.capacity <= 0) {
        throw new Error(`Pilot ${pilot.id} has invalid capacity: ${pilot.capacity}`);
      }
    }

    // Validate order data
    for (const order of orders) {
      if (!order.id || !order.block || !order.tower) {
        throw new Error(`Order ${order.id} has missing required fields`);
      }
      if (order.readyInMinutes < 0) {
        throw new Error(`Order ${order.id} has negative ready time`);
      }
    }
  }
}
