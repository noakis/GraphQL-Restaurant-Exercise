var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");
const { realpath } = require("fs");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
    return restaurants.find((restaurant) => restaurant.id === arg.id);
    // Your code goes here
  },
  restaurants: () => {
    return restaurants;
    // Your code goes here
  },
  setrestaurant: ({ input }) => {
    const newRestaurant = {
      id: restaurants.length + 1,
      name: input.name,
      description: input.description,
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
    // Your code goes here
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    const restaurant = restaurants.find((restaurant) => restaurant.id === id);
    const ok = Boolean(restaurant);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurants = restaurants.filter((restaurant) => restaurant.id !== id);
    return { ok };
  },
  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    let selectedRestaurant = restaurants.find(
      (restaurant) => restaurant.id === id
    );
    if (!selectedRestaurant) throw new Error("restaurant doesn't exist");
    // edit the restaurant
    selectedRestaurant = { ...selectedRestaurant, ...restaurant };
    return selectedRestaurant;
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));
