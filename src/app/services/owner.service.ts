import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Owner } from '../models/owner';

@Injectable({ providedIn: 'root' })
export class OwnerService {
  private api = 'http://127.0.0.1:8000/api/owners';
  constructor(private http: HttpClient) {}

  list(): Observable<Owner[]> {
    return this.http.get<any>(this.api).pipe(map((res) => this.normalizeList(res)));
  }

  get(id: number): Observable<Owner> {
    return this.http.get<any>(`${this.api}/${id}`).pipe(map((res) => this.normalizeShow(res)));
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

  private normalizeList(res: any): Owner[] {
    if (Array.isArray(res)) return res as Owner[];
    if (Array.isArray(res?.data)) return res.data as Owner[]; // Laravel paginator
    if (Array.isArray(res?.owners?.data)) return res.owners.data as Owner[];
    return [];
  }

  private normalizeShow(res: any): Owner {
    return (res?.owner ?? res?.data ?? res) as Owner;
  }
}
