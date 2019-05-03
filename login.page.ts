import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  pwd: string;
  errMsg: string;
  constructor(
    public af: AngularFireAuth,
    public fs: AngularFirestore,
    public nav: NavController,
    public alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }
//Alert Box for showing errors
  async presentAlert() {
    const errorAlert = await this.alertCtrl.create({
      header: 'Oops',
      message: this.errMsg,
      buttons: [
        { text: 'ok' }
      ]
    })
    await errorAlert.present();
  }
  login() {
    //When login btn is clicked,show preloader...
    document.getElementById('loginLoader').style.display = 'block';
    this.af.auth.signInWithEmailAndPassword(this.email, this.pwd).then(() => {
      //if login sucessful,hide preloader and redirect to home page
      document.getElementById('loginLoader').style.display = 'none';
      this.nav.navigateRoot('/home');
    }).catch(err => {
      //if not,hide preloader and show err message with alert box
      document.getElementById('loginLoader').style.display = 'none';
      this.errMsg = err.message;
      this.presentAlert();
    })
  }
  goto_signup() {
    //redirect to signup page
    this.nav.navigateForward('/signup');
  }
}
