/**
 * Creates an object from an array of key-value pairs
 * @param entries - Array of key-value pairs
 * @returns Object created from entries
 */
export function fromEntries<K extends string | number | symbol, V>(entries: [K, V][]): Record<K, V> {
  const obj = {} as Record<K, V>;
  for (const [key, value] of entries) {
    obj[key] = value;
  }
  return obj;
}

/**
 * Converts a Map to a plain object
 * @param map - Map to convert
 * @returns Plain object representation
 */
export function mapToObject<K extends string | number | symbol, V>(map: Map<K, V>): Record<K, V> {
  return fromEntries(Array.from(map.entries()));
}
