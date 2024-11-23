import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { AccountDetail } from '../../models/AccountDetail';

@Component({
  selector: 'app-qltk',
  templateUrl: './qltk.component.html',
  styleUrls: ['./qltk.component.css']
})
export class QLTKComponent implements OnInit {
  accounts: AccountDetail[] = [];
  newAccount: AccountDetail = <AccountDetail>{};
  showModal: boolean = false;
  showAccountDetailsModal: boolean = false;
  showEditAccountModal: boolean = false;
  selectedAccount: AccountDetail | undefined;
  searchTerm: string = ''; 

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this.dataService.getAccountDetails().subscribe(res => {
      this.dataService.readAccountDetailsJson().subscribe((res: AccountDetail[]) => {
        this.accounts = res;
      });
    });
  }
  getAccountType(accountType: string): string {
    return accountType === '1' ? 'Nhân viên' : 'Quản lý';
  }
  getSex(sex: string): string {
    return sex === '1' ? 'Nam' : 'Nữ';
  }
  searchAccount(searchTerm: string): void {
    this.dataService.searchAccount(searchTerm).subscribe(res => {
        this.accounts = res.SearchResult; // Cập nhật danh sách tài khoản sau khi tìm kiếm
    });
}



  addAccount(): void {
    this.dataService.addAccountDetail(this.newAccount).subscribe(() => {
      this.getAccounts();
      this.showModal = false;
    });
  }

  deleteAccount(accountID: number): void {
    if (window.confirm("Bạn có chắc chắn muốn Xóa tài khoản này?")) {
      this.dataService.deleteAccountDetail(accountID).subscribe(() => {
        this.getAccounts();
      });
    }
  }

  viewDetails(account: AccountDetail): void {
    this.selectedAccount = account;
    this.showAccountDetailsModal = true;
  }

  editAccount(account: AccountDetail): void {
    this.selectedAccount = { ...account }; // Clone the selected account
    this.showEditAccountModal = true;
  }

  updateAccount(account: AccountDetail): void {
    this.dataService.updateAccountDetail(account).subscribe(() => {
      this.closeEditAccountModal();
      this.getAccounts();

    });
  }

  closeAccountDetailsModal(): void {
    this.showAccountDetailsModal = false;
    this.selectedAccount = undefined;
  }

  closeEditAccountModal(): void {
    this.showEditAccountModal = false;
    this.selectedAccount = undefined;
    location.reload();
  }


  
}
