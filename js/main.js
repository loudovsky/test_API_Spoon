const query = document.querySelector('#gifToSearch')
const nbr = document.querySelector('select')
const wrapper = document.querySelector('.wrapper')
const button = document.querySelector('#button')

function generate() {
    // Mettre wrapper à vide
    wrapper.innerHTML = ''


    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=8565a82cbb824636a7f9b75b960b1233&query=${query.value}&addRecipeInstructions=true&instructionsRequired=true`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      
      data.results.forEach(function(oneResult){
        console.log(oneResult.id);
        const title = oneResult.title
        fetch(`https://api.spoonacular.com/recipes/${oneResult.id}/information?apiKey=8565a82cbb824636a7f9b75b960b1233`)
        .then(response => response.json())
        .then(data => {
        console.log(data);


        wrapper.innerHTML += `<h3><a href="${data.sourceUrl}" target="_blank">${title}</a></h3>`;
        // Ajoute une classe parente qui contiendra la div image et la div recipe
        const parentDiv = document.createElement("div");
        parentDiv.className = "image-ingredients"; 

        // Crée la div pour l'image
        const imageDiv = document.createElement("div");
        imageDiv.className = "image";
        imageDiv.innerHTML = `<img src="${data.image}" alt="photo recette">`;

        // Crée la div pour les ingrédients
          const ingredientsDiv = document.createElement("ul");
          ingredientsDiv.className = "ingredients";

          // En considérant que les ingrédients sont stockés dans un tableau d'objets dans la section 'recipe'
          data.extendedIngredients.forEach(function(oneIngredient){
            const ingredientElement = document.createElement("li");
            ingredientElement.textContent = oneIngredient.name;
            ingredientsDiv.appendChild(ingredientElement);
          })
          const instructionsElement = document.createElement("div")
          instructionsElement.className = "instructions";
          instructionsElement.innerHTML = data.instructions;
          // Ajoute imageDiv & ingredientsDiv au wrapper
          parentDiv.appendChild(imageDiv);

          const ingredientsInstructionsDiv = document.createElement("div")
          ingredientsInstructionsDiv.className = "ingredients-instruction"

          ingredientsInstructionsDiv.appendChild(ingredientsDiv);
          ingredientsInstructionsDiv.appendChild(instructionsElement);

          parentDiv.appendChild(ingredientsInstructionsDiv);

          // Ajoute la div parente au conteneur principal (wrapper)
          wrapper.appendChild(parentDiv);

















        /*data.recipes.forEach(function(oneImage){
          wrapper.innerHTML += ${oneImage.instructions}; */
          
      })
      .catch(error => {console.log("Erreur lors de la récup des données :", error);
    })
      })
    })
    .catch(error => {console.log("Erreur lors de la récup des données :", error);
  })
}

query.addEventListener('keypress', function(event) {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("button").click();
  }
}); 

button.addEventListener('click', function(){
    generate()
})


/*https://api.spoonacular.com/recipes/complexSearch?apiKey=8565a82cbb824636a7f9b75b960b1233&query=pasta&addRecipeInstructions=true&instructionsRequired=true*/
