const express = require("express");
const morgan = require("morgan");
const PORT = 3001;
const fs = require('fs');

const app = express();
app.use(morgan('dev'));

//Middleware function to detect payloads from put requests and parse them
//This is for form data
app.use(express.urlencoded({ extended: false }));
//This is for json data
app.use(express.json());

// {
  // "recipes": [
    // {
      // "name": "scrambledEggs",
      // "ingredients": [
        // "1 tsp oil",
        // "2 eggs",
        // "salt"
      // ],
      // "instructions": [
        // "Beat eggs with salt",
        // "Heat oil in pan",
        // "Add eggs to pan when hot",
        // "Gather eggs into curds, remove when cooked",
        // "Salt to taste and enjoy"
      // ]
    // },
    // {
      // "name": "garlicPasta",
      // "ingredients": [
        // "500mL water",
        // "100g spaghetti",
        // "25mL olive oil",
        // "4 cloves garlic",
        // "Salt"
      // ],
      // "instructions": [
        // "Heat garlic in olive oil",
        // "Boil water in pot",
        // "Add pasta to boiling water",
        // "Remove pasta from water and mix with garlic olive oil",
        // "Salt to taste and enjoy"
      // ]
    // },
    // {
      // "name": "chai",
      // "ingredients": [
        // "400mL water",
        // "100mL milk",
        // "5g chai masala",
        // "2 tea bags or 20 g loose tea leaves"
      // ],
      // "instructions": [
        // "Heat water until 80 C",
        // "Add milk, heat until 80 C",
        // "Add tea leaves/tea bags, chai masala; mix and steep for 3-4 minutes",
        // "Remove mixture from heat; strain and enjoy"
      // ]
    // }
  // ]
// }

// let dataJSON = require('./data.json');

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

app.get('/recipes', (req, res) => {

  fs.readFile('./data.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const dataJSON = JSON.parse(data);

      let recipeNames = dataJSON.recipes.map((recipe) => {
        return recipe.name;
      })
      
      res.status(200).json({ recipesNames: recipeNames });
    }
  });
})


app.get('/recipes/details/:recipeName', (req, res) => {

  fs.readFile('./data.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const { recipeName } = req.params;
      const dataJSON = JSON.parse(data);
      let status = 200; 
      let body = {};
      let details = { 
        ingredients: [],
        numSteps: 0 
      };
    
      dataJSON.recipes.forEach((recipe, index) => {
        if (recipe.name === recipeName) {
          details.ingredients = recipe.ingredients; 
          details.numSteps = recipe.instructions.length;
          body = { details };
        }
      })
      res.status(status).json(body);
    }
  });
})

app.post('/recipes', (req, res) => {

  fs.readFile('./data.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const dataJSON = JSON.parse(data);
      let status = 201; 
      let newInfo = req.body;

      dataJSON.recipes.forEach((recipe) => {
        if (recipe.name === newInfo.name) {
          body = { "error": "Recipe already exists" };
          status = 400;
          res.status(status).json(body);
        }
      });

      if (status !== 400) {
        dataJSON.recipes.push(newInfo);
        fs.writeFile('./data.json', JSON.stringify(dataJSON, null, 2), (err) => {
          if (err) {
            console.log(err);
          } else {
            res.status(status).end();
          }
        });
      }
    }
  });


  // const update = {
  //   "name": "butteredBagel", 
  //     "ingredients": [
  //       "1 bagel", 
  //       "butter"
  //     ], 
  //   "instructions": [
  //     "cut the bagel", 
  //     "spread butter on bagel"
  //   ] 
  // } 

  // const updateString = JSON.stringify(update);


  // dataJSON.recipes.push(req.body);

  // console.log(dataJSON);


  // console.log("REQ BODY:", req.body);

  // fs.writeFileSync('./data.json', JSON.stringify(dataJSON));



  // res.send(dataJSON)
});

app.put('/recipes', (req, res) => {
  const newInfo = req.body;
  let status = 404; 
  let body = { "error": "Recipe does not exist" };

  console.log("NEW INFO!!!:", newInfo);
  // const newInfoName = req.body

  dataJSON.recipes.forEach((recipe, index) => {

    // console.log(recipe.name);
    if (recipe.name === newInfo.name) {
      // console.log(recipe.name, index);
      dataJSON.recipes[index] = newInfo;
      body = dataJSON;
      status = 200;
    }
  })



  // fs.writeFileSync('./data.json', JSON.stringify(dataJSON));
  
  
  res.status(status).send(body);


})


