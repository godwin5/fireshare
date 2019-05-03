import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'timeago.js';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  postRef: Observable<any>;
  photoRef: Observable<any>;
  userid: string;
  constructor(
    public af: AngularFireAuth,
    public fs: AngularFirestore,
    public nav: NavController,
    public action: ActionSheetController,
    public alertCtrl: AlertController,
  ) {
    // get user uid from local storage
    this.userid = localStorage.getItem('userid');

    // get photos collection from firestore
    this.photoRef = this.fs.collection('photos', ref => ref.orderBy('Timestamp', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    //check if user already like a post or not and get likes  of each photo
    firebase.firestore().collection('photos').onSnapshot(function (snap) {
      snap.forEach(c => {
        let likes: Array<any> = c.data()['Likes'];
        setTimeout(() => {
          //display like count
          if (likes.length == 0) {
            document.querySelector('.likesCount' + c.id).innerHTML = '';
          }
          else if (likes.length == 1) {
            document.querySelector('.likesCount' + c.id).innerHTML = likes.length + ' Like';
          }
          else {
            document.querySelector('.likesCount' + c.id).innerHTML = likes.length + ' Likes';
          }
        }, 100);

        //if user liked a post then replace "empty heart icon" with "heart icon"
        if (likes.indexOf(firebase.auth().currentUser.uid) > -1) {

          setTimeout(() => {

            document.getElementById(c.id + 'like').setAttribute('name', 'heart');
          }, 100);

        }

      })
    })

  }

  // click to trigger input file 
  selectPhoto() {
    document.getElementById('photo').click();
  }
//get file 
  selectFile() {
    let file = (<HTMLInputElement>document.getElementById('photo')).files[0];
    
    var reader = new FileReader();
    reader.onload = function () {
      var dataURL = reader.result;
    //get width and height of the file and set it to session storage
    //this is because, we want to categorize the photo while displaying  
      var image = new Image();

      image.src = reader.result as string;

      image.onload = function () {
        sessionStorage.setItem('width', image.width.toString());
        sessionStorage.setItem('height', image.height.toString())
      };
      //get base64 url of the file and set it to session storage then navigate to create page
      sessionStorage.setItem('img', dataURL.toString())
    };
    reader.readAsDataURL(file);
    this.nav.navigateForward('/create')


  }
  //npm install timeago.js
  //return time in "1 sec ago or 1 day ago format"
  timesAgo(t) {
    return format(t.toMillis());
  }
  
//function for like a post
  heart(id) {
    this.fs.collection('photos').doc(id).update({
      Likes: firebase.firestore.FieldValue.arrayUnion(this.userid)
    }).then(() => {
      document.getElementById(id + 'like').setAttribute('name', 'heart');
    })
  }

  //function for delete a post (post of the current user can only be deleted)
  delete(id) {
    this.fs.collection('photos').doc(id).delete();
  }

  //store post id in session storage and navigate to comment page
  comment(id) {
    sessionStorage.setItem('PostId', id);
    this.nav.navigateForward('/comments');
  }

  //redirect to profile page
  gotoProfile() {
    this.nav.navigateForward('/profile');
  }
}