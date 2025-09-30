import { Order, Pilot, DeliveryConfig } from './interfaces/order.interface';
import { DeliveryService } from './services/delivery.service';
import { mapToObject } from './utils/object.util';
import { NEARBY_DISTANCE_THRESHOLD } from './constants/delivery.constants';

/**
 * Main delivery orchestrator function
 * @param orders - Array of orders to deliver
 * @param pilots - Array of available pilots
 * @param timeWindowMins - Time window in minutes
 * @param currentTime - Current time in minutes
 * @returns Formatted delivery results
 */
async function deliveryOrchestrator(
  orders: Order[],
  pilots: Pilot[],
  timeWindowMins: number,
  currentTime: number
) {
  const config: DeliveryConfig = {
    timeWindowMins,
    currentTime,
    nearbyDistanceThreshold: NEARBY_DISTANCE_THRESHOLD,
  };

  // Validate inputs
  DeliveryService.validateInputs(orders, pilots, config);

  // Orchestrate delivery
  const results = await DeliveryService.orchestrateDelivery(orders, pilots, config);

  return formatResults(results);
}

/**
 * Formats delivery results for output
 * @param results - Raw delivery results
 * @returns Formatted results with plain objects
 */
function formatResults(results: {
  assignments: Map<string, string>;
  pilotRoutes: Map<string, Order[]>;
}) {
  const assignmentsPlain = mapToObject(results.assignments);
  const pilotRoutesPlain: Record<string, string[]> = {};
  
  results.pilotRoutes.forEach((route, pilotId) => {
    pilotRoutesPlain[pilotId] = route.map(o => o.id);
  });
  
  return { assignments: assignmentsPlain, pilotRoutes: pilotRoutesPlain };
}

// Export the main function for use
export { deliveryOrchestrator, formatResults };
