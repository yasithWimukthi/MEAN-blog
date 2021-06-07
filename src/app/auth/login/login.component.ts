import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth-service.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  isLoading = false;
  private _authSubscription: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this._authSubscription = this.authService.getAuthStateListener().subscribe(
      authState => this.isLoading = false
    );
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) return;
    this.isLoading = true;
    this.authService.login(loginForm.value.email,loginForm.value.password);
  }

  ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }
}
