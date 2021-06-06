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
  // @ts-ignore
  private tokenTimer : NodeJS.Timer;

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
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login',authData)
      .subscribe(response =>{
        this.token = response.token;
        if (this.token){

          const expiresIn = response.expiresIn;
          this._setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this.authStateListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn*1000);
          this._saveAuthData(this.token,expirationDate);
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

  autoAuthUser(){
    const authInfo = this._getAuthData();

    if (!authInfo) return;

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this._setAuthTimer(expiresIn/1000);
      this.authStateListener.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    this.router.navigate(['/']);
    this._clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private _saveAuthData(token:string,expirationDate:Date){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
  }

  private _clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private _getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate) return;

    return{
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  private _setAuthTimer(duration:number){
    this.tokenTimer =  setTimeout(()=>{
      this.logout();
    },duration*1000);
  }

}
