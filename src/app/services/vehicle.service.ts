import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { Vehicle } from '../models/vehicle';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly base = 'http://127.0.0.1:8000/api';
  private readonly vehiclesPath = `${this.base}/vehicles`;
  private readonly vehiclePath = `${this.base}/vehicle`; // some backends expose singular
  constructor(private http: HttpClient) {}

  private listInvalidate$ = new Subject<void>();
  private listCache$?: Observable<Vehicle[]>;

  /** Cached list with manual invalidation. */
  listCached(): Observable<Vehicle[]> {
    if (!this.listCache$) {
      this.listCache$ = this.listInvalidate$.pipe(
        startWith(void 0),
        switchMap(() => this.fetchList()),
        shareReplay(1)
      );
    }
    return this.listCache$;
  }

  /** Raw list without caching. */
  private fetchList(): Observable<Vehicle[]> {
    // Try the conventional plural endpoint first, then fall back to singular if needed.
    return this.http.get<any>(this.vehiclesPath).pipe(
      map((res) => this.normalizeListResponse(res)),
      catchError(() =>
        this.http.get<any>(this.vehiclePath).pipe(map((res) => this.normalizeListResponse(res)))
      )
    );
  }

  /** Backwards-compatible method name used by existing code. */
  list(): Observable<Vehicle[]> { return this.listCached(); }

  listWithMeta(): Observable<{ data: Vehicle[]; total: number }> {
    return this.http.get<any>(this.vehiclesPath).pipe(
      map((res) => {
        const data = this.normalizeListResponse(res);
        const total =
          (typeof res?.meta?.total === 'number' && res.meta.total) ||
          (typeof res?.vehicles?.total === 'number' && res.vehicles.total) ||
          (Array.isArray(data) ? data.length : 0);
        return { data, total };
      })
    );
  }

  get(id: string | number): Observable<Vehicle> {
    return this.http.get<any>(`${this.vehiclesPath}/${id}`).pipe(
      map((res) => this.normalizeShowResponse(res))
    );
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
    return this.http.post<any>(this.vehiclesPath, payload).pipe(tap(() => this.invalidateListCache()));
  }

  /**
   * Update a vehicle with nested owner and driver payload.
   */
  updateFull(id: string | number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.vehiclesPath}/${id}`, payload).pipe(tap(() => this.invalidateListCache()));
  }

  update(id: string | number, payload: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.vehiclesPath}/${id}`, payload).pipe(tap(() => this.invalidateListCache()));
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.vehiclesPath}/${id}`).pipe(tap(() => this.invalidateListCache()));
  }

  invalidateListCache() {
    this.listInvalidate$.next();
  }

  private normalizeListResponse(res: any): Vehicle[] {
    // Accept a few common backend shapes
    if (Array.isArray(res)) return res as Vehicle[];
    if (Array.isArray(res?.data)) return res.data as Vehicle[];
    if (Array.isArray(res?.vehicles)) return res.vehicles as Vehicle[];
    if (Array.isArray(res?.vehicles?.data)) return res.vehicles.data as Vehicle[]; // Laravel paginated
    return [];
  }

  private normalizeShowResponse(res: any): Vehicle {
    // Accept common shapes for show endpoints
    const v: any = res?.vehicle ?? res?.data ?? res;
    if (v && typeof v === 'object') {
      // Ensure camelCase aliases exist if needed
      if (v.owner_id != null && v.ownerId == null) v.ownerId = v.owner_id;
      if (v.driver_id != null && v.driverId == null) v.driverId = v.driver_id;
      return v as Vehicle;
    }
    return v as Vehicle;
  }
}
