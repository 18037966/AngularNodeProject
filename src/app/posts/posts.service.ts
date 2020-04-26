import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: "root"})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(){
      //return [...this.posts];
      this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
          .pipe(map((postData) => {
             return postData.posts.map(post => {
               return{
                title: post.title,
                content: post.content,
                id: post._id
               };
             });//this pipe is to convert the _id of database value to proper id.
          }))
          .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            this.postsUpdated.next([...this.posts]);//pass a copy of the post so that we cannot edit the post in the service
          });

      //return this.posts;
  }



  getPostUpdateListener(){
    return this.postsUpdated.asObservable();//it returns an object we can listen but cannot emit
  }

  addPost(title: string, content: string){
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
             .subscribe((responseData) => {
               const postId = responseData.postId;
               post.id = postId
               this.posts.push(post);//only push this post if we get a successfull post from the server side
               this.postsUpdated.next([...this.posts]);//this is a copy of the posts after it was updated by the previous line which is line 18
             });

  }

  deletePost(postId: string){
    this.http.delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(() => {
              const updatedPosts = this.posts.filter(post => post.id !== postId);
              this.posts = updatedPosts;
              this.postsUpdated.next([...this.posts]);
              console.log("Deleted");
            })
  }


//Observables are objects that hepls to pass data around

}
