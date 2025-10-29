import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.css']
})
export class DriverFormComponent implements OnInit {
  loading = signal(false);
  error = signal('');
  success = signal('');
  editing = signal(false);
  id: number | null = null;

  // fields
  document_number = '';
  first_name = '';
  middle_name: string | null = null;
  last_name = '';
  address: string | null = null;
  phone: string | null = null;
  city: string | null = null;
  email: string | null = null;

  constructor(private drivers: DriverService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing.set(true);
      this.id = Number(idParam);
      this.load(this.id);
    }
  }

  private load(id: number) {
    this.loading.set(true);
    this.drivers.get(id).subscribe({
      next: (d: Driver) => {
        this.document_number = d.document_number || '';
        this.first_name = d.first_name || '';
        this.middle_name = d.middle_name ?? null;
        this.last_name = d.last_name || '';
        this.address = d.address ?? null;
        this.phone = d.phone ?? null;
        this.city = d.city ?? null;
        this.email = d.email ?? null;
        this.loading.set(false);
      },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to load driver'); }
    });
  }

  save() {
    this.error.set('');
    this.success.set('');
    this.loading.set(true);
    const payload: Partial<Driver> = {
      document_number: this.document_number,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      address: this.address,
      phone: this.phone,
      city: this.city,
      email: this.email,
    };

    const onOk = (msg: string) => {
      this.loading.set(false);
      this.success.set(msg);
      setTimeout(() => this.router.navigate(['/admin/drivers']), 500);
    };

    if (this.editing() && this.id != null) {
      this.drivers.update(this.id, payload).subscribe({
        next: () => onOk('Driver updated'),
        error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to update'); }
      });
    } else {
      this.drivers.create(payload).subscribe({
        next: () => onOk('Driver created'),
        error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to create'); }
      });
    }
  }

  cancel() { this.router.navigate(['/admin/drivers']); }
}
