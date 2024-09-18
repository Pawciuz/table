import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-edit-table-row',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    NgForOf,
    MatLabel
  ],
  templateUrl: './edit-table-row.component.html',
  styleUrl: './edit-table-row.component.css'
})
export class EditTableRowComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    value: any,
    columnKey: string
  }, private dialogRef: MatDialogRef<EditTableRowComponent>) {
  }

  submit() {
    this.dialogRef.close(this.data.value);
  }

  close() {
    this.dialogRef.close();
  }
}
