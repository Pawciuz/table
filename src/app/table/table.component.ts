import {Component, Input, OnInit, Output, EventEmitter, ViewChild, Inject, PLATFORM_ID} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {isPlatformBrowser, NgClass, NgForOf, NgIf} from '@angular/common';
import {EditTableRowComponent} from '../edit-table-row/edit-table-row.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatPaginator} from '@angular/material/paginator';
import {PeriodicElement} from "../table-data.service";
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";

export interface ColumnDefinition {
  key: string;
  header: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    MatFormField,
    MatTable,
    MatInput,
    MatHeaderRow,
    NgForOf,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    NgIf,
    MatProgressSpinner,
    MatPaginator,
    NgClass,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll
  ]
})
export class TableComponent implements OnInit {
  @Input() columns: ColumnDefinition[] = [];
  @Input() isLoading = false;

  @Input() set data(value: PeriodicElement[]) {
    this._data = this.sortByPosition(value);
    this.initializeDataSource();
  }

  get data(): any[] {
    return this._data;
  }

  @Output() elementUpdated = new EventEmitter<PeriodicElement>();

  private _data: PeriodicElement[] = [];
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<PeriodicElement>;

  private filterSubject = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: any) {
    this.filterSubject
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((filterValue) => {
        if (this.dataSource) {
          this.dataSource.filter = filterValue.trim().toLowerCase();
        }
      });
  }

  ngOnInit() {
    this.displayedColumns = this.columns.map(column => column.key);
    this.initializeDataSource();
  }

  private initializeDataSource() {
    this.dataSource = new MatTableDataSource(this._data);

    if (this.paginator ) {
      this.dataSource.paginator = this.paginator;
      this.paginator.length = this._data.length;
    }

    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return currentTerm + data[key as keyof PeriodicElement] + '◬';
      }, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
  }

  truncate(value: string, length: number = 25): string {
    if (value && value.length > length) {
      return value.substring(0, length) + '...';
    }
    return value;
  }

  openDialog(element: PeriodicElement, columnKey: string): void {
    const dialogRef = this.dialog.open(EditTableRowComponent, {
      width: '250px',
      data: {
        value: element[columnKey as keyof PeriodicElement],
        columnKey: columnKey
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const updatedElement = {...element, [columnKey]: result};
        this.elementUpdated.emit(updatedElement);
        const index = this._data.findIndex(e => e === element);
        this._data = [
          ...this._data.slice(0, index),
          updatedElement,
          ...this._data.slice(index + 1)
        ];

        if (columnKey === 'position') {
          this._data = this.sortByPosition(this._data);
        }

        this.initializeDataSource();
      }
    });
  }

  private sortByPosition(data: PeriodicElement[]): PeriodicElement[] {
    return data.sort((a, b) => {
      const posA = a.position;
      const posB = b.position;
      return posA - posB;
    });
  }
}
