import { Component } from '@angular/core';
//import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-create', //allows us to which that component
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent {
  enteredContent = "";
  enteredTitle = "";
//  @Output() postCreated = new EventEmitter<Post>();//postCreated is an event to which we can listen from the outside so to do this add a decorater call Output

  constructor(public postsService: PostsService){}

  onAddPost(form: NgForm){
    if(form.invalid){
      return;
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}

//ngModel is a directive that listens to user input and emit that data to us and also store new data in that text area or output it there.
//bind it to a property
