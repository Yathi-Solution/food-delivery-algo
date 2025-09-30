import { DISTANCE_MATRIX } from '../constants/delivery.constants';

/**
 * Calculates the distance between two tower locations
 * @param tower1 - First tower location key
 * @param tower2 - Second tower location key
 * @returns Distance in meters, or Infinity if no path exists
 */
export function getDistance(tower1: string, tower2: string): number {
  if (tower1 === tower2) return 0;
  return DISTANCE_MATRIX[tower1]?.[tower2] ?? DISTANCE_MATRIX[tower2]?.[tower1] ?? Infinity;
}

/**
 * Checks if two towers are within the nearby distance threshold
 * @param tower1 - First tower location key
 * @param tower2 - Second tower location key
 * @param threshold - Distance threshold in meters
 * @returns True if towers are nearby
 */
export function areTowersNearby(tower1: string, tower2: string, threshold: number): boolean {
  return getDistance(tower1, tower2) <= threshold;
}
