import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Owner } from '../models/owner';

@Injectable({ providedIn: 'root' })
export class OwnerService {
  private api = 'http://127.0.0.1:8000/api/owners';
  constructor(private http: HttpClient) {}

  list(): Observable<Owner[]> {
    return this.http.get<Owner[]>(this.api);
  }

  get(id: number): Observable<Owner> {
    return this.http.get<Owner>(`${this.api}/${id}`);
  }

  create(payload: Partial<Owner>): Observable<Owner> {
    return this.http.post<Owner>(this.api, payload);
  }

  update(id: number, payload: Partial<Owner>): Observable<Owner> {
    return this.http.put<Owner>(`${this.api}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
