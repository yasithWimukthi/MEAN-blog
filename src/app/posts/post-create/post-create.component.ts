import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {PostService} from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  newPost = 'NO CONTENT' ;
  enteredContent = '';
  enteredTitle = '';

  constructor(public postService:PostService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  onAddPost(form: NgForm) {
    if(form.invalid) return;
    this.postService.addPost(form.value.title,form.value.content);
    form.resetForm();
  }
}
