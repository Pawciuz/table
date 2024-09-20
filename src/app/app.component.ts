import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import {AsyncPipe, isPlatformBrowser} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ColumnDefinition, TableComponent } from "./table/table.component";
import { PeriodicElement, TableDataService } from "./table-data.service";
import { NgIf } from "@angular/common";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';

interface ComponentState {
  elements: PeriodicElement[];
  loading: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableComponent, NgIf, MatProgressSpinner, TableComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RxState]
})
export class AppComponent {
  private state = inject(RxState<ComponentState>);

  title = 'table';
  columns: ColumnDefinition[] = [
    {key: 'position', header: 'No.'},
    {key: 'name', header: 'Name'},
    {key: 'weight', header: 'Weight'},
    {key: 'symbol', header: 'Symbol'}
  ];

  elements$: Observable<PeriodicElement[]> = this.state.select('elements');
  loading$: Observable<boolean> = this.state.select('loading');
  isClient: boolean;

  constructor(
    private dataService: TableDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isClient = isPlatformBrowser(this.platformId);
    this.state.set({ loading: true, elements: [] });
  }

  ngOnInit() {
    this.loadElements();
  }

  loadElements() {
    if (this.isClient) {
      this.state.connect('elements', this.dataService.getElements());
      this.state.hold(this.dataService.getElements(), () => {
        this.state.set({ loading: false });
      });
    } else {
      this.state.set({ loading: false });
    }
  }

  onElementUpdated(updatedElement: PeriodicElement) {
    this.dataService.updateElement(updatedElement).subscribe({
      next: (result) => {
        this.state.set((state) => ({
          elements: state.elements.map((el: { position: number; }) =>
            el.position === result.position ? result : el
          )
        }));
      },
      error: (error) => console.error('Error updating element:', error)
    });
  }
}
