const express = require("express");
const morgan = require("morgan");
const PORT = 3001;
const fs = require('fs');

const app = express();
app.use(morgan('dev'));

const dataJSON = require('./data.json');

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);

});

app.get('/recipes', (req, res) => {
  let recipeNames = dataJSON.recipes.map((recipe) => {
    return recipe.name;
  })  
  res.json({ recipesNames: recipeNames } );
})

app.get('/recipes/details/:recipeName', (req, res) => {

  const { recipeName } = req.params;

  let details = { 
    ingredients: [],
    numSteps: 0 
  }

  dataJSON.recipes.forEach((recipe, index) => {
    if (recipe.name === recipeName) {
      details.ingredients = recipe.ingredients; 
      details.numSteps = recipe.instructions.length
    }
  })

  res.status(200).json({details});
})

app.post('/recipes', function (req, res) {


  const update = {
    "name": "butteredBagel", 
      "ingredients": [
        "1 bagel", 
        "butter"
      ], 
    "instructions": [
      "cut the bagel", 
      "spread butter on bagel"
    ] 
  } 

  const updateString = JSON.stringify(update);

  fs.writeFile('./data.json', updateString);




  res.send('Got a POST request')
})


