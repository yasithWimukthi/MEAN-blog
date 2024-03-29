import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Post} from "../post.model";
import {PostService} from "../posts.service";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth-service.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  // posts = [
  //   {title:'First post',content:'First post content'},
  //   {title:'Second post',content:'Second post content'},
  // ];
  posts:Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  isUserAuthenticated = false;
  userId:string;
  private postSub:Subscription;
  private authStateSubscription : Subscription;

  constructor(public postService:PostService,private authService:AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData : {posts:Post[],postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      })

    this.isUserAuthenticated = this.authService.getIsAuthenticated();

    this.authStateSubscription = this.authService.getAuthStateListener().subscribe(
      isUserAuthenticated => {
        this.isUserAuthenticated = isUserAuthenticated;
        this.userId = this.authService.getUserId();
      }
    );
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStateSubscription.unsubscribe();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id)
      .subscribe(()=>{
        this.postService.getPosts(this.postsPerPage,this.currentPage);
      },
        () => this.isLoading = false
      );
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
  }
}
