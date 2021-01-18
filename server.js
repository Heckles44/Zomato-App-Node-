const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));

const searchCity = async (req, res, next) => {
  const query = req.body.cityName;
  const apiKey = "93a6b94e44720afab279f89636f42cae";
  const url = `https://developers.zomato.com/api/v2.1/cities?q=${query}`;
  const headers = {
    "user-key": "93a6b94e44720afab279f89636f42cae",
  };

  try {
    const response = await axios.get(url, { headers });
    req.body.cityId = response.data.location_suggestions[0].id;
  } catch (e) {
    console.log(e);
  }

  next();
};

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/", searchCity, async (req, res) => {
  const headers = {
    "user-key": "93a6b94e44720afab279f89636f42cae",
  };

  const cityId = req.body.cityId;
  const url = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city`;

  try {
    const response = await axios.get(url, { headers });
    // restaurantsArray = response.data.restaurants;
    // restaurantsArray.forEach((restaurant) => {
    //   res.write(`<h5>${restaurant.restaurant.name}</h5>`);
    //   console.log(restaurant.restaurant.name);
    // });
    res.send(response.data.restaurants);
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
