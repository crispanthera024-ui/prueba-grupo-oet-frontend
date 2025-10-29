import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { Owner } from '../../models/owner';

@Component({
  selector: 'app-owners-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owners-list.component.html',
  styleUrls: ['./owners-list.component.css']
})
export class OwnersListComponent implements OnInit {
  loading = signal(false);
  error = signal('');
  rows = signal<Owner[]>([]);

  constructor(private owners: OwnerService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.owners.list().subscribe({
      next: (arr) => { this.rows.set(arr || []); this.loading.set(false); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to load owners'); }
    });
  }

  create() {
    this.router.navigate(['/admin/owners/new']);
  }

  view(o: Owner) {
    if (!o?.id) return;
    this.router.navigate([`/admin/owners/${o.id}`]);
  }

  edit(o: Owner) {
    if (!o?.id) return;
    this.router.navigate([`/admin/owners/${o.id}/edit`]);
  }

  remove(o: Owner) {
    if (!o?.id) return;
    const ok = confirm(`Delete owner ${o.first_name ?? ''} ${o.last_name ?? ''}?`);
    if (!ok) return;
    this.owners.delete(o.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.message || 'Failed to delete')
    });
  }
}
