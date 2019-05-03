import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


//Firebase Configuration
var config = {
    apiKey: "Your api key",
    authDomain: "your domain url",
    databaseURL: "your db url",
    projectId: "your project id",
    storageBucket: "your storage bucket",
    messagingSenderId: "messaging sender id"
  };

  import { AngularFireModule } from "@angular/fire";
  import { AngularFireAuthModule } from "@angular/fire/auth";
  import { AngularFirestoreModule } from "@angular/fire/firestore";
  import { AngularFireStorageModule } from "@angular/fire/storage";
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(config),
  AngularFireAuthModule,AngularFirestoreModule.enablePersistence(),AngularFireStorageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
