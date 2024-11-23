import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { AccountDetail } from '../../models/AccountDetail';


@Component({
  selector: 'app-accuser',
  templateUrl: './accuser.component.html',
  styleUrls: ['./accuser.component.css']
})
export class AccuserComponent implements OnInit {
  accountDetail: AccountDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const Username = params['Username'];
      if (Username) {
        this.getAccountDetails(Username);
      } else {
        this.errorMessage = 'No username provided';
      }
    });
  }

  getAccountDetails(Username: string): void {
    this.dataService.getAccountDetailslogin(Username).subscribe(
      (data: AccountDetail) => {
        this.accountDetail = data;
      },
      (error) => {
        this.errorMessage = 'Error fetching account details';
      }
    );
  }
  getAccountType(accountType: string): string {
    return accountType === '1' ? 'Nhân viên' : 'Quản lý';
  }
  getSex(sex: string): string {
    return sex === '1' ? 'Nam' : 'Nữ';
  }
  goBack(): void {
    this.router.navigate(['/home'], {
      queryParams: {
        Username: this.accountDetail?.Username,
        AccountType: this.accountDetail?.AccountType
      }
    });
  }

}
