import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {
  loading = signal(false);
  error = signal('');
  vehicle = signal<Vehicle | null>(null);
  id: string | null = null;

  constructor(
    private vehicles: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.fetch(this.id);
    } else {
      this.error.set('Vehicle id not provided');
    }
  }

  fetch(id: string) {
    this.loading.set(true);
    this.error.set('');
    this.vehicles.get(id).subscribe({
      next: (v) => {
        this.vehicle.set(v);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load vehicle');
      }
    });
  }

  back() {
    this.router.navigate(['/admin/vehicles']);
  }

  edit() {
    if (!this.id) return;
    this.router.navigate([`/admin/vehicles/${this.id}/edit`]);
  }

  remove() {
    const v = this.vehicle();
    if (!v?.id) return;
    const ok = confirm(`Delete vehicle ${v.license_plate}?`);
    if (!ok) return;
    this.vehicles.delete(v.id as string).subscribe({
      next: () => this.router.navigate(['/admin/vehicles']),
      error: (err) => this.error.set(err?.error?.message || 'Failed to delete'),
    });
  }
}
