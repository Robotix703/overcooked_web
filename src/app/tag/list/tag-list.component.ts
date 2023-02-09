import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tag } from '../tag.model';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  isLoading: boolean = false;
  tags: Tag[] = [];

  constructor(private tagService: TagService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getTags();
  }

  getTags(){
    this.isLoading = true;
    this.tagService.getTags().subscribe(data => {
      this.isLoading = false;
      this.tags = data;
    });
  }

  deleteTag(tagId: string){
    this.tagService.deleteTag(tagId).subscribe(result => {
      this.getTags();
    });
  }
}
