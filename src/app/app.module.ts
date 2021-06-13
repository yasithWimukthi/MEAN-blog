import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import {PostService} from "./posts/posts.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthInterceptor} from "./auth/auth-interceptor";
import {ErrorInterceptor} from "./error.interceptor";
import { ErrorComponent } from './error/error/error.component';
import {AngularMaterialModule} from "./angular-material/angular-material.module";


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [
    PostService,
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptor,multi:true}
  ],
  bootstrap: [AppComponent],
  entryComponents : [ErrorComponent]
})

export class AppModule { }
