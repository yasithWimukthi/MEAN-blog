import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {PostService} from "../posts.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Post} from "../post.model";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  newPost = 'NO CONTENT' ;
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private postId:string;
  private post:Post;

  constructor(public postService:PostService, public route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postService.getPost(this.postId);
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  // tslint:disable-next-line:typedef
  onAddPost(form: NgForm) {
    if(form.invalid) return;
    this.postService.addPost(form.value.title,form.value.content);
    form.resetForm();
  }
}
