import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavStateService {
  // Sidenav States
  private sidenavInfoSource = new BehaviorSubject<{
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
