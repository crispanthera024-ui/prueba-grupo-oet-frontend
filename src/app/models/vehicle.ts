import { Owner } from './owner';
import { Driver } from './driver';

export interface Vehicle {
  id?: string; // backend returns UUID string
  license_plate: string;
  brand?: string;
  color?: string | null;
  type?: string;
  // API may return both snake_case and camelCase ids
  owner_id?: number;
  driver_id?: number;
  ownerId?: number;
  driverId?: number;
  owner?: Owner | null;
  driver?: Driver | null;
  created_at?: string;
  updated_at?: string;
}
