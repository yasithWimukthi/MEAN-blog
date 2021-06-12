import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

export class ErrorInterceptor implements HttpInterceptor{

  constructor(){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // @ts-ignore
    return next.handle(req).pipe(
      catchError((error:HttpErrorResponse) =>{
        alert(error.error.message);
        return throwError(error);
      })
    );
  }

}
