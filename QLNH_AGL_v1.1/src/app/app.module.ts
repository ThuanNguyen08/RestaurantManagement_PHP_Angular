import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from './service/data.service';
import { GoimonComponent } from './components/goimon/goimon.component';
import { GiaodiengoimonComponent } from './components/giaodiengoimon/giaodiengoimon.component';
import { MenuComponent } from './components/menu/menu.component';
import { CategoryComponent } from './components/category/category.component';
import { RevenueComponent } from './components/revenue/revenue.component';
import { DsBanComponent } from './components/ds-ban/ds-ban.component';
import { QLTKComponent } from './components/qltk/qltk.component';
import { AccuserComponent } from './components/accuser/accuser.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    GoimonComponent,
    GiaodiengoimonComponent,
    MenuComponent,
    CategoryComponent,
    RevenueComponent,
    DsBanComponent,
    QLTKComponent,
    AccuserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(),
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
