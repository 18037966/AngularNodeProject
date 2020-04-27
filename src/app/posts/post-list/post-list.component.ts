import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  // posts = [
  //   {title: "First Post", content: "This is first posts content"},
  //   {title: "Second Post", content: "This is second posts content"},
  //   {title: "Third Post", content: "This is third posts content"}
  // ];

  posts: Post[] = [];
  isLoading = false;
  postsService: PostsService;

  private postsSub: Subscription;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  ngOnInit(){
    this.isLoading = true;
    //getPosts doesnt return anything. We simply trigger http request
    this.postsService.getPosts();
    //this.posts = this.postsService.returnPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

   ngOnDestroy(){
     this.postsSub.unsubscribe();
   }
}
