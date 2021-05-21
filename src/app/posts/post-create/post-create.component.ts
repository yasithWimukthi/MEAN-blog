import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  newPost = 'NO CONTENT' ;
  enteredValue = '';

  constructor() { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  onAddPost() {
    this.newPost = this.enteredValue;
  }
}
