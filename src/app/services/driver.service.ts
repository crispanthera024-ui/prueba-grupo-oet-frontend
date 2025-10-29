import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private api = 'http://127.0.0.1:8000/api/drivers';
  constructor(private http: HttpClient) {}

  list(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.api);
  }

  get(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.api}/${id}`);
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
}
