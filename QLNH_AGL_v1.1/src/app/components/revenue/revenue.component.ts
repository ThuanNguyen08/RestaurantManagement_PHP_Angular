import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';

declare var $: any;
@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {

  revenues: any[] = [];
  total: number = 0;
  page: number = 1;
  limit: number = 10;
  searchParams: any = {
    customer: '',
    phone: '',
    table: '',
    dateIn: '',
    dateOut: ''
  };
  selectedRevenue: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadRevenues();
  }

  loadRevenues(): void {
    const params = {
      ...this.searchParams,
      page: this.page,
      limit: this.limit
    };

    this.dataService.getRevenues(params).subscribe(
      response => {
        this.revenues = response.revenues;
        this.total = response.total;
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  deleteRevenue(id: number): void {
    if (confirm('Are you sure you want to delete this revenue?')) {
      this.dataService.deleteRevenue(id).subscribe(
        response => {
          this.loadRevenues();
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
  }

  viewDetails(revenue: any): void {
    this.selectedRevenue = revenue;
    $('#revenueDetailsModal').modal('show');
  }

  search(): void {
    this.page = 1;
    this.loadRevenues();
  }

  resetSearch(): void {
    this.searchParams = {
      customer: '',
      phone: '',
      table: '',
      dateIn: '',
      dateOut: ''
    };
    this.loadRevenues();
  }
}
