import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { Owner } from '../../models/owner';

@Component({
  selector: 'app-owner-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owner-detail.component.html',
  styleUrls: ['./owner-detail.component.css']
})
export class OwnerDetailComponent implements OnInit {
  loading = signal(false);
  error = signal('');
  owner = signal<Owner | null>(null);
  id: number | null = null;

  constructor(private owners: OwnerService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.fetch(this.id);
    } else {
      this.error.set('Owner id not provided');
    }
  }

  fetch(id: number) {
    this.loading.set(true);
    this.error.set('');
    this.owners.get(id).subscribe({
      next: (o) => { this.owner.set(o); this.loading.set(false); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to load owner'); }
    });
  }

  back() { this.router.navigate(['/admin/owners']); }
  edit() { if (this.id != null) this.router.navigate([`/admin/owners/${this.id}/edit`]); }
  remove() {
    if (this.id == null) return;
    const ok = confirm('Delete owner?');
    if (!ok) return;
    this.owners.delete(this.id).subscribe({
      next: () => this.router.navigate(['/admin/owners']),
      error: (err) => this.error.set(err?.error?.message || 'Failed to delete')
    });
  }
}
