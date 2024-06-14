const query = document.querySelector("#gifToSearch");
const nbr = document.querySelector("select");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector("#button");
let xValues = ["protein", "fat", "carbohydrates"];
let yValues = [20, 30, 50];
let barColors = ["orange", "green","blue"];

function generate() {
  // Mettre le wrapper à vide
  wrapper.innerHTML = "";

  fetch(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=8565a82cbb824636a7f9b75b960b1233&query=${query.value}&addRecipeInstructions=true&instructionsRequired=true&number=${nbr.value}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      data.results.forEach(function (oneResult) {
        console.log(oneResult.id);
        // On s'assure que la 1ère lettre de chaque titre soit en majuscule
        const recipeTitle = oneResult.title.charAt(0).toUpperCase() + oneResult.title.slice(1);
        fetch(
          `https://api.spoonacular.com/recipes/${oneResult.id}/information?apiKey=8565a82cbb824636a7f9b75b960b1233&includeNutrition=true`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            wrapper.innerHTML += `<h3><a href="${data.sourceUrl}" target="_blank" data-aos="fade-left">${recipeTitle}</a></h3>`;
            // Ajoute une classe parente qui contiendra la div image et la div recipe
            const parentDiv = document.createElement("div");
            parentDiv.className = "image-ingredients";
            parentDiv.setAttribute("data-aos", "fade-up");
            parentDiv.setAttribute("data-aos-anchor-placement", "top-bottom");

            // Crée la div pour l'image / onerror= permet le lien vers l'image ne fonctionne pas, d'afficher une image par défaut
            const imageDiv = document.createElement("div");
            imageDiv.className = "image";
            imageDiv.innerHTML = `<img src="${data.image}" onerror="this.src='../img/pexels-karolina-grabowska-4033639.jpg'" alt="photo recette">`;

            // Crée une div pour les ingrédients
            const ingredientsDiv = document.createElement("ul");
            ingredientsDiv.className = "ingredients";

            // En considérant que les ingrédients sont stockés dans un tableau d'objets dans la section 'extendedIngredients'
            data.extendedIngredients.forEach(function (oneIngredient) {
              const ingredientElement = document.createElement("li");
              if (oneIngredient.measures.metric.amount < 1) {
                ingredientElement.innerHTML = `<b>1 ${oneIngredient.measures.metric.unitShort}</b> ${oneIngredient.name}`;
              } else {
                ingredientElement.innerHTML = `<b>${parseInt(
                  oneIngredient.measures.metric.amount
                )} ${oneIngredient.measures.metric.unitShort}</b> ${
                  oneIngredient.name
                }`;
              }

              /*ingredientElement.textContent += oneIngredient.measures.metric.unitShort;
            ingredientElement.textContent = oneIngredient.name;*/
              ingredientsDiv.appendChild(ingredientElement);
            });

            const instruction = document.createElement("details");
            instruction.className = "instruction-block";
            instruction.innerHTML = `<summary>Recipe</summary>`;

            // Crée une div pour les instructions. On l'inclut dans instruction
            const instructionsList = document.createElement("ol");
            instructionsList.className = "instructions";
            instruction.appendChild(instructionsList);

            if (data.analyzedInstructions[0].steps.length !== 1) {
              // En considérant que les instructions sont stockés dans un tableau d'objets dans la section 'analyzedInstructions'
              data.analyzedInstructions[0].steps.forEach(function (
                oneInstruction
              ) {
                const instructionSingleElement = document.createElement("li");
                instructionSingleElement.textContent = oneInstruction.step;
                instructionsList.appendChild(instructionSingleElement);
              });
            } else {
              const instructionSingleElement = document.createElement("p");
              instructionSingleElement.textContent =
                data.analyzedInstructions[0].steps[0].step;
              instructionsList.appendChild(instructionSingleElement);
            }

            //ajout des Indices Nutritionnels
            const nutritionFacts = document.createElement("div");
            nutritionFacts.className = "nutrition-facts";

            const calories = parseInt(
              data.nutrition.nutrients.find(
                (element) => element.name === "Calories"
              ).amount
            );
            const fat = parseInt(
              data.nutrition.nutrients.find((element) => element.name === "Fat")
                .amount
            );
            const sat_fat = parseInt(
              data.nutrition.nutrients.find(
                (element) => element.name === "Saturated Fat"
              ).amount
            );
            const carbs = parseInt(
              data.nutrition.nutrients.find(
                (element) => element.name === "Carbohydrates"
              ).amount
            );
            const prot = parseInt(
              data.nutrition.nutrients.find(
                (element) => element.name === "Protein"
              ).amount
            );

            nutritionFacts.innerHTML = `<p><span>Energy</span> ${calories} kcal</p> <p><span>Fat</span> ${fat}g</p> <p><span>Saturated Fat</span> ${sat_fat}g</p> <p><span>Carbohydrates</span> ${carbs}g</p> <p><span>Protein</span> ${prot}g</p>`;
            
            // Données pourcentage nutritionnelles
            const nutritionPercentCanvas = document.createElement("canvas")
            nutritionPercentCanvas.id = 'myChart'
            
            function maSousFonction() {
              const proteinPc = data.nutrition.caloricBreakdown.percentProtein
              const fatPc = data.nutrition.caloricBreakdown.percentFat
              const carbsPc = data.nutrition.caloricBreakdown.percentCarbs
  
              xValues = ["protein", "fat", "carbohydrates"]
              yValues = [proteinPc, fatPc, carbsPc]
              barColors = ["orange", "green","blue"]
              console.log(yValues)
             }
              
  
              maSousFonction()
              // return { xValues, yValues, barColors }
            console.log(yValues)

            // Ajoute imageDiv & ingredientsDiv au wrapper
            parentDiv.appendChild(imageDiv);

            const ingredientsInstructionsDiv = document.createElement("div");
            ingredientsInstructionsDiv.className = "ingredients-instruction";

            ingredientsInstructionsDiv.appendChild(ingredientsDiv);
            ingredientsInstructionsDiv.appendChild(instruction);
            ingredientsInstructionsDiv.appendChild(nutritionFacts);
            ingredientsInstructionsDiv.appendChild(nutritionPercentCanvas);

            parentDiv.appendChild(ingredientsInstructionsDiv);

            // Ajoute la div parente au conteneur principal (wrapper)
            wrapper.appendChild(parentDiv);
          })
          .catch((error) => {
            console.log("Erreur lors de la récup des données :", error);
          });
      });
    })
    .catch((error) => {
      console.log("Erreur lors de la récup des données :", error);
    });
}

query.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("button").click();
  }
});

button.addEventListener("click", function () {
  generate();
});

/*https://api.spoonacular.com/recipes/complexSearch?apiKey=8565a82cbb824636a7f9b75b960b1233&query=pasta&addRecipeInstructions=true&instructionsRequired=true*/

console.log(xValues)

new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "World Wide Wine Production"
    }
  }
});