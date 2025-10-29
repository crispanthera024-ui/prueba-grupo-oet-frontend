import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Vehicle } from '../models/vehicle';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly base = 'http://127.0.0.1:8000/api';
  private readonly vehiclesPath = `${this.base}/vehicles`;
  private readonly vehiclePath = `${this.base}/vehicle`; // some backends expose singular
  constructor(private http: HttpClient) {}

  list(): Observable<Vehicle[]> {
    // Try the conventional plural endpoint first, then fall back to singular if needed.
    return this.http.get<any>(this.vehiclesPath).pipe(
      map((res) => this.normalizeListResponse(res)),
      catchError(() =>
        this.http.get<any>(this.vehiclePath).pipe(map((res) => this.normalizeListResponse(res)))
      )
    );
  }

  get(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.vehiclesPath}/${id}`);
  }

  create(payload: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.vehiclesPath, payload);
  }

  /**
   * Create a vehicle together with owner and driver in a single request.
   * The backend payload is expected in the shape provided in the user's example:
   * {
   *   vehicle: { license_plate, brand, color, type },
   *   owner: { document_number, first_name, last_name, email },
   *   driver: { document_number, first_name, last_name, email }
   * }
   */
  createFull(payload: any): Observable<any> {
    // POST to the vehicles endpoint; adjust if backend expects a different URL
    return this.http.post<any>(this.vehiclesPath, payload);
  }

  update(id: number, payload: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.vehiclesPath}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.vehiclesPath}/${id}`);
  }

  private normalizeListResponse(res: any): Vehicle[] {
    // Accept a few common backend shapes
    if (Array.isArray(res)) return res as Vehicle[];
    if (Array.isArray(res?.data)) return res.data as Vehicle[];
    if (Array.isArray(res?.vehicles)) return res.vehicles as Vehicle[];
    return [];
  }
}
