require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const db = require('./controller/mongo_db_contoller')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req,res) => {
  
  // console.log(req.body)
  let query = await db.db("test").collection('test').find({"original_url":req.body.url}).toArray();
  if (query.length != 0) {

    return res.status(400).send("The URL already exists and the URl is - " + query[0].short_url);
  }
  console.log(req.get('origin'));
  let short_url = Date.now();
  await db.db("test").collection("test").insertOne({
    "short_url": req.protocol + '://' + req.get('host') +"/api/shorturl/" + short_url,
    "original_url": req.body.url,
  })
  return res.status(200).send({
    "status":"Success",
    "data": req.protocol + '://' + req.get('host') +"/api/shorturl/"+short_url
  })
})

app.get('/api/shorturl/:shortner', async (req,res) => {
  let query = await db.db("test").collection("test").find({"short_url": req.protocol + '://' + req.get('host') +"/api/shorturl/" + req.params.shortner}).toArray()
  if (query.length == 0) {
    return res.status(400).send("Please shorten the link before requesitng");
  }
  return res.redirect(query[0].original_url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
