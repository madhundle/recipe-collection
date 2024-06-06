import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
  // providers: [RecipeService] // imported in App Module now
})
export class RecipesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // No longer needed with Routing
    // this.recipeService.recipeSelected.subscribe(
    //   (recipe: Recipe) => {
    //     this.selectedRecipe = recipe;
    // });
  }
}
