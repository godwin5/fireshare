import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { NavController, IonInput } from "@ionic/angular";
import * as firebase from 'firebase';
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  @ViewChild('textarea') textarea: IonInput;
  postBtn: boolean = false;
  input: string = '';
  userid: string;
  name: string;
  bio: string;
  photo: string;
  url: string;
  commenting = false;
  hide = false;
  filterName = "filter";
  filterValue = 'none';
  width;
  height;
  type;
  constructor(
    public af: AngularFireAuth,
    public fs: AngularFirestore,
    public nav: NavController,
    public storage: AngularFireStorage,
  ) {

    this.userid = this.af.auth.currentUser.uid;
    //get image width and height from session storage and assign value to "type" variable based on width and height
    setTimeout(() => {
      this.url = sessionStorage.getItem('img');
      this.width = Number(sessionStorage.getItem('width'));
      this.height = Number(sessionStorage.getItem('height'));
      if (this.width == this.height) {
        this.type = 'equal'
      }
      else if (this.width > this.height) {
        if ((this.width - this.height) < 100) {
          this.type = 'equal'
        }
        else {
          this.type = "width"
        }

      }
      else {
        if ((this.height - this.width) < 100) {
          this.type = 'equal'
        }
        else {
          this.type = "height"
        }

      }

    }, 500);
    //Get User Data from Firestore
    this.fs.collection('users').doc(this.userid).snapshotChanges()
      .subscribe(val => {
        let data = val.payload.data();
        this.name = data['Name'];
        this.bio = data['Bio'];
        this.photo = data['Photo'];
      });

  }
  // check whether "Disable Commenting" checkbox is checked or not
  checkS() {
    if (this.commenting == false) {
      this.commenting = true
    }
    else {
      this.commenting = false
    }
  }


  // get filter name and value from html file
  filter(name, value, id) {
    //show checkmark on selected filter
    for (var i = 1; i <= 12; i++) {
      if (Number(id) == i) {

        document.getElementById(i.toString()).style.display = 'block';
      }
      else {

        document.getElementById(i.toString()).style.display = 'none';
      }
    }
    //set filter to preview image and set name & value of the filter to the variable

    //if filter is applied
    if (name != 'none') {
      document.getElementById('imgSrc').style.filter = name + '(' + value + ')';
      this.filterName = name;
      this.filterValue = value;
    }
    //if no filter is applied
    else {
      document.getElementById('imgSrc').style.filter = "none";
      this.filterValue = value;
      this.filterName = name;
    }
  }

  post() {
    //show preloader
    document.getElementById('postLoader').style.display = "block";
    //custom file for the file to be stored in firebase storage
    let fname = this.userid + Date.now().toString();
    //upload file
    this.storage.ref('photos/' + this.userid + '/' + fname).putString(this.url, 'data_url').then(() => {
      //get file url
      this.storage.ref('photos/' + this.userid + '/' + fname).getDownloadURL().subscribe(url => {
        //upload data to firestore
        this.fs.collection('photos').add({
          Name: this.af.auth.currentUser.displayName, //user name
          Img: url, //photo url
          Commenting: this.commenting, //whether commenting will be allowd or not(true or false)
          Photo: this.photo, //user profile photo url
          UID: this.userid, //user uid

          Timestamp: firebase.firestore.FieldValue.serverTimestamp(), //firestore serve timestamp
          Text: this.input.replace(/\n\r?/g, '<br />'), //replace linebreaks by "<br />" tag
          FilterName: this.filterName, //name of the image filter
          FilterValue: this.filterValue, //value of the image filter
          Type: this.type, //type of the image (1)width == height (2)width > height (3)  height >width
          Likes: [], //likes array
        }).then(() => {
          //if upload is ok,redirect to home page
          document.getElementById('postLoader').style.display = 'none';
          this.nav.navigateRoot('/home');
        }).catch(err => {
          //else show error
          document.getElementById('postLoader').style.display = 'none';
          console.log(err)
        })
      })
    }).catch(err => {
      //err mesage
      document.getElementById('postLoader').style.display = 'none';
      console.log(err);
    })

  }


  ngOnInit() {
  }

}
