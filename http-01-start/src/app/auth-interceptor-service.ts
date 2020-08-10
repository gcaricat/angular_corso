import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Request is on its way");
    console.log(req.url);
    // const modifiedRequest = req.clone({url: 'some-new-url'});
    // const modifiedRequest = req.clone({params: 'some param'});
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth','xyz')
    });
    return next.handle(modifiedRequest);
    // return next.handle(modifiedRequest).pipe(
    //   //tap takes an input observable perform some action and returns the same input observable.
    //   //map is for transfromation/mapping of the Data in the pipe
    //   tap(event => {
    //    console.log(event)
    //     if(event.type === HttpEventType.Response){
    //       console.log('Response arrived, body data: ');
    //       console.log(event.body);
    //     }
    //
    //   })
    // );
  }
}
