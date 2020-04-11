'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');//it will act as a browser to get data
const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.listen(PORT, ()=>{
  console.log('listening from port ', PORT);// read server data when accssed from port 3000
});
app.get('/', (request, response) => {
  response.send('Home Page!');
});
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trials', trialHandler);



function locationHandler(request, response) {
  const city = request.query.city;
  getLocation(city)
    .then(locationData=> response.status(200).json(locationData));
}

function getLocation(city) {

  let key = process.env.LOCATION_API_KEY;//retrieve the key
  const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  return superagent.get(url)//get the json from an actual api not a static json, return the whole output of superagent to getLocation
    .then(geoData =>{//where the data recived from the url will be saved
      const locationData = new Location(city, geoData.body);//using superagent everything will be stored inside body
      return locationData;//the data returned here will be stored in superagent
    });
}
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}
function weatherHandler(request, response) {
  const city = request.query.search_query;
  getWeather(city)
    .then (weatherData => response.status(200).json(weatherData));
}
const weatherSummaries = [];

function getWeather(city) {
  let key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  return superagent.get(url)
    .then(weatherData => {
      weatherData.body.data.forEach(val => {
        var weatherData = new Weather(val);
        weatherSummaries.push(weatherData);
      });
      return weatherSummaries;
    });
}
function Weather(day) {
  this.forecast = day.weather.description;
  this.time = day.valid_date;
}





function trialHandler(request, response) {
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  getTrial(lat,lon)
    .then (trialData => response.status(200).json(trialData));
}
const arr1 = [];
function getTrial(lat,lon) {
  let key = process.env.TRAIL_API_KEY;
  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;
  return superagent.get(url)
    .then(trialData => {
      trialData.body.trails.forEach(val => {
        var trialData = new Ttrial(val);
        arr1.push(trialData);
      });
      return arr1;
      //return trialData.body;
    });
}
function Ttrial(data) {
  this.name= data.name;
  this.location= data.location;
  this.length = data.length;
  this.stars = data.stars;
  this.starVotes= data.starVotes;
  this.summary= data.summary;
  this.trail_url= data.url;
  this.conditions= data.conditionDetails;
  this.condition_date= data.conditionDate.substring(0,11);
  this.condition_time = data.conditionDate.substring(11);
}
