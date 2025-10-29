import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
		{ path: 'admin', loadComponent: () => import('./components/admin-home/admin-home.component').then(m => m.AdminHomeComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
			{ path: 'admin/vehicles', loadComponent: () => import('./components/vehicles-list/vehicles-list.component').then(m => m.VehiclesListComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
		{ path: 'admin/vehicles/new', loadComponent: () => import('./components/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
		{ path: 'admin/vehicles/:id', loadComponent: () => import('./components/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
		{ path: 'admin/vehicles/:id/edit', loadComponent: () => import('./components/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
		// Owners CRUD
		{ path: 'admin/owners', loadComponent: () => import('./components/owners-list/owners-list.component').then(m => m.OwnersListComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
		{ path: 'admin/owners/new', loadComponent: () => import('./components/owner-form/owner-form.component').then(m => m.OwnerFormComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
		{ path: 'admin/owners/:id', loadComponent: () => import('./components/owner-detail/owner-detail.component').then(m => m.OwnerDetailComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
		{ path: 'admin/owners/:id/edit', loadComponent: () => import('./components/owner-form/owner-form.component').then(m => m.OwnerFormComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
	{ path: '', redirectTo: '/admin', pathMatch: 'full' },
	{ path: '**', redirectTo: '/admin' }
];
