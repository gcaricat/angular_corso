import {Injectable} from "@angular/core";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {Post} from "./post.model";
import {catchError, map, tap} from "rxjs/operators";
import {Subject, throwError} from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string){
    const postData: Post = {title: title, content: content};

    this.http
      .post<{ name: string }>( //{ name: string } because the post return a property object {name: "-L_vasdoj"}
        'https://angular-corso-http.firebaseio.com/posts.json',
        postData,
        {
          /**
           * The consoleLog responseData return a value determinated from observe if I've observe response return the complete
           * httpResponse with header body status ecc. If I've body return only the value of response by the server.
           * rememmber body is default we have also events
           */
          // observe: 'body' //the body means that I get that response data extracted and converted to a Javascript
          observe: 'response' //
        }
      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      } );
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print','pretty');
    searchParams = searchParams.append('custom','key');
   return this.http
      .get<{ [key: string]: Post }>(
        'https://angular-corso-http.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello',}),
          // params: new HttpParams().set('print','pretty')
          params: searchParams,
          responseType: 'json'
        }
      )
      .pipe(
        map( responseData =>{
          const postsArray: Post[] = [];
          for(const key in responseData){

            if(responseData.hasOwnProperty(key)){
              //{...} pull out all key-values pairs of that nested object
              postsArray.push({...responseData[key], id: key});
            }
          }
          //retur to the subscribe
          return postsArray;
        }),
        catchError(errorRes => {
          //send to analytcs server
          return throwError(errorRes);
        })
      );
      //.subscribe(posts =>{});
  }

  deletePosts(){
    return this.http.delete(
      'https://angular-corso-http.firebaseio.com/posts.json',
      {
        observe: 'events', //remember body is default
        /**
         * //default is json ( the data in the body of my response is JSON and that tells Angular that it
         * should automatically parse it and convert it to a Javascript object
         */
        responseType: 'json'
      }
    ).pipe(
      tap(event =>{
        /***
         * we have observe events and this return two output the first one logs an empty object and
         * the second one is the HttpResponse
         */
        if (event.type === HttpEventType.Sent){
          console.log("Pluto ");
        }

        if (event.type === HttpEventType.Response){
          console.log("Pippo "+event.body);
        }
      })
    );
  }
}
