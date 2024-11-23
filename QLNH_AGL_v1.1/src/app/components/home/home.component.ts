import { DataService } from '../../service/data.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private service: DataService, private router: Router, private route: ActivatedRoute) { }
  @ViewChild('myChart') myChartRef!: ElementRef<HTMLCanvasElement>;
  myChart: Chart | undefined;

  tables: any[] = [];
  nameUser: string = "";
  accType: string = "";

  totalAmount: number = 0;
  quantityCustomer: number = 0;
  quantityTableEmpty: number = 0;
  quantityAllTable: number = 0;
  foodName: string = "";
  per: number = 0;
  billHistory: any;
  revenuMonth: any;
  revenuHour: any;
  revenuDay: any;

  trucX: any;
  trucY: any;
  maxTicksLimit: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      setTimeout(() => {
        this.getDataForHome();
      }, 100);
    });
  }

  viewByMonth() {
    this.trucX = [];
    this.trucX = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
    this.trucY = new Array(12).fill(0);

    const monthlyTotal = this.revenuMonth;

    for (let i = 0; i < monthlyTotal.length; i++) {
      let index = monthlyTotal[i].datamonth - 1;
      this.trucY[index] = monthlyTotal[i].TotalAmount;
    }
    if (this.myChart) {
      if (this.myChart.options.scales && this.myChart.options.scales['x']) {
        if (this.myChart.options.scales['x'].ticks) {
          this.myChart.options.scales['x'].ticks.maxTicksLimit = 6;
          this.updateChart();
        }
      }
    }
  }

  viewByDay() {
    this.trucX = [];
    this.trucY = [];

    const dayTotal = this.revenuDay;

    for (let i = 0; i < dayTotal.length; i++) {
      let index = dayTotal[i].bill_date;
      this.trucX.push(index);
      this.trucY.push(dayTotal[i].TotalAmount)
    }
    if (this.myChart) {
      if (this.myChart.options.scales && this.myChart.options.scales['x']) {
        if (this.myChart.options.scales['x'].ticks) {
          if (this.trucX.length >= 30) {
            this.myChart.options.scales['x'].ticks.maxTicksLimit = 15;
          } else {
            this.myChart.options.scales['x'].ticks.maxTicksLimit = this.trucX.length;
          }
          this.updateChart();
        }
      }
    }
  }

  viewByHour() {
    this.trucX = [];
    this.trucX = ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    this.trucY = new Array(17).fill(0);

    const hoursTotal = this.revenuHour;

    for (let i = 0; i < hoursTotal.length; i++) {
      let index = hoursTotal[i].hour_of_day - 6;
      this.trucY[index] = hoursTotal[i].TotalAmount;
    }
    if (this.myChart) {
      if (this.myChart.options.scales && this.myChart.options.scales['x']) {
        if (this.myChart.options.scales['x'].ticks) {
          this.myChart.options.scales['x'].ticks.maxTicksLimit = 8;
          this.updateChart();
        }
      }
    }

  }

  updateChart(): void {
    if (this.myChart) {
      this.myChart.data.datasets[0].data = this.trucY;
      this.myChart.data.labels = this.trucX;
      this.myChart.update();
    }
  }

  initChart(trucX: any, trucY: any): void {
    const ctx = this.myChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: trucX,
          datasets: [{
            label: "Tổng tiền",
            data: trucY,
            fill: true,
            tension: 0.3,
            borderColor: "rgba(78, 115, 223, 1)",
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
          }]
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 0,
              bottom: 15
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                maxTicksLimit: 0
              }
            },
            y: {
              ticks: {
                maxTicksLimit: 8,
                padding: 10
              },
              grid: {
                color: "rgb(234, 236, 244)",
              }
            },
          },
        }
      });
    }
    this.viewByHour();
  }

  getDataForHome() {
    this.service.getTbBillHistory().subscribe(res => {
      this.service.readDataJsonForHome().subscribe(res => {
        this.billHistory = [];
        if (res.TotalAmount.TotalAmount) {
          this.totalAmount = res.TotalAmount.TotalAmount;
        } else if (res.TotalAmount.TotalAmount == null) {
          this.totalAmount = 0;
        }

        if (res.TotalCustomer.length > 0) {
          this.quantityCustomer = res.TotalCustomer.length;
        } else if (res.TotalCustomer == null) {
          this.quantityCustomer = 0;
        }

        this.quantityAllTable = res.TotalTable.QuantityTableEmpty;
        this.quantityTableEmpty = res.TotalTableNotEmpty.QuantityTableEmpty;
        
        if (res.BestFoodName.FoodName != null) {
          this.foodName = res.BestFoodName.FoodName;
          this.per = res.BestFoodName?.Quantity / res.ToTalQuantitySold.Quantity * 100;
        } else if (res.BestFoodName.FoodName == null) {
          this.foodName = "Không có";
        }

        this.billHistory = res.TotalCustomer;

        this.revenuMonth = res.TotalAmountByMonth;
        this.revenuDay = res.TotalAmountByDay;
        this.revenuHour = res.TotalAmountByHour;

        if (this.myChartRef) {
          this.initChart(this.trucX, this.trucY);
        }
      })
    })
  }
}
