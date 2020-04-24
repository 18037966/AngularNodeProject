import { Post } from './post.model';
import { Subject } from 'rxjs';

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts(){
      return [...this.posts];
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();//it returns an object we can listen but cannot emit
  }

  addPost(title: string, content: string){
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);//this is a copy of the posts after it was updated by the previous line which is line 18
  }

//Observables are objects that hepls to pass data around

}
