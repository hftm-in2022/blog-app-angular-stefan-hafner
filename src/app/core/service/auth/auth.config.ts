import { PassedInitialConfig, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../../../../environments/environment';

const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '';
const postLogoutRedirectUri =
  typeof window !== 'undefined' ? window.location.origin : '';
const silentRenewUrl =
  typeof window !== 'undefined'
    ? window.location.origin + '/silent-renew.html'
    : '';

export const authConfig: PassedInitialConfig = {
  config: {
    authority:
      'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/blog',
    redirectUrl: redirectUrl,
    postLogoutRedirectUri: postLogoutRedirectUri,
    clientId: 'spa-blog',
    scope: 'openid profile email offline_access blogs', // 'openid profile offline_access ' + your scopes
    responseType: 'code',
    silentRenew: true,
    //  useRefreshToken: true,
    silentRenewUrl: silentRenewUrl,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    logLevel: LogLevel.Debug,
    secureRoutes: [environment.backendUrl],
  },
};
