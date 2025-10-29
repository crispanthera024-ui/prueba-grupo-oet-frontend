export interface Owner {
  id?: number;
  document_number?: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  address?: string | null;
  phone?: string | null;
  city?: string | null;
  email?: string | null;
  // compatibility field if some endpoints return combined name
  name?: string;
}
