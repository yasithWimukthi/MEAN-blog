import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Post} from "../post.model";
import {PostService} from "../posts.service";
import {PageEvent} from "@angular/material/paginator";

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
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private postSub:Subscription;

  constructor(public postService:PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((posts:Post[]) => {
        this.isLoading = false;
        this.posts = posts
      })
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
  }
}
