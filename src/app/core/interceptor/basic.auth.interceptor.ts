import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser = JSON.parse(sessionStorage.getItem('user')!);
    if (currentUser && currentUser.authData) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${currentUser.authData}`
        }
      });
    }

    return next.handle(request);
  }
}
