import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';
import { ColumnDef, createColumnHelper, getCoreRowModel, Table, TableOptions } from '@tanstack/table-core';

// Note: We're using table-core; rendering is handled manually in template

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.css']
})
export class VehiclesListComponent implements OnInit {
  loading = signal(false);
  error = signal('');
  rows = signal<Vehicle[]>([]);

  columns!: ColumnDef<Vehicle, any>[];

  private columnHelper = createColumnHelper<Vehicle>();

  constructor(private vehicles: VehicleService, private router: Router) {}

  ngOnInit(): void {
    this.columns = [
      this.columnHelper.accessor('license_plate', {
        header: 'Plate',
        cell: (info: any) => info.getValue(),
      }),
      this.columnHelper.accessor('brand', {
        header: 'Brand',
        cell: (info: any) => info.getValue() ?? '-',
      }),
      this.columnHelper.accessor('color', {
        header: 'Color',
        cell: (info: any) => info.getValue() ?? '-',
      }),
      this.columnHelper.accessor('type', {
        header: 'Type',
        cell: (info: any) => info.getValue() ?? '-',
      }),
      this.columnHelper.display({
        id: 'owner',
        header: 'Owner',
        cell: (info: any) => {
          const o = info.row.original.owner;
          return o ? `${o.first_name ?? ''} ${o.last_name ?? ''}`.trim() : '-';
        }
      }),
      this.columnHelper.display({
        id: 'driver',
        header: 'Driver',
        cell: (info: any) => {
          const d = info.row.original.driver;
          return d ? `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim() : '-';
        }
      }),
      this.columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: () => '—'
      })
    ];

    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.vehicles.list().subscribe({
      next: (arr) => {
        this.rows.set(arr);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load vehicles');
      }
    });
  }

  create() {
    this.router.navigate(['/admin/vehicles/new']);
  }

  edit(v: Vehicle) {
    // Future: implement edit route and form prefill
    // this.router.navigate([`/admin/vehicles/${v.id}/edit`]);
  }

  remove(v: Vehicle) {
    if (!v?.id) return;
    const ok = confirm(`Delete vehicle ${v.license_plate}?`);
    if (!ok) return;
    this.vehicles.delete(v.id as string).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.message || 'Failed to delete'),
    });
  }
}
