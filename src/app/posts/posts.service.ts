import {Post} from "./post.model";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class PostService{
  private posts : Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http:HttpClient){}

  getPosts(){
    // return [...this.posts];
    this.http.get<{message:string,posts:Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postUpdated.next([...this.posts]);
      })
  }

  addPost(title: string,content: string){
    const post: Post = {id:null,title: title, content: content};
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }
}
