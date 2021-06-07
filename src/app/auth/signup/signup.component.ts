import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth-service.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  isLoading = false;
  private _authSubscription: Subscription;

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this._authSubscription = this.auth.getAuthStateListener().subscribe(
      authState => this.isLoading = false
    );
  }

  onSignup(signupForm: NgForm) {
    if (signupForm.invalid) return;
    this.isLoading = true;
    this.auth.createUser(signupForm.value.email,signupForm.value.password);
  }

  ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }
}
