import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  loading = signal(false);
  error = signal('');
  success = signal('');
  editing = signal(false);
  vehicleId: string | null = null;
  // owner/driver selection mode
  ownerMode = signal<'new' | 'existing'>('new');
  driverMode = signal<'new' | 'existing'>('new');
  existingOwnerId: number | null = null;
  existingDriverId: number | null = null;
  ownerOptions = signal<User[]>([]);
  driverOptions = signal<User[]>([]);
  ownerOptionsLoading = signal(false);
  driverOptionsLoading = signal(false);
  ownerOptionsError = signal('');
  driverOptionsError = signal('');

  // vehicle fields
  license_plate = '';
  brand = '';
  color: string | null = null;
  type = 'private';

  // owner
  owner_document_number = '';
  owner_first_name = '';
  owner_last_name = '';
  owner_email = '';

  // driver
  driver_document_number = '';
  driver_first_name = '';
  driver_last_name = '';
  driver_email = '';

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private users: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Preload options for selects
    this.loadOwnerOptions();
    this.loadDriverOptions();
    if (id) {
      this.editing.set(true);
      this.vehicleId = id;
      this.loadVehicle(id);
    }
  }

  private loadVehicle(id: string) {
    this.loading.set(true);
    this.vehicleService.get(id).subscribe({
      next: (v) => {
        this.license_plate = v.license_plate ?? '';
        this.brand = v.brand ?? '';
        this.color = v.color ?? null;
        this.type = v.type ?? 'private';
        // set modes based on presence of ids
        if (v.owner_id) {
          this.ownerMode.set('existing');
          this.existingOwnerId = Number(v.owner_id);
        }
        if (v.driver_id) {
          this.driverMode.set('existing');
          this.existingDriverId = Number(v.driver_id);
        }
        if (v.owner) {
          this.owner_document_number = v.owner.document_number ?? '';
          this.owner_first_name = v.owner.first_name ?? '';
          this.owner_last_name = v.owner.last_name ?? '';
          this.owner_email = v.owner.email ?? '';
        }
        if (v.driver) {
          this.driver_document_number = v.driver.document_number ?? '';
          this.driver_first_name = v.driver.first_name ?? '';
          this.driver_last_name = v.driver.last_name ?? '';
          this.driver_email = v.driver.email ?? '';
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load vehicle');
      }
    });
  }

  loadOwnerOptions() {
    this.ownerOptionsLoading.set(true);
    this.ownerOptionsError.set('');
    this.users.list({ role: 'Owner' }).subscribe({
      next: (arr: User[]) => { this.ownerOptions.set(arr || []); this.ownerOptionsLoading.set(false); },
      error: (err: any) => { this.ownerOptionsLoading.set(false); this.ownerOptionsError.set(err?.error?.message || 'Failed to load owners'); }
    });
  }

  loadDriverOptions() {
    this.driverOptionsLoading.set(true);
    this.driverOptionsError.set('');
    this.users.list({ role: 'Driver' }).subscribe({
      next: (arr: User[]) => { this.driverOptions.set(arr || []); this.driverOptionsLoading.set(false); },
      error: (err: any) => { this.driverOptionsLoading.set(false); this.driverOptionsError.set(err?.error?.message || 'Failed to load drivers'); }
    });
  }

  cancel() {
    // navigate back to vehicles list
    this.router.navigate(['/admin/vehicles']);
  }

  submit() {
    this.error.set('');
    this.success.set('');
    this.loading.set(true);

    const payload: any = {
      vehicle: {
        license_plate: this.license_plate,
        brand: this.brand,
        color: this.color,
        type: this.type
      }
    };

    // Owner section: either reference existing by id or provide nested object
    if (this.ownerMode() === 'existing' && this.existingOwnerId) {
      payload.owner_id = this.existingOwnerId;
    } else {
      payload.owner = {
        document_number: this.owner_document_number,
        first_name: this.owner_first_name,
        last_name: this.owner_last_name,
        email: this.owner_email
      };
    }

    // Driver section
    if (this.driverMode() === 'existing' && this.existingDriverId) {
      payload.driver_id = this.existingDriverId;
    } else {
      payload.driver = {
        document_number: this.driver_document_number,
        first_name: this.driver_first_name,
        last_name: this.driver_last_name,
        email: this.driver_email
      };
    }

    const afterSuccess = (msg: string) => {
      this.loading.set(false);
      this.success.set(msg);
      setTimeout(() => this.router.navigate(['/admin/vehicles']), 600);
    };

    if (this.editing() && this.vehicleId) {
      this.vehicleService.updateFull(this.vehicleId, payload).subscribe({
        next: () => afterSuccess('Vehicle updated successfully'),
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Failed to update vehicle');
        }
      });
    } else {
      this.vehicleService.createFull(payload).subscribe({
        next: () => afterSuccess('Vehicle created successfully'),
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Failed to create vehicle');
        }
      });
    }
  }
}
