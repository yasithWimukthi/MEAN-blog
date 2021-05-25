import {Post} from "./post.model";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient,private router:Router) {
  }

  getPosts() {
    // return [...this.posts];
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      })
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};

    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe(response => {
        //console.log(response.message)
        const postId = response.postId;
        post.id = postId;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });

  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id, title, content};
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        /** update post array with new updated post*/
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }

  /** return single post object*/
  getPost(id: string) {
    return this.http.get<{_id:string,title:string,content:string}>('http://localhost:3000/api/posts/' + id);
  }
}
