import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor (private dataStorageService: DataStorageService,
               private recipeService: RecipeService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Only fetch new recipes if we don't have any
    // prevents overwriting edits we're making
    const recipes = this.recipeService.getRecipes();
    if (recipes.length > 0) {
      return recipes;
    }
    // We don't subscribe here because the Resolver will subscribe for us
    return this.dataStorageService.fetchRecipes();
  }
}