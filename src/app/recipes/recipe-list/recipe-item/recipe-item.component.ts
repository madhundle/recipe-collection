import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() index: number;

  // Replaced with Routing
  // constructor(private recipeService: RecipeService) {}
  // selectRecipe() {
  //   this.recipeService.recipeSelected.emit(this.recipe);
  // }

  ngOnInit(): void {
    
  }
}
