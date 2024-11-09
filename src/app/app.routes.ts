import { Routes } from '@angular/router';

import { blogDetailResolver } from './feature/blog-detail-page/blog-detail-resolver';

export const routes: Routes = [
  {
    path: 'blog-overview', // Route for the blog overview page
    loadComponent: () =>
      import('./feature/blog-overview-page/blog-overview-page.component').then(
        (m) => m.BlogOverviewPageComponent,
      ),
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
    path: '', // Default route, redirects to the blog overview page
    redirectTo: '/blog-overview',
    pathMatch: 'full',
  },
  {
    path: '**', // Fallback route for undefined paths, redirects to blog overview
    redirectTo: '/blog-overview',
  },
];
