import { Component } from '@angular/core';
import { dmfood } from '../../models/dmfood';
import { food } from '../../models/food';
import { DataService } from '../../service/data.service';

declare var $: any; // Khai báo $ là any để tránh lỗi TypeScript
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  dmFoods: any[] = []; // Mảng chứa danh sách danh mục món ăn
  newDMFood: any = {}; // Đối tượng mới để thêm danh mục món ăn
  editedDMFood: any = {}; // Đối tượng để lưu thông tin danh mục món ăn đang sửa
  constructor(private dataService: DataService){

  }

  ngOnInit(): void {
    this.getDMFoods();
  }
 // Lấy danh sách danh mục món ăn
 getDMFoods() {
  this.dataService.getDMFoods().subscribe(
    (response) => {
      this.dmFoods = response;
    },
    (error) => {
      console.error('Error fetching DM foods:', error);
    }
  );
}

    // Thêm danh mục món ăn mới
    addDMFood() {
      this.dataService.addDMFood(this.newDMFood).subscribe(
        (response) => {
          if (response.status === 'success') {
            console.log('Category added successfully:', response.message);
            // Cập nhật lại danh sách danh mục món ăn sau khi thêm thành công
            this.getDMFoods();
            // Reset lại đối tượng newDMFood
            this.newDMFood = {};
          } else {
            console.error('Failed to add category:', response.message);
            alert('Có lỗi xảy ra khi thêm danh mục món ăn.');
          }
        },
        (error) => {
          console.error('Error adding category:', error);
          alert('Có lỗi xảy ra khi thêm danh mục món ăn.');
        }
      );
    }

    // Xóa danh mục món ăn
  deleteDMFood(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục món ăn này?')) {
      this.dataService.deleteDMFood(id).subscribe(
        (response) => {
          if (response.status === 'success') {
            console.log('Category deleted successfully:', response.message);
            // Cập nhật lại danh sách danh mục món ăn sau khi xóa thành công
            this.getDMFoods();
          } else {
            console.error('Failed to delete category:', response.message);
            alert('Có lỗi xảy ra khi xóa danh mục món ăn.');
          }
        },
        (error) => {
          console.error('Error deleting category:', error);
          alert('Có lỗi xảy ra khi xóa danh mục món ăn.');
        }
      );
    }
  }

  // Sửa danh mục món ăn
  editDMFood(dmFood: any) {
    this.editedDMFood = { ...dmFood }; // Sao chép để tránh thay đổi trực tiếp dữ liệu trong mảng
    // Hiển thị modal sửa danh mục món ăn
    $('#editDMFoodModal').modal('show');
  }

  // Lưu các thay đổi sau khi sửa danh mục món ăn
  saveChanges() {
    this.dataService.editDMFood(this.editedDMFood).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log('Category updated successfully:', response.message);
          // Cập nhật lại danh sách danh mục món ăn sau khi sửa thành công
          const index = this.dmFoods.findIndex(f => f.DMFoodID === this.editedDMFood.DMFoodID);
          if (index !== -1) {
            this.dmFoods[index] = { ...this.editedDMFood };
          }
          $('#editDMFoodModal').modal('hide'); // Đóng modal sau khi lưu thành công
        } else {
          console.error('Failed to edit category:', response.message);
          alert('Có lỗi xảy ra khi sửa danh mục món ăn.');
        }
      },
      (error) => {
        console.error('Error editing category:', error);
        alert('Có lỗi xảy ra khi sửa danh mục món ăn.');
      }
    );
  }
}
