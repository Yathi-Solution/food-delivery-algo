import { OrderType } from '../interfaces/order.interface';

export const PRIORITY_MAP: Record<OrderType['value'], number> = {
  hot: 1,
  icecream: 2,
  frozen: 3,
  packed: 4,
} as const;

export const HOLD_TOLERANCE: Record<OrderType['value'], number> = {
  hot: 5,
  icecream: 10,
  frozen: 30,
  packed: 60,
} as const;

export const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  "A-A1": { "A-A2": 50, "B-B1": 700, "B-B2": 730, "C-C1": 1200, "C-C2": 1250, "D-D1": 1600, "D-D2": 1650 },
  "A-A2": { "A-A1": 50, "B-B1": 720, "B-B2": 700, "C-C1": 1230, "C-C2": 1180, "D-D1": 1670, "D-D2": 1620 },
  "B-B1": { "A-A1": 700, "A-A2": 720, "B-B2": 40, "C-C1": 500, "C-C2": 550, "D-D1": 1100, "D-D2": 1150 },
  "B-B2": { "A-A1": 730, "A-A2": 700, "B-B1": 40, "C-C1": 540, "C-C2": 500, "D-D1": 1150, "D-D2": 1100 },
  "C-C1": { "A-A1": 1200, "A-A2": 1230, "B-B1": 500, "B-B2": 540, "C-C2": 60, "D-D1": 600, "D-D2": 650 },
  "C-C2": { "A-A1": 1250, "A-A2": 1180, "B-B1": 550, "B-B2": 500, "C-C1": 60, "D-D1": 650, "D-D2": 600 },
  "D-D1": { "A-A1": 1600, "A-A2": 1670, "B-B1": 1100, "B-B2": 1150, "C-C1": 600, "C-C2": 650, "D-D2": 45 },
  "D-D2": { "A-A1": 1650, "A-A2": 1620, "B-B1": 1150, "B-B2": 1100, "C-C1": 650, "C-C2": 600, "D-D1": 45 }
} as const;

export const NEARBY_DISTANCE_THRESHOLD = 100;
