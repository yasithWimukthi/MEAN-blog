import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth-service.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  isUserAuthenticated: boolean = false;
  private authStateSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuthenticated();
    this.authStateSubscription = this.authService.getAuthStateListener().subscribe(
      isUserAuthenticated => this.isUserAuthenticated = isUserAuthenticated
    );
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
