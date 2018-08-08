import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { RegisterComponent } from "./register/register.component";
// import { MapsComponent } from './maps/maps.component';
import { AboutAuthorComponent } from "./about-author/about-author.component";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  //   {
  //   path: 'map/:id',
  //   component: MapsComponent
  // },
  {
    path: "author",
    component: AboutAuthorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
