import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'dummy', loadChildren: './dummy/dummy.module#DummyPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'create', loadChildren: './create/create.module#CreatePageModule' },
  { path: 'edit', loadChildren: './edit/edit.module#EditPageModule' },
  { path: 'comments', loadChildren: './comments/comments.module#CommentsPageModule' },
  { path: 'likes', loadChildren: './likes/likes.module#LikesPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
