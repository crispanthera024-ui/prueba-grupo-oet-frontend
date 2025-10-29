import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient) {}

  list(options?: { role?: 'Owner' | 'Driver' | string; q?: string }): Observable<User[]> {
    let params = new HttpParams();
    if (options?.role) params = params.set('role', options.role);
    if (options?.q) params = params.set('q', options.q);
    return this.http.get<any>(this.base, { params }).pipe(map((res) => this.normalizeList(res)));
  }

  get(id: number): Observable<User> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map((res) => this.normalizeShow(res)));
  }

  private normalizeList(res: any): User[] {
    if (Array.isArray(res)) return res as User[];
    if (Array.isArray(res?.data)) return res.data as User[];
    // Support non-paginated shape: { users: [...] }
    if (Array.isArray(res?.users)) return res.users as User[];
    if (Array.isArray(res?.users?.data)) return res.users.data as User[];
    return [];
  }

  private normalizeShow(res: any): User {
    return (res?.user ?? res?.data ?? res) as User;
  }
}
