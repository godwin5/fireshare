import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

import { ActionSheetController, AlertController, NavController } from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userid: string;
  name: string;
  bio: string;
  photo: string;
  constructor(
    public af: AngularFireAuth,
    public fs: AngularFirestore,
    public action: ActionSheetController,
    public alertCtrl:AlertController,
    public nav:NavController,
  ) {
    this.userid = this.af.auth.currentUser.uid;
    this.fs.collection('users').doc(this.userid).snapshotChanges()
      .subscribe(val => {
        let data = val.payload.data();
        this.name = data['Name'];
        
        this.photo = data['Photo'];
      });
  }
  ngOnInit() {
  }

}
