import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { taikhoan } from '../models/taikhoan';
import { category } from '../models/category';
import { bill } from '../models/bill';
import { food } from '../models/food';
import { AccountDetail } from '../models/AccountDetail';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private API = "http://localhost/project/QLNH_AGL_v1.1/api.php";
  private API1 = "http://localhost/project/QLNH_AGL_v1.1/apithuan.php";
  private API2 = "http://localhost/project/QLNH_AGL_v1.1/apitu.php";
  private DATA_JSON = "http://localhost:3000";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) { }
  //kiểm tra tài khoản
  checkAccount(taikhoan: taikhoan): Observable<any> {
    const Username = taikhoan.Username;
    const Password = taikhoan.Password;
    const url = `${this.API}?action=checkAccount&Username=${Username}&Password=${Password}`;
    return this.http.get<any>(url);
  }

  //đọc file json 
  readAccountJson(taikhoan: taikhoan): Observable<any> {
    const url = `${this.DATA_JSON}/taikhoan`;
    return this.http.get<any>(url);
  }

  //TRANGCHU
  //lấy toàn bộ danh sách hóa đơn
  getTbBillHistory(): Observable<any> {
    const url = `${this.API}?action=home`;
    console.log(url)
    return this.http.get<any>(url);
  }

  //Doanh thu ngày
  readDataJsonForHome(): Observable<any> {
    const url = `${this.DATA_JSON}/home`;
    return this.http.get<any>(url);
  }

  //GOIMON
  //lấy toàn bộ bàn
  getTbDsTable(): Observable<any> {
    const url = `${this.API}?action=getTable`;
    return this.http.get<any>(url);
  }

  readTbDsTableJson() {
    const url = `${this.DATA_JSON}/ListTable`;
    return this.http.get<any>(url);
  }

  getTbDmFood(TableName: any): Observable<any> {
    const tablename = TableName;
    const url = `${this.API}?action=getDmFood&TableName=${tablename}`;
    return this.http.get<any>(url);
  }

  readTbDmFoodJson(): Observable<any> {
    const url = `${this.DATA_JSON}/ListCategory`;
    return this.http.get<any>(url);
  }

  getTbFood(DMFood: category): Observable<any> {
    const DMFoodID = DMFood.DMFoodID;
    const url = `${this.API}?action=getFood&DMFoodID=${DMFoodID}`;
    return this.http.get<any>(url);
  }

  readTbFoodJson(): Observable<any> {
    const url = `${this.DATA_JSON}/ListFood`;
    return this.http.get<any>(url);
  }

  addBill(FoodID: any, TableName: any, CustomerName: any, SDT: any, UserInfoName: any): Observable<any> {
    const foodid = FoodID;
    const tablename = TableName;
    const BillDate = new Date();
    const customername = CustomerName;
    const sdt = SDT;
    const userinfoname = UserInfoName;

    // Lấy ngày, tháng, năm từ đối tượng Date
    const day = BillDate.getDate().toString().padStart(2, '0'); // Ngày
    const month = (BillDate.getMonth() + 1).toString().padStart(2, '0'); // Tháng (lưu ý +1 vì tháng bắt đầu từ 0)
    const year = BillDate.getFullYear(); // Năm

    // Chuỗi có định dạng yyyy/mm/dd
    const formattedDate = `${year}-${month}-${day}`;

    const url = `${this.API}?action=addBill&FoodID=${foodid}&TableName=${tablename}&BillDate=${formattedDate}&SDT=${sdt}&UserInfoName=${userinfoname}&CustomerName=${customername}`;
    return this.http.get<any>(url);
  }

  plushBill(item: bill): Observable<any> {
    const foodName = item.FoodName;
    const tablename = item.TableName;
    const customername = item.CustomerName;
    const sdt = item.SDT;
    const url = `${this.API}?action=plushQuantityItem&FoodName=${foodName}&TableName=${tablename}&CustomerName=${customername}&SDT=${sdt}`;
    return this.http.get<any>(url);
  }

  minusBill(item: bill): Observable<any> {
    const foodName = item.FoodName;
    const tablename = item.TableName;
    const customername = item.CustomerName;
    const sdt = item.SDT;
    const url = `${this.API}?action=minusQuantityItem&FoodName=${foodName}&TableName=${tablename}&CustomerName=${customername}&SDT=${sdt}`;
    return this.http.get<any>(url);
  }

  getBillCurrentOfTable(TableName: any): Observable<any> {
    const tablename = TableName;
    const url = `${this.API}?action=getDatalBillCurrent&TableName=${tablename}`;
    return this.http.get<any>(url);
  }

  readBillCurrentOfTable(): Observable<any> {
    const url = `${this.DATA_JSON}/BillCurrentOfTable`;
    return this.http.get<any>(url);
  }

  saveBillToSQL(TableName: any): Observable<any> {
    const tablename = TableName;
    const url = `${this.API}?action=saveBillToSQL&TableName=${tablename}`;
    return this.http.get<any>(url);
  }

  //thuan
  getFood(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.API1}?action=getFoods&page=${page}&limit=${limit}`, this.httpOptions);
  }


  deleteFood(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API1}?action=deleteFood&id=${id}`);
  }

  editFood(food: food): Observable<any> {
    return this.http.put(`${this.API1}?action=editFood&id=${food.FoodID}`, food, this.httpOptions);
  }

  saveFoodsToJSON(foods: food[]): Observable<any> {
    return this.http.post<any>(`${this.API1}?action=saveFoodsToJSON`, foods, this.httpOptions);
  }

  addFood(newFood: food): Observable<any> {
    return this.http.post<any>(`${this.API1}?action=addFood`, newFood, this.httpOptions);
  }

  // Lấy danh sách danh mục món ăn
  getDMFoods(): Observable<any> {
    return this.http.get(`${this.API1}?action=getDMFoods`);
  }

  getFoodsByCategory(categoryId: number): Observable<food[]> {
    return this.http.get<food[]>(`${this.API1}?action=getFoodsByCategory&categoryId=${categoryId}`, this.httpOptions);
  }

  // Thêm danh mục món ăn mới
  addDMFood(dmFood: any): Observable<any> {
    return this.http.post(`${this.API1}?action=addDMFood`, dmFood, this.httpOptions);
  }

  // Sửa danh mục món ăn
  editDMFood(dmFood: any): Observable<any> {
    const id = dmFood.DMFoodID;
    return this.http.put(`${this.API1}?action=editDMFood&id=${id}`, dmFood, this.httpOptions);
  }

  // Xóa danh mục món ăn
  deleteDMFood(id: number): Observable<any> {
    return this.http.delete(`${this.API1}?action=deleteDMFood&id=${id}`);
  }

  getRevenues(params: any): Observable<any> {
    const url = `${this.API1}?action=getRevenues&${new URLSearchParams(params).toString()}`;
    return this.http.get<any>(url);
  }

  deleteRevenue(id: number): Observable<any> {
    const url = `${this.API1}?action=deleteRevenue&id=${id}`;
    return this.http.delete<any>(url);
  }

  //tu
  //Thêm bàn mới
  addTable(TableName: string, Status: string): Observable<any> {
    const params = new HttpParams()
      .set('action', 'addTable')
      .set('TableName', TableName)
      .set('Status', Status);

    return this.http.get<any>(this.API2, { params });
  }

  updateTable(TableID: number, TableName: string, Status: string): Observable<any> {
    const params = new HttpParams()
      .set('action', 'updateTable')
      .set('TableID', TableID.toString())
      .set('TableName', TableName)
      .set('Status', Status);

    return this.http.get<any>(this.API2, { params });
  }


  deleteTable(TableID: number): Observable<any> {
    const url = `${this.API2}?action=deleteTable&TableID=${TableID}`;
    return this.http.delete<any>(url);
  }
  getAccountDetailslogin(Username: string): Observable<AccountDetail> {
    const url = `${this.API2}?action=getAccountDetails&Username=${Username}`;
    return this.http.get<AccountDetail>(url);
  }
  // Phương thức lấy danh sách tài khoản từ PHP API
  getAccountDetails(): Observable<AccountDetail[]> {
    const url = `${this.API2}?action=getAccountList`;
    return this.http.get<AccountDetail[]>(url);
  }

  searchAccount(searchTerm: string): Observable<any> {
    const url = `${this.API2}?action=searchAccount&searchTerm=${searchTerm}`;
    return this.http.get<any>(url);
  }

  // Phương thức đọc danh sách tài khoản từ file JSON
  readAccountDetailsJson(): Observable<AccountDetail[]> {
    const url = `${this.DATA_JSON}/ListAccount`;
    return this.http.get<AccountDetail[]>(url);
  }

  // Phương thức thêm tài khoản mới
  addAccountDetail(account: AccountDetail): Observable<any> {
    const url = `${this.API2}?action=addAccount`;
    console.log(url);
    return this.http.post<any>(url, account, this.httpOptions);
  }

  // Phương thức xóa tài khoản
  deleteAccountDetail(accountID: number): Observable<any> {
    const url = `${this.API2}?action=deleteAccount&AccountID=${accountID}`;
    return this.http.delete<any>(url, this.httpOptions);
  }

  updateAccountDetail(account: AccountDetail): Observable<any> {
    const url = `${this.API2}?action=updateAccount`;
    return this.http.put<any>(url, account, this.httpOptions);
  }

}
