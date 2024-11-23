import { Component, OnInit } from '@angular/core';
import { food } from '../../models/food';
import { DataService } from '../../service/data.service';
import { dmfood } from '../../models/dmfood';


declare var $: any; // Khai báo $ là any để tránh lỗi TypeScript

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  foods: food[] = [];
  originalFoods: food[] = []; // Thêm biến này để lưu danh sách món ăn ban đầu để tìm kiếm
  foodToEdit: food = new food(0, '', 0, 0, ''); // Sửa lại khởi tạo
  newFood: food = new food(0, '', 0, 0, '');
  searchKeyword: string = ''; // Biến lưu từ khóa tìm kiếm
  
  page: number = 1;
  limit: number = 8;
  total: number = 0;
  totalPages: number = 0;
  pages: number[] = [];

  categories: dmfood[] = [];
  selectedCategory: number = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadFoods();
    this.loadCategories();
  }

  // loadFoods() {
  //   this.dataService.getFood().subscribe(foods => {
  //     this.foods = foods;
  //     // this.saveFoodsToJSON();
  //   });
  // }

  loadFoods() {
    this.dataService.getFood(this.page, this.limit).subscribe(response => {
      this.foods = response.foods;
      this.originalFoods = response.foods; // Lưu danh sách món ăn ban đầu
      this.total = response.total;
      this.totalPages = Math.ceil(this.total / this.limit);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }
  
  loadCategories() {
    this.dataService.getDMFoods().subscribe(categories => {
      this.categories = categories;
    });
  }

  searchFood() {
    if (this.searchKeyword.trim() !== '') {
      this.foods = this.originalFoods.filter(food =>
        food.FoodName.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    } else {
      this.foods = [...this.originalFoods]; // Khôi phục danh sách món ăn ban đầu
    }
  }

  filterFoodsByCategory() {
    if (this.selectedCategory == 0) {
      this.loadFoods();
    } else {
      this.dataService.getFoodsByCategory(this.selectedCategory).subscribe(foods => {
        this.foods = foods;
        this.total = foods.length;
        this.totalPages = 1;
        this.pages = [1];
      });
    }
  }

  saveFoodsToJSON() {
    this.dataService.saveFoodsToJSON(this.foods).subscribe(response => {
      console.log(response.message);
    });
  }


  deleteFood(index: number) {
    const foodToDelete = this.foods[index];
    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa món ăn: ${foodToDelete.FoodName}?`);
    if (confirmDelete) {
      this.dataService.deleteFood(foodToDelete.FoodID).subscribe(
        response => {
          if (response.status === "success") {
            console.log(response.message);
            // Xóa món ăn khỏi danh sách trên giao diện
            this.foods.splice(index, 1);
          } else {
            console.error('Failed to delete food:', response.message);
            alert('Có lỗi xảy ra khi xóa món ăn.');
          }
        },
        error => {
          console.error('Error deleting food:', error);
          alert('Có lỗi xảy ra khi xóa món ăn.');
        }
      );
    }
  }
  

  editFood(index: number) {
    this.foodToEdit = { ...this.foods[index] }; // Sao chép món ăn để sửa
    // Hiển thị modal sửa món ăn
    $('#editFoodModal').modal('show');
  }

  saveChanges() {
    this.dataService.editFood(this.foodToEdit).subscribe(
      response => {
        if (response.status === "success") {
          console.log(response.message);
          // Cập nhật lại món ăn trong danh sách
          const index = this.foods.findIndex(f => f.FoodID === this.foodToEdit.FoodID);
          if (index !== -1) {
            this.foods[index] = { ...this.foodToEdit };
          }
          $('#editFoodModal').modal('hide'); // Đóng modal sau khi lưu thành công
        } else {
          console.error('Failed to edit food1:', response.message);
          alert('Có lỗi xảy ra khi sửa món ăn1.');
        }
      },
      error => {
        console.error('Error editing food2:', error);
        alert('Có lỗi xảy ra khi sửa món ăn2.');
      }
    );
  }

  openAddFoodModal() {
    // Reset newFood object
    this.newFood = new food(0, '', 0, 0, '');
    // Show the modal
    $('#addFoodModal').modal('show');
  }

  addFood() {
    this.dataService.addFood(this.newFood).subscribe(
      response => {
        if (response.status === "success") {
          console.log(response.message);
          // Reload foods list or update locally
          this.loadFoods();
          $('#addFoodModal').modal('hide'); // Hide the modal after success
        } else {
          console.error('Failed to add food:', response.message);
          alert('Có lỗi xảy ra khi thêm món ăn.');
        }
      },
      error => {
        console.error('Error adding food:', error);
        alert('Có lỗi xảy ra khi thêm món ăn.');
      }
    );
  }
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.page = page;
      this.loadFoods();
    }
  }
}
