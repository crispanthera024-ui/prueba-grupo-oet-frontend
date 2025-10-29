import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Driver } from '../models/driver';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private api = 'http://127.0.0.1:8000/api/drivers';
  constructor(private http: HttpClient) {}

  list(): Observable<Driver[]> {
    return this.http.get<any>(this.api).pipe(map((res) => this.normalizeList(res)));
  }

  get(id: number): Observable<Driver> {
    return this.http.get<any>(`${this.api}/${id}`).pipe(map((res) => this.normalizeShow(res)));
  }

  create(payload: Partial<Driver>): Observable<Driver> {
    return this.http.post<Driver>(this.api, payload);
  }

  update(id: number, payload: Partial<Driver>): Observable<Driver> {
    return this.http.put<Driver>(`${this.api}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  private normalizeList(res: any): Driver[] {
    if (Array.isArray(res)) return res as Driver[];
    if (Array.isArray(res?.data)) return res.data as Driver[]; // Laravel paginator
    if (Array.isArray(res?.drivers?.data)) return res.drivers.data as Driver[];
    return [];
  }

  private normalizeShow(res: any): Driver {
    return (res?.driver ?? res?.data ?? res) as Driver;
  }
}
