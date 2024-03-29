import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./auth-service.service";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService,private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const isAuthenticated = this.authService.getIsAuthenticated();

      if(!isAuthenticated){
        this.router.navigate(['/login']);
      }

      return isAuthenticated;
  }

}
