import { Order } from '../interfaces/order.interface';
import { getDistance } from '../utils/distance.util';
import { getOrderLocationKey } from '../utils/order.util';

/**
 * Service for optimizing delivery routes
 */
export class RoutingService {
  /**
   * Optimizes the delivery route for a set of orders
   * @param orders - Array of orders to route
   * @param startKey - Starting location key
   * @returns Optimized route as array of orders
   */
  static routeOptimize(orders: Order[], startKey: string): Order[] {
    if (orders.length === 0) return [];
    if (orders.length === 1) return orders;

    const visited = new Set<string>();
    const route: Order[] = [];
    const remainingOrders = [...orders];

    // Find starting order
    let currentOrder = remainingOrders.find(order => getOrderLocationKey(order) === startKey);
    if (!currentOrder) {
      // If no order at start location, pick the first one
      currentOrder = remainingOrders[0];
    }

    // Remove starting order from remaining
    const startIndex = remainingOrders.findIndex(order => order.id === currentOrder!.id);
    remainingOrders.splice(startIndex, 1);
    visited.add(currentOrder.id);
    route.push(currentOrder);

    // Greedy algorithm: always pick the closest unvisited order
    while (remainingOrders.length > 0) {
      const currentLocation = getOrderLocationKey(currentOrder);
      let closestOrder: Order | undefined;
      let minDistance = Infinity;

      for (const order of remainingOrders) {
        const orderLocation = getOrderLocationKey(order);
        const distance = getDistance(currentLocation, orderLocation);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestOrder = order;
        }
      }

      if (closestOrder) {
        remainingOrders.splice(remainingOrders.indexOf(closestOrder), 1);
        visited.add(closestOrder.id);
        route.push(closestOrder);
        currentOrder = closestOrder;
      } else {
        // Fallback: add remaining orders in original order
        route.push(...remainingOrders);
        break;
      }
    }

    return route;
  }

  /**
   * Calculates total distance for a route
   * @param orders - Array of orders in route
   * @returns Total distance in meters
   */
  static calculateRouteDistance(orders: Order[]): number {
    if (orders.length <= 1) return 0;

    let totalDistance = 0;
    for (let i = 0; i < orders.length - 1; i++) {
      const currentLocation = getOrderLocationKey(orders[i]);
      const nextLocation = getOrderLocationKey(orders[i + 1]);
      totalDistance += getDistance(currentLocation, nextLocation);
    }

    return totalDistance;
  }
}
