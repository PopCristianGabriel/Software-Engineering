import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Paper} from '../../model/paper';
import {Review} from '../../model/review';
import {Reviewer} from '../../model/Reviewer';
import {PaperReviewerPair} from '../../model/PaperReviewerPair';

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  httpFileOptions = {headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})};
  private url = 'http://localhost:8080/api/paper';

  constructor(
    private http: HttpClient) {
  }

  uploadAbstractMetadata(authorId: number, paperName: string,
                         keywords: string, filename: string): Observable<boolean> {
    return this.http.post<boolean>(this.url + '/upload-abstract/meta', {
      authorId, paperName, keywords, filename
    }, this.httpOptions)
      .pipe(
        map(result => Boolean(result['message'])),
        catchError(this.handleError<boolean>('uploadAbstractMetadata'))
      );
  }

  uploadAbstract(authorId: number, paperName: string,
                 paperKeywords: string, abstract: File): Observable<boolean> {
    console.log(authorId, paperName, paperKeywords, abstract);
    var success = true;
    this.uploadAbstractMetadata(authorId, paperName, paperKeywords, abstract.name)
      .subscribe(metaResult => {
        console.log(metaResult);
        if (metaResult === true) {
          this.uploadAbstractProper(abstract)
            .subscribe(abstractResult => {
              console.log(abstractResult);
              success = abstractResult;
            });
        } else {
          success = false;
        }
      });
    return of(success);
  }

  getPapersForAuthor(authorId: number): Observable<Paper[]> {
    return this.http.get<Paper[]>(this.url + '/getPapersForAuthor/' + authorId, this.httpOptions)
      .pipe(
        map(result => result['papers']),
        tap(result => console.log(result)),
        catchError(this.handleError<Paper[]>('getPapersForAuthor', []))
      );
  }

  updatePaperMetadata(paperId: number, authorId: number, paperName: string,
                      paperKeywords: string, fileName: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/update/meta', {
      paperId, authorId, paperName, 'keywords': paperKeywords, 'fileName': fileName
    }, this.httpOptions)
      .pipe(
        map(result => Boolean(result['message'])),
        catchError(this.handleError<boolean>('updatePaperMetadata'))
      );
  }

  // todo test me potentially dangerous
  updatePaper(paperId: number, authorId: number, paperName: string,
              paperKeywords: string, abstract: File, paper: File, contentUrl: string): Observable<boolean> {
    var success = true;
    this.updatePaperMetadata(paperId, authorId, paperName, paperKeywords, contentUrl)
      .subscribe(metaResult => {
        if (metaResult === true) {
          if (abstract !== null) {
            this.uploadAbstractProper(abstract)
              .subscribe(result => success = success && result);
          }
          if (paper !== null) {
            this.updatePaperContent(paper)
              .subscribe(result => success = success && result);
          }
          success = true;
        } else {
          success = false;
        }

      });
    return of(success);
  }

  getPaperById(id: number): Observable<Paper> {
    return this.http.get<Paper>(this.url + '/getPaper/' + id, this.httpOptions)
      .pipe(
        tap(result => console.log(result)),
        catchError(this.handleError<Paper>('getPapersForAuthor'))
      );
  }

  getAbstract(paperId: number): Observable<any> {
    return this.http.get<any>(this.url + '/abstract/' + paperId, this.httpOptions)
      .pipe(
        catchError(this.handleError<File>('getPapersForAuthor'))
      );
  }

  getPaperContent(paperId: number): Observable<any> {
    return this.http.get<any>(this.url + '/content/' + paperId, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('getPaperContent '))
      );
  }

  getAllPapers(): Observable<Paper[]> {
    const url = this.url + '/getAllPapers';
    return this.http.get<Paper[]>(url, this.httpOptions).pipe(
      map(result => result['papers']),
      catchError(this.handleError<Paper[]>('getAllPapers', []))
    );

  }

  getAllReviewersForPaper(paperId: number): Observable<Reviewer[]> {
    const url = this.url + '/reviewersForPaper/' + paperId;
    return this.http.get<Reviewer[]>(url, this.httpOptions).pipe(
      map(result => result['reviewers']),
      catchError(this.handleError<Reviewer[]>('getAllReviewersForPaper', []))
    );

  }

  assignReviewersToPaper(paperReviewerPair: PaperReviewerPair): Observable<boolean> {
    return this.http.post(this.url + '/assignToReview', paperReviewerPair, this.httpOptions).pipe(
      map(result => result['success']),
      catchError(this.handleError<boolean>('assignReviewersToPaper'))
    );
  }

  getAllPapersForReviewer(pcId: number): Observable<Paper[]> {
    const url = this.url + '/papersForReviewer/' + pcId;
    return this.http.get<Paper[]>(url, this.httpOptions)
      .pipe(
        map(result => {
          let papers: Paper[] = result['papers'];
          return papers;
        }),
        catchError(this.handleError<Paper[]>('getAllPapersForReviewer', []))
      );
  }

  submitReview(pcId: number, review: Review): Observable<boolean> {
    const url = this.url + '/review/submit/' + pcId + '/' + review.paperId + '/' + review.qualifier + '/' + review.review.name;
    const formData = new FormData();
    formData.append('file', review.review);
    return this.http.post<boolean>(url, formData)
      .pipe(
        map(response => Boolean(response['message'])),
        catchError(this.handleError<boolean>('submitReview'))
      );
  }

  updatePaperContent(content: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('file', content);
    return this.http.put<boolean>(this.url + '/upload-content/content',
      formData
    )
      .pipe(
        map(result => Boolean(result['message'])),
        catchError(this.handleError<boolean>('updatePaperContent'))
      );
  }

  uploadAbstractProper(abstract: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('file', abstract);
    return this.http.put<boolean>(this.url + '/upload-abstract/abstract', formData)
      .pipe(
        map(result => Boolean(result['message'])),
        catchError(this.handleError<boolean>('uploadAbstractProper'))
      );
  }

  acceptPaper(id: number) {
    const url = `${this.url}/accept/${id}`;
    console.log(id);
    this.http.put<boolean>(url, this.httpOptions);
  }

  rejectPaper(id: number) {
    const url = `${this.url}/reject/${id}`;
    console.log(id);
    this.http.put<boolean>(url, this.httpOptions);
  }

  reassignPaper(id: number, reviewers: number[]) {
    const url = `${this.url}/reassign/paper=${id}`;
    this.http.put<boolean>(url, {reviewers}, this.httpOptions);
  }

  paperHasContentUploaded(id: number): Observable<boolean> {
    return this.http.get(this.url + '/has-content/' + id, this.httpOptions)
      .pipe(
        tap(result => console.log(result)),
        map(result => {
          if (result['message'] === 'true') {
            return true;
          }
          return false;
        })
      );
  }

  private getAllReviews(): Observable<Review[]> {
    const url = this.url + '/all-reviews';
    return this.http.get<Review[]>(url, this.httpOptions)
      .pipe(
        map(result => result['reviews']),
        catchError(this.handleError<Review[]>('getAllReviews', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
