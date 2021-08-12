const db = require('../db');
const express = require('express');
const router = express.Router();

router.use(express.static('public'));

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

router.get('/', async(req, res, next) => {
  try{
    const ranges = await db.models.Range.findAll( {include: db.models.Mountain});

    let html = `
    <!DOCTYPE html>
    <html lang="en">
      ${head}
      <body>
        ${navBar}
        <div id="main-content">
        <h1>The Fourtneeners</h1>
        <h2 style="font-size: .8rem">Sequelize & PostgreSQL Version</h2>
        <p class="description"> <strong>Fourteener</strong> fȯr-ˈtēn-ər<br /> A mountain peek with an elevation of at least 14,000 ft (4267 m).</p>
          <div id="entry-list">
            ${ranges.map( range => `
              <div class="entryContainer">
                <h2>${range["Name"]}</h2>
                <div id="button-${range.ID}" class="details-container"><a href="/mountains/${range.ID}">See details</a></div>
              </div>
            `).join("")}        
            
          </div>
        </div>
      </body>
    </html>
    `
    res.send(html);
  }
  catch(error) {
    console.log(error);
    res.send(JSON.stringify(error));
  }
});

router.get('/:range', async(req, res, next) => {
  try{
    const range = await db.models.Mountain.findAll(
      {
        where : {
          RangeID: req.params.range
        }
      }
    )
    let randomIdx = () => Math.floor(Math.random() * range.length);
    let sampleMountain = range[randomIdx()];

    const hero = `
    <div id="hero" style="background-image: url(${sampleMountain.photo})">
    <h1 class="h3">Range: ${sampleMountain["Mountain Range"].toUpperCase()}</h1>
    </div>
    `;

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      ${head}
      <body id="indiv-body">
        ${navBar}
        ${hero}
          <div id="entry-list">              
            ${range.map( mountain => `
              <div class="entryContainer ${mountain.Difficulty} ${mountain["Mountain Range"]}" id="range${mountain.ID}" difficulty="${mountain.Difficulty}" mountainRange="${mountain['Mountain Range']}">
                <h2>${mountain["Mountain Peak"]}</h2>
                <p>Range: ${mountain["Mountain Range"]}</p>
                <p>Elevation: ${mountain.Elevation_ft}</p>
                <div id="button-${mountain.ID}" class="details-container"><a href="/mountains/${mountain.RangeID}/${mountain.ID}">See details</a></div>
              </div>
            `).join("")}
          </div>
      </body>
    </html>
  `);
  }
  catch(error) {
    next(error);
  }
})

router.get('/:range/:id', async(req, res, next) => {
  try {
    const mountain = await db.models.Mountain.findOne(
      {
        where : {
          ID: req.params.id
        },
        include: db.models.RANGE
      }
    )

    const range = await db.models.Range.findOne(
      {
        where : {
          ID: mountain.rangeID
        },
        include: db.models.MOUNTAIN
      }
    )
    
    
    let head = `
      <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>The Fourteeners</title>
      <link rel="stylesheet" href="../style.css" />
      <script src="https://kit.fontawesome.com/dc998fff98.js" crossorigin="anonymous"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet">
      </head>
    `;

    let navBar = `
      <div id="nav">
        <ul id="sourceInfo">
          <li>Project by Stephen Wong at Full Stack Academy</li>
          <li style="float:right"><span>Data Source: <a href="https://www.14ers.com/" target="_blank">14ers.com</a></span></li>
        </ul>
        <ul>
          <li class="link" style="float:right"><a class="active" href="https://github.com/stephen-wong-tx/dealers_choice_js" target="_blank">About</a></li>
          <li id="icon"><a href="/"><img src=".././fourteeners-home-alt.png" alt="The number 14 in front of a mountain range drawing"></a></li>
        </ul>
      </div>
    `;
    
    const hero = `
      <div id="hero" style="background-image: url(${mountain.photo})">
      <h1 class="h3">${mountain["Mountain Peak"].toUpperCase()}</h1>
      </div>
    `;

    // NEW QUESTION FOR STANLEY: Helloo!! Question: On lines 181 to 185 I 'hard coded' the 'mountain' object key names. 
    // I tried mapping over Object.entries(mountain).map(......etc), but I ended up getting a lot of other JSON stuff. 
    // Is there a way to map over the object.entries and only get the key/value pairs as defined in the Model? 
    /* example: 
      Object.entries(mountain).map( ([key, value]) => `<p>${key}: ${value}</p>`) // instead of hard-coding "Elevation:", "Standard Route:", etc.?
    */

    // P.S. Thank you so much for all of your time and help with this!

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        ${head}
        <body id="indiv-body">
          ${navBar}
          ${hero}
            <div id="button-${mountain.ID}" class="details-container">
              <a id="indiv-link" href="/mountains/${req.params.range}"><span><i id="indiv-icon" class="fa fa-long-arrow-left" aria-hidden="true"></i> &nbsp; &nbsp; Go Back</span> </a>
            </div>
            <div id="entry-list">              
              <div class="entryContainer ${mountain.Difficulty} ${range.Name}" id="range${mountain.ID}" difficulty="${mountain.Difficulty}" mountainRange="${mountain['Mountain Range']}">
                <h2>${mountain["Mountain Peak"]}</h2>
                <p style="font-weight: bold">Range: ${range.Name}</p>
                <p>Elevation: ${mountain.Elevation_ft}</p>
                <p>Standard Route: ${mountain['Standard Route']}</p>
                <p>Elevation Gain: ${mountain['Elevation Gain_ft']}</p>
                <p>Difficulty: ${mountain.DifficultyDescription}</p>
              </div>
            </div>
        </body>
      </html>
    `);
  }
  catch (error) {
    next(error);
  }
})

router.get('/:range/:id/details', async(req, res, next) => {
  try {
    const mountain = await db.models.Mountain.findOne(
      {
        where : {
          ID: req.params.id
        },
        include: db.models.RANGE
      }
    )
    const range = await db.models.Range.findOne(
      {
        where : {
          ID: mountain.rangeID
        },
        include: db.models.MOUNTAIN
      }
    )
    
    mountainOutput = JSON.stringify(mountain);
    rangeOutput = JSON.stringify(range);

    res.send(`
      <html>
      ${mountainOutput}
      <br /> <br />
      ${rangeOutput}
      </html>
    `);
  }
  catch (error) {
    next(error);
  }
})

module.exports = router;

// P.P.S. I know there has been a lot of re-used assets and code from previous weeks' projects, 
// but 99% of the reused code was just for CSS and HTML.
// I just wanted to let you know that each week I have been starting these projects from scratch
// and haven't been taking the 'lazy route' ( see what i did there? #no-shame #dad-joke :D ) out by copying and pasting everything!!!