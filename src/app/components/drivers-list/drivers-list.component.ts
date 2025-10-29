import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver';

@Component({
  selector: 'app-drivers-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.css']
})
export class DriversListComponent implements OnInit {
  loading = signal(false);
  error = signal('');
  rows = signal<Driver[]>([]);

  constructor(private drivers: DriverService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.drivers.list().subscribe({
      next: (arr) => { this.rows.set(arr || []); this.loading.set(false); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to load drivers'); }
    });
  }

  create() { this.router.navigate(['/admin/drivers/new']); }
  view(d: Driver) { if (d?.id != null) this.router.navigate([`/admin/drivers/${d.id}`]); }
  edit(d: Driver) { if (d?.id != null) this.router.navigate([`/admin/drivers/${d.id}/edit`]); }
  remove(d: Driver) {
    if (d?.id == null) return;
    const ok = confirm(`Delete driver ${d.first_name ?? ''} ${d.last_name ?? ''}?`);
    if (!ok) return;
    this.drivers.delete(d.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.message || 'Failed to delete')
    });
  }
}
