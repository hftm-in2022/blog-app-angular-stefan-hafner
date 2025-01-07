import { Routes } from '@angular/router';

import { blogDetailResolver } from './feature/blog-detail-page/blog-detail-resolver';
import { blogOverviewResolver } from './feature/blog-overview-page/blog-overview-resolver';
import { isAuthenticatedGuard } from './core/service/auth/isAuthenticated.guard';

export const routes: Routes = [
  {
    path: '', // Default route, redirects to the blog overview page
    redirectTo: '/blog-overview',
    pathMatch: 'full',
  },
  {
    path: 'blog-overview', // Route for the blog overview page
    loadComponent: () =>
      import('./feature/blog-overview-page/blog-overview-page.component').then(
        (m) => m.BlogOverviewPageComponent,
      ),
    resolve: { blog: blogOverviewResolver }, // { blog: blogOverviewResolver },
    runGuardsAndResolvers: 'always', // Always run the resolver when navigating to this route
  },
  {
    path: 'blog-detail/:id', // Route for the blog detail page, expects an ID as parameter
    loadComponent: () =>
      import('./feature/blog-detail-page/blog-detail-page.component').then(
        (m) => m.BlogDetailPageComponent,
      ),
    resolve: { blog: blogDetailResolver }, // Applies the resolver to fetch blog details before loading the component
  },
  {
    path: 'blog-add', // Route for the blog add page,
    loadComponent: () =>
      import('./feature/blog-add-page/blog-add-page.component').then(
        (m) => m.BlogAddPageComponent,
      ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '**', // Fallback route for undefined paths, redirects to blog overview
    redirectTo: '/blog-overview',
  },
];
