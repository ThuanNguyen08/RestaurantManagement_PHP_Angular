import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { food } from '../../models/food';
import { category } from '../../models/category';
import { bill } from '../../models/bill';

@Component({
  selector: 'app-giaodiengoimon',
  templateUrl: './giaodiengoimon.component.html',
  styleUrl: './giaodiengoimon.component.css'
})
export class GiaodiengoimonComponent implements OnInit {
  TableName: any;
  nameUser: string = "";
  accType: string = "";
  listDmFood: any;
  listFood: any;
  listItemBill: any;
  bill: bill = <bill>{};
  thongbao: string = "";
  totalAmount: number = 0;
  show: boolean = false;
  timeBill: Date = new Date();
  money: any = "";
  pay: number = 0;

  constructor(private server: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.nameUser = params['Username'];
      this.accType = params['AccountType'];
      this.TableName = params['TableName'];
    });
    this.getTbDmFood();
  }

  getTbDmFood() {
    this.server.getTbDmFood(this.TableName).subscribe(res => {
      this.server.readTbDmFoodJson().subscribe((res) => {
        this.listDmFood = [];
        this.listDmFood = res;
        this.getListFood();
        this.readCurrentBill();
      })
    });
  }

  getListFood() {
    this.server.readTbFoodJson().subscribe(res => {
      this.listFood = [];
      this.listFood = res;
      this.listFood.forEach((element: any) => {
        if (element.FoodName.length >= 10) {
          element.FoodName = element.FoodName.substring(0, 10) + "...";
          this.listFood = res;
        } else if (element.FoodName.length < 10) {
          this.listFood = res;
        }
      });
    })
  }

  getFood(DMFoodID: any) {
    this.server.getTbFood(DMFoodID).subscribe(res => {
      this.getListFood();
    });
    // Đặt isSelected = false cho tất cả các mục
    this.listDmFood.forEach((element: any) => {
      element.isSelected = false;
    });

    // Đặt isSelected = true cho mục được chọn
    DMFoodID.isSelected = true;
  }


  addBill(itemFood: any) {
    if (this.bill.CustomerName == null || this.bill.SDT == null) {
      this.thongbao = "Hãy nhập đầy đủ thông tin khách hàng!!!";
      return;
    }

    this.thongbao = "";
    this.server.addBill(itemFood.FoodID, this.TableName, this.bill.CustomerName, this.bill.SDT, this.nameUser).subscribe(() => {
      //lấy dữ liệu
      this.getCurrentBill();
    });
  }

  getCurrentBill() {
    this.server.getBillCurrentOfTable(this.TableName).subscribe(() => {
      this.readCurrentBill();
    });
  }

  // Hiển thị dữ liệu hóa đơn hiện tại
  readCurrentBill() {
    this.totalAmount = 0;
    this.server.readBillCurrentOfTable().subscribe((res: any[]) => {
      if (res.length > 0) {
        const firstBill = res[0]; // Lấy thông tin hóa đơn đầu tiên từ kết quả

        this.bill.CustomerName = firstBill.CustomerName;
        this.bill.SDT = firstBill.SDT;
        this.listItemBill = res;
      } else {
        this.listItemBill = [];
      }

      res.forEach((element: any) => {
        let TotalAmount: number = Number(element.TotalAmount);
        this.totalAmount += TotalAmount;
      })
    });
  }

  plushItem(item: any) {
    this.server.plushBill(item).subscribe(() => {
      //lấy dữ liệu
      this.getCurrentBill();
    });
  }

  minusItem(item: any) {
    // let confirmDelete = false;

    // if (item.Quantity - 1 == 0) {
    //   confirmDelete = confirm("Bạn chắc chắn muốn xóa?");
    // } else {
    //   confirmDelete = true;
    // }

    // if (confirmDelete) {
    //   this.server.minusBill(item).subscribe(() => {
    //     this.getCurrentBill();
    //   });
    // }

    this.server.minusBill(item).subscribe(() => {
      this.getCurrentBill();
    });
  }

  showDialog() {
    this.show = !this.show;
  }

  formatTime() {
    // Lấy ngày, tháng, năm từ đối tượng Date
    const day = this.timeBill.getDate().toString().padStart(2, '0'); // Ngày
    const month = (this.timeBill.getMonth() + 1).toString().padStart(2, '0'); // Tháng (lưu ý +1 vì tháng bắt đầu từ 0)
    const year = this.timeBill.getFullYear(); // Năm

    // Lấy giờ và phút
    const hours = this.timeBill.getHours().toString().padStart(2, '0');
    const minutes = this.timeBill.getMinutes().toString().padStart(2, '0');
    const seconds = this.timeBill.getSeconds().toString().padStart(2, '0');

    // Chuỗi có định dạng yyyy/mm/dd hh:mm
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }

  payMoney(event: any) {
    let value = event.target.value;
    this.money = this.formatCurrency(value);
    this.pay = parseFloat(this.money.replace(/,/g, '')) - this.totalAmount;
  }

  //định dạng số nn,nnn
  formatCurrency(value: string): string {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  }


  saveBillToSQL() {
    if (this.bill.CustomerName == undefined || this.bill.SDT == undefined || this.listItemBill.length == 0) {
      alert("Thanh toán thất bại");
      this.show = !this.show;
    } else if (this.bill.CustomerName != undefined && this.bill.SDT != undefined && this.listItemBill.length > 0) {
      if (confirm("Bạn muốn xác nhận thanh toán?")) {
        this.server.saveBillToSQL(this.TableName).subscribe(() => {
          this.router.navigate(['/goimon'], { queryParams: { Username: this.nameUser, AccountType: this.accType } });
          alert("Thanh toán thành công");
        });
      } else {
        this.show = !this.show;
      }
    }

  }
}
