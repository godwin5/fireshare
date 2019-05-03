import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase';
import { format } from 'timeago.js';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  input: string = '';
  userid: string;
  name: string;
  bio: string;
  photo: string;
  commentsRef;
  constructor(
    public fs: AngularFirestore,
  ) {
    this.userid = localStorage.getItem('userid');
    //get user data from firestore
    this.fs.collection('users').doc(this.userid).snapshotChanges()
      .subscribe(val => {
        let data = val.payload.data();
        this.name = data['Name'];
        this.bio = data['Bio'];
        this.photo = data['Photo'];
      });
//get comments from comments collectin off post id
    this.commentsRef = this.fs.collection('comments').doc(sessionStorage.getItem('PostId'))
      .collection('comments', ref => ref.orderBy('Timestamp', 'desc')).valueChanges();
  }
//store comments in comments collectin under post id
  comment() {
    let postid = sessionStorage.getItem('PostId');
    this.fs.collection('comments').doc(postid).collection('comments').add({
      Comment: this.input,
      Name: this.name,
      Photo: this.photo,
      Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    this.input='';
  }
  timesAgo(t){
    return format(t.toMillis());
  }
  ngOnInit() {
  }

}
