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

    this.http.post<{message:string,postId:string}>('http://localhost:3000/api/posts',post)
      .subscribe(response =>{
        //console.log(response.message)
        const postId = response.postId;
        post.id = postId;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });

  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }

  deletePost(postId:string){
    this.http.delete('http://localhost:3000/api/posts/'+postId)
      .subscribe(()=>{
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      })
  }
}
