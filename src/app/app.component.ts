import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {ColumnDefinition, TableComponent} from "./table/table.component";
import {PeriodicElement, TableDataService} from "./table-data.service";
import {NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableComponent, NgIf, MatProgressSpinner, TableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // corrected 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'table';
  columns: ColumnDefinition[] = [
    {key: 'position', header: 'No.'},
    {key: 'name', header: 'Name'},
    {key: 'weight', header: 'Weight'},
    {key: 'symbol', header: 'Symbol'}
  ];
  elements: PeriodicElement[] = [];
  loading = true;
  isClient: boolean

  constructor(
    private dataService: TableDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isClient = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadElements();
  }

  loadElements() {
    if (this.isClient) {
      this.dataService.getElements().subscribe({
        next: (data) => {
          this.elements = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching elements:', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  onElementUpdated(updatedElement: PeriodicElement) {
    this.dataService.updateElement(updatedElement).subscribe({
      next: (result) => {
        const index = this.elements.findIndex(el => el.position === result.position);
        if (index !== -1) {
          this.elements = [
            ...this.elements.slice(0, index),
            result,
            ...this.elements.slice(index + 1)
          ];
        }
      }
      ,
      error: (error) => console.error('Error updating element:', error)
    });
  }
}
