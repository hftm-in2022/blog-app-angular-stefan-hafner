import { Routes } from '@angular/router';
import { BlogOverviewPageComponent } from './feature/blog-overview-page/blog-overview-page.component';
import { BlogDetailPageComponent } from './feature/blog-detail-page/blog-detail-page.component';
import { blogDetailResolver } from './feature/blog-detail-page/blog-detail-resolver';

export const routes: Routes = [
  {
    path: 'blog-overview', // Route for the blog overview page
    component: BlogOverviewPageComponent,
  },
  {
    path: 'blog-detail/:id', // Route for the blog detail page, expects an ID as parameter
    component: BlogDetailPageComponent,
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
