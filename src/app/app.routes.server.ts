import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic routes should not be prerendered; serve them at request time
  { path: 'admin/vehicles/:id', renderMode: RenderMode.Server },
  { path: 'admin/vehicles/:id/edit', renderMode: RenderMode.Server },
  { path: 'admin/owners/:id', renderMode: RenderMode.Server },
  { path: 'admin/owners/:id/edit', renderMode: RenderMode.Server },

  // Fallback to prerender for other static routes
  { path: '**', renderMode: RenderMode.Prerender }
];
