import { Component, OnInit } from '@angular/core';
//import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PostsService } from "../posts.service";
import { Post } from "../post.model";

@Component({
  selector: 'app-post-create', //allows us to which that component
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit{
  enteredContent = "";
  enteredTitle = "";
//  @Output() postCreated = new EventEmitter<Post>();//postCreated is an event to which we can listen from the outside so to do this add a decorater call Output
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;

  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = {id: postData._id, title: postData.title, content: postData.content};
          });
      }else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }


  onAddPost(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    
    if(this.mode === 'create'){
      this.postsService.addPost(form.value.title, form.value.content);
    }else {
      this.postsService.updatePost(this.postId,form.value.title, form.value.content )
    }
    form.resetForm();
  }
}

//ngModel is a directive that listens to user input and emit that data to us and also store new data in that text area or output it there.
//bind it to a property
