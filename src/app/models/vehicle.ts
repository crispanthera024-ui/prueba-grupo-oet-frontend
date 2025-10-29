import { Owner } from './owner';
import { Driver } from './driver';

export interface Vehicle {
  id?: string; // backend returns UUID string
  license_plate: string;
  brand?: string;
  color?: string | null;
  type?: string;
  ownerId?: number;
  driverId?: number;
  owner?: Owner | null;
  driver?: Driver | null;
}
