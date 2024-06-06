import { NgModule } from "@angular/core";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { AuthGuard } from "../auth/auth.guard";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

const shoppingListRoutes: Routes = [
  { path: '',  // used to be /shopping-list, now '' with lazy loading
    component: ShoppingListComponent, 
    canActivate: [AuthGuard] }
]

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    RouterModule.forChild(shoppingListRoutes),
    FormsModule,
    SharedModule
  ]
})
export class ShoppingListModule {}