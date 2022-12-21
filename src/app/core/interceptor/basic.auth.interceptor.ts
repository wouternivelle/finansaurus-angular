import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let auth = sessionStorage.getItem('auth')!;
    if (auth) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${auth}`
        }
      });
    }

    return next.handle(request);
  }
}
