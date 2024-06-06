import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component ({
  selector: 'app-header',
  templateUrl:'./header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isUserAuth = false;
  private userSub: Subscription;

  // No longer needed after adding Routing
  // @Output() featureSelected = new EventEmitter<string>();
  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }

  // @Output() selectedRecipes = new EventEmitter();
  // @Output() selectedShopping = new EventEmitter();
  // selectRecipes() {
  //   this.selectedRecipes.emit();
  // }
  // selectShopping() {
  //   this.selectedShopping.emit();
  // }

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
    this.isUserAuth = !!user; // boolean trick
      // this.isUserAuth = !user ? false : true;
    });
  }

  clickSaveData() {
    this.dataStorageService.storeRecipes();
  }

  clickFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  clickLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}