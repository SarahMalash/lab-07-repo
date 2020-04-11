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
app.get('/trial', trialHandler);


