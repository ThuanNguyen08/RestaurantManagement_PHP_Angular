import { Component, OnInit } from '@angular/core';
import { table } from '../../models/table';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-ds-ban',
  templateUrl: './ds-ban.component.html',
  styleUrl: './ds-ban.component.css'
})
export class DsBanComponent {
  tables: table[] = [];
  newTableName: string = '';
  newTableStatus: string = 'Trống'; // Mặc định trạng thái bàn mới là 'Trống'
  showModal: boolean = false;
  selectedTable: any = {};    // Holds the selected table for deletion
  showDeleteModal: boolean = false;
  showUpdateModal: boolean = false;


  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.getTables();
  }

  getTables(): void {
    this.service.getTbDsTable().subscribe(res => {
      this.service.readTbDsTableJson().subscribe((res: table[]) => {
        this.tables = res;
      });
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newTableName = '';
    this.newTableStatus = 'Trống'; // Reset lại trạng thái
  }


  // Phương thức thêm bàn mới
  addTable() {
    if (this.newTableName && this.newTableStatus) {
      this.service.addTable(this.newTableName, this.newTableStatus).subscribe(response => {
        // Xử lý sau khi thêm bàn thành công, có thể tải lại danh sách bàn
        this.closeModal();
        this.getTables();
        location.reload()
      }
      )
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedTable = null; // Clear selected table
  }
  deleteTable() {
    if (this.selectedTable) {
      const tableId = this.selectedTable.TableID; // Assuming you have TableID in your table object

      this.service.deleteTable(tableId).subscribe(response => {
        // Handle successful deletion, e.g., refresh table list
        this.closeDeleteModal();
        this.getTables();
        location.reload()
      }, error => {
        console.error('Error deleting table:', error);
        // Handle error if necessary
      });
    }
  }


  deleteTableConfirmation(table: any) {
    this.selectedTable = table;  // Store selected table for deletion
    this.showDeleteModal = true; // Show delete confirmation modal
  }

  editTable(table: any) {
    this.selectedTable = { ...table }; // Copy selected table to avoid direct reference
    this.showUpdateModal = true; // Show update modal
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedTable = null; // Clear selected table
  }

  updateTable() {
    if (this.selectedTable) {
      const { TableID, TableName, Status } = this.selectedTable;

      this.service.updateTable(TableID, TableName, Status).subscribe(() => {
        // Handle successful update, e.g., refresh table list
        this.closeUpdateModal();
        this.getTables();
        location.reload()
      })
    }
  }



}
