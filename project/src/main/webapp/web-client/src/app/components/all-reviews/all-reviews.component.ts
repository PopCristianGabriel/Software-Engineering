import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PaperService} from '../../services/paper/paper.service';
import {Review} from '../../model/review';
import {Paper} from "../../model/paper";

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrls: ['./all-reviews.component.css']
})
export class AllReviewsComponent implements OnInit {
  papers: Paper[] = [];

  constructor(private paperService: PaperService) {
  }

  ngOnInit(): void {
    this.paperService.getPapersQualified().subscribe(result => this.papers = result);
  }

}
