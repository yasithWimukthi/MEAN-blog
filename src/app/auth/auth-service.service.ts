import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token:string;
  private isAuthenticated:boolean = false;
  private authStateListener = new Subject<boolean>();

  constructor(private http : HttpClient,private router: Router) { }

  createUser(email:string,password:string){
    const authData : AuthData = {email:email,password:password};
    this.http.post('http://localhost:3000/api/user/signup',authData)
      .subscribe(response =>{
        console.log(response);
      })
  }

  login(email:string,password:string){
    const authData : AuthData = {email:email,password:password};
    this.http.post<{ token: string }>('http://localhost:3000/api/user/login',authData)
      .subscribe(response =>{
        this.token = response.token;
        if (this.token){
          this.isAuthenticated = true;
          this.authStateListener.next(true);
          this.router.navigate(['/']);
        }

      })
  }

  getToken(){
    return this.token;
  }

  getAuthStateListener(){
    return this.authStateListener.asObservable();
  }

  getIsAuthenticated(){
    return this.isAuthenticated;
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    this.router.navigate(['/']);
  }
}
