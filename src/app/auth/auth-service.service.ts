import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token:string;
  private isAuthenticated:boolean = false;
  private _userId:string;
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
    this.http.post<{ token: string, expiresIn: number,userId:string }>('http://localhost:3000/api/user/login',authData)
      .subscribe(response =>{
        this.token = response.token;
        if (this.token){

          const expiresIn = response.expiresIn;
          this._setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this._userId = response.userId;
          this.authStateListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn*1000);
          this._saveAuthData(this.token,expirationDate,this._userId);
          this.router.navigate(['/']);
        }

      })
  }

  getToken():string{
    return this.token;
  }

  getAuthStateListener():Observable<boolean>{
    return this.authStateListener.asObservable();
  }

  getIsAuthenticated():boolean{
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this._userId;
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
      this._userId = authInfo.userId;
      this.authStateListener.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    this.router.navigate(['/']);
    this._clearAuthData();
    this._userId = null;
    clearTimeout(this.tokenTimer);
  }

  private _saveAuthData(token:string,expirationDate:Date,userId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userId',userId);
  }

  private _clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private _getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) return;

    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId : userId
    }
  }

  private _setAuthTimer(duration:number){
    this.tokenTimer =  setTimeout(()=>{
      this.logout();
    },duration*1000);
  }

}
