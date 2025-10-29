import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { Owner } from '../../models/owner';

@Component({
  selector: 'app-owner-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './owner-form.component.html',
  styleUrls: ['./owner-form.component.css']
})
export class OwnerFormComponent implements OnInit {
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

  constructor(private owners: OwnerService, private route: ActivatedRoute, private router: Router) {}

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
    this.owners.get(id).subscribe({
      next: (o: Owner) => {
        this.document_number = o.document_number || '';
        this.first_name = o.first_name || '';
        this.middle_name = o.middle_name ?? null;
        this.last_name = o.last_name || '';
        this.address = o.address ?? null;
        this.phone = o.phone ?? null;
        this.city = o.city ?? null;
        this.email = o.email ?? null;
        this.loading.set(false);
      },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to load owner'); }
    });
  }

  save() {
    this.error.set('');
    this.success.set('');
    this.loading.set(true);
    const payload: Partial<Owner> = {
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
      setTimeout(() => this.router.navigate(['/admin/owners']), 500);
    };

    if (this.editing() && this.id != null) {
      this.owners.update(this.id, payload).subscribe({
        next: () => onOk('Owner updated'),
        error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to update'); }
      });
    } else {
      this.owners.create(payload).subscribe({
        next: () => onOk('Owner created'),
        error: (err) => { this.loading.set(false); this.error.set(err?.error?.message || 'Failed to create'); }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/owners']);
  }
}
