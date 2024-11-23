import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { table } from '../../models/table';
import { ActivatedRoute, Router } from '@angular/router';
import { taikhoan } from '../../models/taikhoan';

@Component({
  selector: 'app-goimon',
  templateUrl: './goimon.component.html',
  styleUrl: './goimon.component.css'
})
export class GoimonComponent implements OnInit{

  tables: any[] = [];
  nameUser: string = "";
  accType: string = "";

  constructor(private service: DataService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      this.nameUser = params['Username'];
      this.accType = params['AccountType'];
    })

    this.getTable();
    
  }

  getTable(){
    this.service.getTbDsTable().subscribe(res=>{
      this.service.readTbDsTableJson().subscribe((res:any[])=>{
        this.tables = res;
        res.forEach((element:any)=>{
          if(element.Status == "Có người"){
            element.isSelected = true;
          }
        })
      })
    })
  }

  datmon(table: any){
    this.router.navigate(['/giaodiengoimon'], { queryParams: { Username: this.nameUser, AccountType: this.accType, TableName: table.TableID } });
  }

}
