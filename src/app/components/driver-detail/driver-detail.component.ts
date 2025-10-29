import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver';

@Component({
  selector: 'app-driver-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  loading = signal(false);
  error = signal('');
  driver = signal<Driver | null>(null);
  id: number | null = null;

  constructor(private drivers: DriverService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.fetch(this.id);
    } else {
      this.error.set('Driver id not provided');
    }
  }

  fetch(id: number) {
    this.loading.set(true);
    this.error.set('');
    this.drivers.get(id).subscribe({
      next: (d) => { this.driver.set(d); this.loading.set(false); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to load driver'); }
    });
  }

  back() { this.router.navigate(['/admin/drivers']); }
  edit() { if (this.id != null) this.router.navigate([`/admin/drivers/${this.id}/edit`]); }
  remove() {
    if (this.id == null) return;
    const ok = confirm('Delete driver?');
    if (!ok) return;
    this.drivers.delete(this.id).subscribe({
      next: () => this.router.navigate(['/admin/drivers']),
      error: (err) => this.error.set(err?.error?.message || 'Failed to delete')
    });
  }
}
