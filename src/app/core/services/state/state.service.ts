import { Injectable } from '@angular/core';
import { Article } from './../../interfaces/article';
import { Subject } from 'rxjs';
import { State } from './../../interfaces/state' 

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() {  
  } 

  state: State = {name: "neutral"}; 
  model: Subject<any> = new Subject();

  searchArticle() {
    this.state.name = 'search'
    this.state.data = {}
    this.stateBroadcast()
  }

  openArticleDetails(article: Article) {
    this.state.name = 'articleDetails'
    this.state.data = article
    this.stateBroadcast()
  }

  selectArticle(article: Article) {
    this.state.name = 'selectedArticle'
    this.state.data = article
    this.stateBroadcast()
  }

  selectArticleLocation() {
    this.state.name = 'addArticleLocation' 
    this.stateBroadcast()
  }

  addArticle() {
    console.log('addart state called')
    this.state.data = {}
    this.state.name = 'addArticle'
    this.stateBroadcast()
  }

  submittingArticle() {
    this.state.name = 'submittingArticle'
    this.state.data = {}
    this.stateBroadcast()
  }

  submitAttempted(success: boolean) {
    this.state.name = "submitAttempted"
    this.state.data = {
      success: success
    }
    this.stateBroadcast()
  }

  private stateBroadcast() {
    this.model.next(this.state)
  }

  resetState() {
    console.log('reset state called')
    this.state = {name: "neutral"}
    this.stateBroadcast()
  }
}
