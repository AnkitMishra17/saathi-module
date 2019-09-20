const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const viewsPath = path.join(__dirname, "/views");

app.set('view engine', 'ejs')
app.set("views", viewsPath)

app.use('/public',express.static(path.join(__dirname, "../public")));

app.get('/', (req,res) =>{
          res.render('index');
});
app.get('/anxiety', (req,res) =>{
  res.render('anxiety');
});

app.get('/counselling', (req,res) =>{
  res.render('counselling');
});

app.get('/stress', (req,res) =>{
  res.render('stress');
});

app.get('/depression', (req,res) =>{
  res.render('depression');
});

app.get('/addiction', (req,res) =>{
  res.render('addiction');
});

const server = app.listen(port, (req, res) => {
    console.log(`Server started at port ${port}..`)
  });