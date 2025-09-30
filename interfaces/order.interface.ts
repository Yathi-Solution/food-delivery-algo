export interface OrderType {
  readonly value: 'hot' | 'icecream' | 'frozen' | 'packed';
}

export interface Order {
  readonly id: string;
  readonly block: string;
  readonly tower: string;
  readonly type: OrderType['value'];
  readonly readyInMinutes: number;
}

export interface Pilot {
  id: string;
  capacity: number;
  currentBatch: Order[];
  location: string;
}

export interface Batch {
  orders: Order[];
  locationKey: string;
  startTime: number;
  earliestReadyTime: number;
  maxHoldTimeExceeded: boolean;
}

export interface DeliveryAssignment {
  readonly pilotId: string;
  readonly batchKey: string;
}

export interface PilotRoute {
  readonly pilotId: string;
  readonly orders: Order[];
}

export interface DeliveryResult {
  readonly assignments: Map<string, string>;
  readonly pilotRoutes: Map<string, Order[]>;
}

export interface DeliveryConfig {
  readonly timeWindowMins: number;
  readonly currentTime: number;
  readonly nearbyDistanceThreshold: number;
}
