export interface User {
  id: number;
  name?: string | null;
  email?: string | null;
  role?: string | null; // 'Owner' | 'Driver' | other
  document_number?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}
