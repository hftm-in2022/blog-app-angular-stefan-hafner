import { PassedInitialConfig, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../../../../environments/environment';

const redirectUrl = environment.production
  ? `${environment.appUrl}/blog-overview`
  : `${window.location.origin}/blog-overview`;

const postLogoutRedirectUri = environment.production
  ? `${environment.appUrl}/blog-overview`
  : `${window.location.origin}/blog-overview`;

const silentRenewUrl = environment.production
  ? `${environment.appUrl}/silent-renew.html`
  : `${window.location.origin}/silent-renew.html`;

export const authConfig: PassedInitialConfig = {
  config: {
    authority: `${environment.authUrl}/realms/blog`,
    redirectUrl: redirectUrl,
    postLogoutRedirectUri: postLogoutRedirectUri,
    clientId: 'spa-blog',
    scope: 'openid profile email offline_access blogs', // 'openid profile offline_access ' + your scopes
    responseType: 'code',
    silentRenew: true,
    silentRenewUrl: silentRenewUrl,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    logLevel: LogLevel.Debug,
    secureRoutes: [environment.backendUrl],
  },
};
