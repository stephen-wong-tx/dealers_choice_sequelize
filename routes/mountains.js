const db = require('../db');
const express = require('express');
app = express.Router();

app.use(express.static('public'));

const head = `
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Fourteeners</title>
    <link rel="stylesheet" href="./style.css" />
    <script src="https://kit.fontawesome.com/dc998fff98.js" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet">
  </head>
`;

const navBar = `
  <div id="nav">
  <ul id="sourceInfo">
    <li>Project by Stephen Wong at Full Stack Academy</li>
    <li style="float:right"><span>Data Source: <a href="https://www.14ers.com/" target="_blank">14ers.com</a></span></li>
  </ul>
  <ul>
    <li class="link" style="float:right"><a class="active" href="https://github.com/stephen-wong-tx/dealers_choice_js" target="_blank">About</a></li>
    <li id="icon"><a href="/"><img src="./fourteeners-home-alt.png" alt="The number 14 in front of a mountain range drawing"></a></li>
  </ul>
  </div>
`;

app.get('/', async(req, res, next) => {
  try{
    const ranges = await db.models.Range.findAll();
    res.send(ranges);
  }
  catch(error) {
    console.log(error);
    res.send(JSON.stringify(error));
  }
});

module.exports = app;