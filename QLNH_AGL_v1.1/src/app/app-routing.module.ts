import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GoimonComponent } from './components/goimon/goimon.component';
import { GiaodiengoimonComponent } from './components/giaodiengoimon/giaodiengoimon.component';
import { MenuComponent } from './components/menu/menu.component';
import { CategoryComponent } from './components/category/category.component';
import { RevenueComponent } from './components/revenue/revenue.component';
import { DsBanComponent } from './components/ds-ban/ds-ban.component';
import { QLTKComponent } from './components/qltk/qltk.component';
import { AccuserComponent } from './components/accuser/accuser.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: "full" },
  { path: 'login', component: LoginComponent },
  { path:'home', component:HomeComponent},
  { path:'goimon', component:GoimonComponent},
  { path:'giaodiengoimon', component:GiaodiengoimonComponent},
  { path:'monan', component:MenuComponent},
  { path:'danhmuc', component:CategoryComponent},
  { path:'doanhthu', component:RevenueComponent},
  { path:'dsban', component:DsBanComponent },
  { path:'qltk', component:QLTKComponent },
  { path:'accuser', component:AccuserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
