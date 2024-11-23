import { Component } from '@angular/core';
import { taikhoan } from '../../models/taikhoan';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  taikhoan: taikhoan = <taikhoan>{};
  thongbao : string = "";
  accType: string = "";

  constructor(private service: DataService, private router: Router) { 
    this.taikhoan = new taikhoan(0,'admin','1')
  }

  login(taikhoan: taikhoan) {
    var dem = 0;
    if(taikhoan.Username == "" || taikhoan.Password == ""){
      this.thongbao = "Tài khoản hoặc mật khẩu trống";
    }else if(taikhoan.Username != null && taikhoan.Password != null){
      this.service.checkAccount(taikhoan).subscribe(res =>{
        this.service.readAccountJson(taikhoan).subscribe(res=>{
          if(res && res.length >= 1){
            res.forEach((element: any) => {
              if(taikhoan.Username == element.Username && taikhoan.Password == element.Password){
                if(element.AccountType == "0"){
                  dem = 0;
                }else if(element.AccountType == "1"){
                  dem = 0;
                }
                this.accType = element.AccountType;
              }
            });
          }else if(res.length == 0){
            dem++;
          }  

          if(dem == 0){
            this.router.navigate(['/home'], { queryParams: { Username: taikhoan.Username, AccountType: this.accType } });
          }else if(dem != 0){
            this.thongbao = "Tài khoản hoặc mật khẩu không đúng";
          }
        })
        
      });
    }
  }
}
