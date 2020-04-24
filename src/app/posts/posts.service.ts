import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: "root"})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(){
      //return [...this.posts];
      this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
          .subscribe((postData) => {
            this.posts = postData.posts;
            this.postsUpdated.next([...this.posts]);//pass a copy of the post so that we cannot edit the post in the service
          });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();//it returns an object we can listen but cannot emit
  }

  addPost(title: string, content: string){
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
             .subscribe((responseData) => {
               console.log(responseData.message);
               this.posts.push(post);//only push this post if we get a successfull post from the server side
               this.postsUpdated.next([...this.posts]);//this is a copy of the posts after it was updated by the previous line which is line 18
             });

  }


//Observables are objects that hepls to pass data around

}
