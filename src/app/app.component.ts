import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'recipe-collection';
  
  // Replaced by Routing
  // selectedFeature = 'shopping-list';
  // onNavigate(feature:string) {
  //   this.selectedFeature = feature;
  // }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
