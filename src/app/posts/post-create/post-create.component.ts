import { Component, OnInit } from '@angular/core';
//import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from './mime-type.validator';

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
  form: FormGroup;
  imagePreview: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit(){
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath};
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath
            });
          });
      }else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(file);
    console.log(this.form);
  }

  onAddPost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;

    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
    }
    this.form.reset();
  }
}

//ngModel is a directive that listens to user input and emit that data to us and also store new data in that text area or output it there.
//bind it to a property
