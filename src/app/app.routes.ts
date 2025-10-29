import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
		{ path: 'admin', loadComponent: () => import('./components/admin-home/admin-home.component').then(m => m.AdminHomeComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
		{ path: 'admin/vehicles/new', loadComponent: () => import('./components/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent), canActivate: [() => import('./guards/auth.guard').then(m=>m.AuthGuard)] },
	{ path: '', redirectTo: '/admin', pathMatch: 'full' },
	{ path: '**', redirectTo: '/admin' }
];
