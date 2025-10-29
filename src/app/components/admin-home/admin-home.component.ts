import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VehicleService } from '../../services/vehicle.service';
import { OwnerService } from '../../services/owner.service';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  user = signal<any>(null);
  // Placeholder counters; in a follow-up we can fetch these from the API
  vehiclesCount = signal<number | string>('-');
  ownersCount = signal<number | string>('-');
  driversCount = signal<number | string>('-');

  constructor(
    private auth: AuthService,
    private router: Router,
    private vehicles: VehicleService,
    private owners: OwnerService,
    private drivers: DriverService
  ) {
    this.user.set(this.auth.getUser());
    // subscribe to changes
    this.auth.user$.subscribe(u => this.user.set(u));
  }

  ngOnInit(): void {
    this.loadCounts();
  }

  private loadCounts() {
    this.vehiclesCount.set('-');
    this.ownersCount.set('-');
    this.driversCount.set('-');

    this.vehicles.list().subscribe({
      next: arr => this.vehiclesCount.set(Array.isArray(arr) ? arr.length : 0),
      error: () => this.vehiclesCount.set('?')
    });

    this.owners.list().subscribe({
      next: arr => this.ownersCount.set(Array.isArray(arr) ? arr.length : 0),
      error: () => this.ownersCount.set('?')
    });

    this.drivers.list().subscribe({
      next: arr => this.driversCount.set(Array.isArray(arr) ? arr.length : 0),
      error: () => this.driversCount.set('?')
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
