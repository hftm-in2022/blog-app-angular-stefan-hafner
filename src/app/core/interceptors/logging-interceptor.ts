import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Http request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  return next(req).pipe(
    tap({
      next: (event) => {
        console.log('HTTP response:', {
          url: req.url,
          event,
        });
      },
      error: (error) => {
        return throwError(() => error);
      },
    }),
  );
};
