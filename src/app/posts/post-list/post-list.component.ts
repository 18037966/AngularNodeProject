import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { PageEvent } from "@angular/material/paginator";
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
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizedOptions = [1, 2, 5, 10];
  postsService: PostsService;

  private postsSub: Subscription;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  ngOnInit(){
    this.isLoading = true;
    //getPosts doesnt return anything. We simply trigger http request
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    //this.posts = this.postsService.returnPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  }

  onChangedPage(pageData: PageEvent){
    //console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

   ngOnDestroy(){
     this.postsSub.unsubscribe();
   }
}
