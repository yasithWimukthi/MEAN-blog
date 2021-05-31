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
            imagePath : null
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      })
  }

  addPost(title: string, content: string,image:File) {
    const post: Post = {id: null, title: title, content: content,imagePath:null};
    const postData = new FormData();
    postData.append('title',title);
    postData.append('content',content);
    postData.append('image',image);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(response => {
        //console.log(response.message)
        const postId = response.post.id;
        const imagePath = response.post.imagePath;
        post.id = postId;
        post.imagePath = imagePath;
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

  updatePost(id: string, title: string, content: string,image: File | string) {
    //const post: Post = {id, title, content,imagePath:null};
    let postData:FormData | Post;
    if(typeof (image) === 'object'){
      /**if user changed image*/
      postData = new FormData();
      postData.append('id',id);
      postData.append('title',title);
      postData.append('content',content);
      postData.append('image',image,title);
    }else{
      /**user does not change image*/
      postData = {
        id,
        title,
        content,
        imagePath : image
      }
    }

    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        /** update post array with new updated post*/
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);

        const post:Post = {
          id,
          title,
          content,
          imagePath : response.imagePath
        };

        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }

  /** return single post object*/
  getPost(id: string) {
    return this.http.get<{_id:string,title:string,content:string,imagePath:string}>('http://localhost:3000/api/posts/' + id);
  }
}
