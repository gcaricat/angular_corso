import {NgModule} from "@angular/core";
import {Routes, RouterModule, Router} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {UsersComponent} from "./users/users.component";
import {UserComponent} from "./users/user/user.component";
import {ServersComponent} from "./servers/servers.component";
import {ServerComponent} from "./servers/server/server.component";
import {EditServerComponent} from "./servers/edit-server/edit-server.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {AuthGuardService} from "./auth-guard.service";
import {CanDeactivateGuardService} from "./servers/edit-server/can-deactivate-guard.service";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {ServerResolverService} from "./servers/server/server-resolver.service";


const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'users', component: UsersComponent, children: [
      { path: ':id/:name', component: UserComponent},
    ]
  },
  {
    path: 'servers',
    // canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    component: ServersComponent,
    children: [
      { path: ':id', component: ServerComponent, resolve: {server: ServerResolverService, } },
      { path: ':id/edit', component: EditServerComponent, canDeactivate: [CanDeactivateGuardService]},
    ] },
  // {path: 'not-found', component: PageNotFoundComponent},
  {path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not found!'} },
  // ** catch all path you don't know it's the last route
  {path: '**', redirectTo: '/not-found'},
  //{ path: '', redirectTo: '/somewhere-else', pathMatch: 'full' }

];

@NgModule({
  imports: [
    /*
      when we are use the usehash true the url path contain a hash symbol
      The hash inform the web server only care the part of url before this hashtag
      The after part will be ignored by the webserver
     */
    // RouterModule.forRoot(appRoutes, {useHash: true} )
    RouterModule.forRoot(appRoutes )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
