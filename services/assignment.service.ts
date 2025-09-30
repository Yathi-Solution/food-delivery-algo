import { Pilot, Batch } from '../interfaces/order.interface';
import { BatchService } from './batch.service';
import { areTowersNearby } from '../utils/distance.util';

/**
 * Service for managing pilot assignments and batch merging
 */
export class AssignmentService {
  /**
   * Merges nearby batches with the primary batch
   * @param primaryKey - Key of the primary batch
   * @param batches - Map of all batches
   * @param pilotCapacity - Pilot's capacity limit
   * @param currentTime - Current time in minutes
   * @param nearbyThreshold - Distance threshold for nearby towers
   * @returns Merged batch
   */
  static mergeNearbyBatches(
    primaryKey: string,
    batches: Map<string, Batch>,
    pilotCapacity: number,
    currentTime: number,
    nearbyThreshold: number
  ): Batch {
    const primaryBatch = batches.get(primaryKey);
    if (!primaryBatch) {
      throw new Error(`Primary batch ${primaryKey} not found`);
    }

    if (BatchService.shouldHoldBatch(primaryBatch, currentTime)) {
      return primaryBatch;
    }

    const mergedOrders = [...primaryBatch.orders];

    // Find nearby towers within threshold
    const nearbyTowers = Array.from(batches.keys()).filter(
      key => key !== primaryKey && areTowersNearby(primaryKey, key, nearbyThreshold)
    );

    // Merge nearby batches if capacity allows
    for (const towerKey of nearbyTowers) {
      const batchToConsider = batches.get(towerKey);
      if (!batchToConsider) continue;
      
      if (BatchService.shouldHoldBatch(batchToConsider, currentTime)) continue;

      if (mergedOrders.length + batchToConsider.orders.length <= pilotCapacity) {
        mergedOrders.push(...batchToConsider.orders);
        batches.delete(towerKey);
      }
    }

    return { ...primaryBatch, orders: mergedOrders };
  }

  /**
   * Assigns pilots to batches with hold logic
   * @param pilots - Array of available pilots
   * @param batches - Map of batches to assign
   * @param currentTime - Current time in minutes
   * @param nearbyThreshold - Distance threshold for nearby towers
   * @returns Map of pilot assignments
   */
  static assignPilotsWithHold(
    pilots: Pilot[],
    batches: Map<string, Batch>,
    currentTime: number,
    nearbyThreshold: number
  ): Map<string, string> {
    const assignment = new Map<string, string>();

    // Reset pilot batches
    for (const pilot of pilots) {
      pilot.currentBatch = [];
    }

    // Update hold states
    BatchService.updateBatchHoldStates(batches, currentTime);

    // Assign pilots to batches
    for (const [key, batch] of batches.entries()) {
      if (BatchService.shouldHoldBatch(batch, currentTime) && !batch.maxHoldTimeExceeded) {
        continue;
      }

      for (const pilot of pilots) {
        if (pilot.currentBatch.length === 0) {
          const mergedBatch = this.mergeNearbyBatches(
            key, 
            batches, 
            pilot.capacity, 
            currentTime, 
            nearbyThreshold
          );
          
          if (pilot.capacity >= mergedBatch.orders.length) {
            assignment.set(pilot.id, mergedBatch.locationKey);
            pilot.currentBatch = mergedBatch.orders;
            batches.delete(key);
            break;
          }
        }
      }
    }

    return assignment;
  }
}
