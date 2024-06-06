import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RecipesComponent } from "./recipes.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesEditComponent } from './recipes-edit/recipes-edit.component';

import { AuthGuard } from "../auth/auth.guard";
import { RecipesResolverService } from "./recipes-resolver.service";
import { SharedModule } from "../shared/shared.module";

const recipeRoutes: Routes = [{ 
  path: '', // used to be /recipes, now '' with lazy loading
  component: RecipesComponent, 
  canActivate: [AuthGuard],
  children: [
    { path: '', component: RecipeStartComponent },
    { path: 'create', component: RecipesEditComponent },
    { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
    { path: ':id/edit', component: RecipesEditComponent, resolve: [RecipesResolverService] }
  ]
}];

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipesEditComponent
  ],
  imports: [
    RouterModule.forChild(recipeRoutes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RecipesModule {}