import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';
import { OidcSecurityService, LoginResponse } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockOidcSecurityService: jasmine.SpyObj<OidcSecurityService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Mock OidcSecurityService
    mockOidcSecurityService = jasmine.createSpyObj('OidcSecurityService', [
      'authorize',
      'logoff',
      'checkAuth',
    ]);

    // Mock BehaviorSubject für den LoginResponse
    const loginResponseMock: LoginResponse = {
      isAuthenticated: true,
      userData: {
        sub: '12345',
        email_verified: true,
        preferred_username: 'john.doe@example.com',
        given_name: 'John',
        family_name: 'Doe',
        email: 'john.doe@example.com',
      } as User,
      accessToken: 'fake-access-token',
      idToken: 'fake-id-token',
      configId: 'config123',
      errorMessage: '',
    };

    mockOidcSecurityService.checkAuth.and.returnValue(of(loginResponseMock));

    // Mock Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OidcSecurityService, useValue: mockOidcSecurityService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return login response as observable', (done) => {
    const testLoginResponse: LoginResponse = {
      isAuthenticated: true,
      userData: null,
      accessToken: 'test-token',
      idToken: '',
      configId: '',
      errorMessage: '',
    };

    service.setLoginResponse(testLoginResponse);
    service.getLoginResponse().subscribe((response) => {
      expect(response).toEqual(testLoginResponse);
      done();
    });
  });

  it('should return correct token', () => {
    service.setLoginResponse({
      isAuthenticated: true,
      userData: null,
      accessToken: 'test-token',
      idToken: '',
      configId: '',
      errorMessage: '',
    });

    expect(service.getToken()).toBe('test-token');
  });

  it('should return null when user is not set', () => {
    service.setLoginResponse({
      isAuthenticated: false,
      userData: null,
      accessToken: '',
      idToken: '',
      configId: '',
      errorMessage: '',
    });

    expect(service.getUser()).toBeNull();
  });

  it('should return correct user', () => {
    const userMock: User = {
      sub: '12345',
      email_verified: true,
      preferred_username: 'john.doe@example.com',
      given_name: 'John',
      family_name: 'Doe',
      email: 'john.doe@example.com',
    };

    service.setLoginResponse({
      isAuthenticated: true,
      userData: userMock,
      accessToken: 'test-token',
      idToken: '',
      configId: '',
      errorMessage: '',
    });

    expect(service.getUser()).toEqual(userMock);
  });

  it('should return user initials correctly', () => {
    const userMock: User = {
      sub: '12345',
      email_verified: true,
      preferred_username: 'john.doe@example.com',
      given_name: 'John',
      family_name: 'Doe',
      email: 'john.doe@example.com',
    };

    service.setLoginResponse({
      isAuthenticated: true,
      userData: userMock,
      accessToken: 'test-token',
      idToken: '',
      configId: '',
      errorMessage: '',
    });

    expect(service.getUserInitials()).toBe('jd');
  });

  it('should return empty initials if user is not set', () => {
    service.setLoginResponse({
      isAuthenticated: false,
      userData: null,
      accessToken: '',
      idToken: '',
      configId: '',
      errorMessage: '',
    });

    expect(service.getUserInitials()).toBe('');
  });

  it('should call authorize on login', () => {
    service.login();
    expect(mockOidcSecurityService.authorize).toHaveBeenCalled();
  });

  it('should call logoff on logout', () => {
    mockOidcSecurityService.logoff.and.returnValue(of(null));

    service.logout();
    expect(mockOidcSecurityService.logoff).toHaveBeenCalled();
  });

  it('should handle post login and update login response', () => {
    service.handlePostLogin();

    expect(mockOidcSecurityService.checkAuth).toHaveBeenCalled();
    service.getLoginResponse().subscribe((response) => {
      expect(response.isAuthenticated).toBeTrue();
      expect(response.accessToken).toBe('fake-access-token');
    });
  });
});
