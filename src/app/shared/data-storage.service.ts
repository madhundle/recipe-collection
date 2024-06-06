import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";

// necessary because we will inject the HTTP Service into our Service
@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, 
              private recipeService: RecipeService,
              private authService: AuthService) {}
  
  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
    .put( // stores all recipes, overriding what's already there
      'https://recipe-collection-58a91-default-rtdb.firebaseio.com/recipes.json',
      recipes
    )
    .subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    // We must return the whole observable because we're subscribing elsewhere
    return this.http.get<Recipe[]>(
      'https://recipe-collection-58a91-default-rtdb.firebaseio.com/recipes.json')
    .pipe(
      // making sure all recipes have ingredients to prevent bugs
      map(response => {
        return response.map(recipe => {
            // craft and return a new object which is a copy of recipe, but check ingredients
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  
    // No longer using here after adding RecipesResolverService
    // .subscribe(recipes => {
    //   this.recipeService.setRecipes(recipes);
    // });
  }
}