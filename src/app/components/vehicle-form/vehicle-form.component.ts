import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent {
  loading = signal(false);
  error = signal('');
  success = signal('');

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

  constructor(private vehicleService: VehicleService, private router: Router) {}

  cancel() {
    // navigate back to admin home
    this.router.navigate(['/admin']);
  }

  submit() {
    this.error.set('');
    this.success.set('');
    this.loading.set(true);

    const payload = {
      vehicle: {
        license_plate: this.license_plate,
        brand: this.brand,
        color: this.color,
        type: this.type
      },
      owner: {
        document_number: this.owner_document_number,
        first_name: this.owner_first_name,
        last_name: this.owner_last_name,
        email: this.owner_email
      },
      driver: {
        document_number: this.driver_document_number,
        first_name: this.driver_first_name,
        last_name: this.driver_last_name,
        email: this.driver_email
      }
    };

    this.vehicleService.createFull(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.success.set('Vehicle created successfully');
        // redirect to admin home or vehicle list after creation
        setTimeout(() => this.router.navigate(['/admin']), 800);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to create vehicle');
      }
    });
  }
}
