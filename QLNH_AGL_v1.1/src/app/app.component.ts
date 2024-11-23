import { Component, OnInit } from '@angular/core';
import { DataService } from './service/data.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'QLNH_AGL';

  isVisible : boolean = false; //biến để ẩn hiện giao diện
  hiddenbtn: boolean = false; //biến để hiện nếu là admin và ngược lại là nhân viên

  nameUser: string = "";
  accType: string = "";
  constructor(private server : DataService,private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.displayUIMain();
  }
  
  logout() {
    $('#logoutModal').modal('hide');
    this.router.navigate(['/login']);
  }

  displayUIMain(){
    this.route.queryParams.subscribe(params =>{
      this.nameUser = params['Username'];
      this.accType = params['AccountType'];
      if(this.nameUser == null){
        this.isVisible = false;
      }else if(this.nameUser != null){
        this.isVisible = true;
        
        //check điều kiện thỏa để hiện btn của admin
        if(this.accType == "0"){ //0 là admin => hiện các btn
          this.hiddenbtn = false;
        }else if(this.accType == "1"){ //1 là nhân viên => ẩn các btn
          this.hiddenbtn = true;
        }
      }
    })
  }

  trangchu() {
    this.router.navigate(['/home'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
  }
  goimon() {
    this.router.navigate(['/goimon'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
  }
  danhsachban() {
    this.router.navigate(['/dsban'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
  }
  danhmuc() {
    this.router.navigate(['/danhmuc'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
  }
  monan() {
    this.router.navigate(['/monan'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
  }
  doanhthu() {
    this.router.navigate(['/doanhthu'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
  }
  qltk() {
    this.router.navigate(['/qltk'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
  }
  accuser(){
    this.router.navigate(['/accuser'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
  }
}
