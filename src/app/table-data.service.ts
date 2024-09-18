import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { delay, Observable, of } from 'rxjs';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  private ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  getElements(): Observable<PeriodicElement[]> {
    if (isPlatformBrowser(this.platformId)) {
      return of(this.ELEMENT_DATA).pipe(delay(2000));
    } else {
      return of(this.ELEMENT_DATA);
    }
  }

  updateElement(updatedElement: PeriodicElement): Observable<PeriodicElement> {
    const index = this.ELEMENT_DATA.findIndex(el => el.position === updatedElement.position);
    if (index !== -1) {
      this.ELEMENT_DATA[index] = updatedElement;
    }

    if (isPlatformBrowser(this.platformId)) {
      return of(updatedElement).pipe(delay(500));
    } else {
      return of(updatedElement);
    }
  }
}
