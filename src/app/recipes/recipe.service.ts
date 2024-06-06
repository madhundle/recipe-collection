import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
    // No longer needed with Routing
    // recipeSelected = new EventEmitter<Recipe>();

    // addToShoppingListEvent = new EventEmitter<Ingredient[]>();

    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];
    // Dummy Data no longer needed because we're fetching from the server now
    // private recipes: Recipe[] = [
    //     new Recipe('Chicken Pot Pie', 'My favorite homemade dinner', 
    //                 'https://bakesbybrownsugar.com/wp-content/uploads/2022/01/Clementine-Bundt-Cake-4C3.jpg',
    //                 [new Ingredient("chicken breasts", 2), 
    //                  new Ingredient("chicken stock", 1)]),
    //     new Recipe('A Second Recipe', 'Nom Nom Nom Nom', 
    //                 'https://bakesbybrownsugar.com/wp-content/uploads/2022/01/Clementine-Bundt-Cake-4C3.jpg',
    //                 [new Ingredient("red bell pepper", 2), 
    //                  new Ingredient("walnuts", 8), 
    //                  new Ingredient("olive oil", 1)])
    //   ];

    constructor(private shoppingListService:ShoppingListService) {}

    getRecipes() {
      return this.recipes.slice(); // return a copy
    }

    getRecipe(id: number) {
      return this.recipes.slice()[id]; // return a shallow copy
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
      this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.recipesChanged.next(this.recipes.slice());
    }
    
    updateRecipe(index: number, recipe: Recipe) {
      this.recipes[index] = recipe;
      this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.recipesChanged.next(this.recipes.slice());
    }

    setRecipes(recipes: Recipe[]) {
      // Set our collection of recipes
      // Will override any initial recipes set here in this Service
      // Will be used by the DataStorageService after fetching recipes from the server
      this.recipes = recipes; 
      this.recipesChanged.next(this.recipes.slice());
    }

}