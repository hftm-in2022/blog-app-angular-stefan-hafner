import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavStateService { // wird das benutzt?
  // Sidenav States
  private sidenavInfoSource = new BehaviorSubject<{   // warum kein signal
    title: string;
    isOverview: boolean;
  }>({
    title: 'Default',
    isOverview: false,
  });

  sidenavInfo$ = this.sidenavInfoSource.asObservable();

  // Update Method
  updateSidenavInfo(title: string, isOverview: boolean) {  
    this.sidenavInfoSource.next({ title, isOverview });
  }
}
