// Create Recipe Search Class
class Recipe {
  constructor(){
    this.app_id = '33ef320b';
    this.app_key = '16dec4e1cfa93d80d4ed52aa172ddb5e';
    this.recipe_count = 50;
  }

  async getRecipe(searchQ) {
    const recipeRequest = await fetch(`https://api.edamam.com/search?q=${searchQ}&app_id=${this.app_id}&app_key=${this.app_key}&from=0&to=${this.recipe_count}`);


    const recipeResponse = recipeRequest.json();

    return recipeResponse;
  }


}

const mainSection = document.querySelector('#recipe-display');
const search = document.querySelector('#search');
const searchBtn = document.querySelector('#search-button');
const recipes = new Recipe

searchBtn.addEventListener('click', ()=> {
  let searchQ = search.value;
  if(searchQ !== ''){
   recipes.getRecipe(searchQ)
   .then(results => {
     createUI(results.hits);
   })
  }


})



const createUI = (obj)=> {
  mainSection.innerHTML = '';
  // For loop to create recipe cards
  for(let i = 0; i <= obj.length; i++){
    // All divs that will be used in the recipe display
  const recipeCard = document.createElement('div');
  recipeCard.classList.add('recipe-card');

  const mealBox = document.createElement('div');
  mealBox.classList.add('meal-box');

  const sourceLinks = document.createElement('div');
  sourceLinks.classList.add('source-links')  ;

  const nutritionFacts = document.createElement('div');
  nutritionFacts.classList.add('nutrition-facts');

  const mealBtns = document.createElement('div');
  mealBtns.classList.add('meal-buttons')  ;

  // All info from the recipe request
  const recipeImg = document.createElement('img');
  recipeImg.src = `${obj[i].recipe.image}`;
  recipeImg.classList.add('recipe-img')

  const h3 = document.createElement('h3');
  h3.innerText = `${obj[i].recipe.label}`;

  const paragraph = document.createElement('p');
  paragraph.innerText =`${obj[i].recipe.ingredientLines.toString().substring(0,100)} . . .`;
  
  const sourceURL = document.createElement('a');
  sourceURL.href =`${obj[i].recipe.sourceURL}`;
  
  const sourceName = document.createElement('p');
  sourceName.classList.add('source');
  sourceName.innerText = `Source: ${obj[i].recipe.source}`;

  const servings = document.createElement('p');
  servings.innerText = `Servings: ${obj[i].recipe.yield}`

  const caloriesPer = document.createElement('p');
  caloriesPer.innerText = `Calories: ${Math.floor(obj[i].recipe.calories / obj[i].recipe.yield)}/serving`;

  //Save form post action
  const saveForm = document.createElement('form');
  saveForm.action = "/search"
  saveForm.method ="POST"

  //Create hidden form for submitting recipes to mongodb!
  const labelForm = document.createElement('input');
  labelForm.type = "hidden";
  labelForm.value = `${obj[i].recipe.label}`;
  labelForm.name = "savedMeal[label]";

  const imageForm = document.createElement('input');
  imageForm.type = "hidden";
  imageForm.value = `${obj[i].recipe.image}`;
  imageForm.name = "savedMeal[image]";

  const sourceForm = document.createElement('input');
  sourceForm.type = "hidden";
  sourceForm.value = `${obj[i].recipe.source}`;
  sourceForm.name = "savedMeal[source]";

  const sourceUrlForm = document.createElement('input');
  sourceUrlForm.type = "hidden";
  sourceUrlForm.value = `${obj[i].recipe.url}`;
  sourceUrlForm.name = "savedMeal[sourceURL]";  

  const servingsForm = document.createElement('input');
  servingsForm.type = "hidden";
  servingsForm.value = `${obj[i].recipe.yield}`;
  servingsForm.name = "savedMeal[servings]";

  const ingredientsForm = document.createElement('input');
  ingredientsForm.type = "hidden";
  ingredientsForm.value = `${obj[i].recipe.ingredientLines}`
  ingredientsForm.name = "savedMeal[ingredients]";

  const caloriesForm = document.createElement('input');
  caloriesForm.type = "hidden";
  caloriesForm.value = `${obj[i].recipe.calories}`;  
  caloriesForm.name = "savedMeal[calories]"
  
  const saveButton = document.createElement('button');
  saveButton.classList.add('save-meal-btn');
  saveButton.innerText = 'Save Meal';

  //Adding recipe card to the main section and all other elements to recipe card
  mainSection.appendChild(recipeCard);
  h3.append(sourceURL);
  sourceLinks.append(h3, sourceName);
  mealBox.append(sourceLinks, paragraph, nutritionFacts, mealBtns);
  nutritionFacts.append(servings, caloriesPer);
  mealBtns.append(saveForm);
  recipeCard.append(recipeImg, mealBox);
  saveForm.append(labelForm, imageForm, sourceForm, sourceUrlForm, servingsForm, ingredientsForm, caloriesForm, saveButton,);
  }
}