import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";

/*
A Module to host features and Angular modules used throughout other modules
*/
@NgModule({
  declarations: [
    AlertComponent,
    DropdownDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule {}