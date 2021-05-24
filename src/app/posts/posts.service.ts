import {Post} from "./post.model";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";

@Injectable()
export class PostService{
  private posts : Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http:HttpClient){}

  getPosts(){
    // return [...this.posts];
    this.http.get<{message:string,posts:any}>('http://localhost:3000/api/posts')
      .pipe(map(postData =>{
        return postData.posts.map(post =>{
          return{
            title: post.title,
            content: post.content,
            id:post._id,
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      })
  }

  addPost(title: string,content: string){
    const post: Post = {id:null,title: title, content: content};

    this.http.post<{message:string}>('http://localhost:3000/api/posts',post)
      .subscribe(response =>{
        console.log(response.message)
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });

  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }
}
