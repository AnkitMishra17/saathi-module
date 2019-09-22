const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

const viewsPath = path.join(__dirname, "/views");

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'opdemy'
  });
  
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  
    console.log('Connection Established');
  });  

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

app.get('/Our-blogs', (req,res) =>{
  const sql = 'SELECT * FROM sathi_blogs';
  connection.query(sql, function (error, results, fields) {
      if (error){
          throw error;
      }else{
        let id = new Array();
        let topics = new Array();
        let title = new Array();
        let content = new Array();
        let images = new Array();
        for(let i = 0; i < results.length; i++){
          id[i] = results[i].id;
          topics[i] = results[i].topic;
          title[i] = results[i].title;
          images[i] = results[i].image;
          content[i] = results[i].content;
          content[i] = content[i].toString();
        }
        res.render('sathiblogs',{id: id, topics: topics, title: title, images: images, content: content});
      }    
  });
});

app.get('/blogs/:title/', (req,res) =>{
  let id = req.query.id;
  const sql = 'SELECT * FROM sathi_blogs WHERE id = ?';
  connection.query(sql,[id], function (error, results, fields) {
    if (error){
        throw error;
    }else{
      let content = new Array();
      for(let i = 0; i < results.length; i++){
        content[i] = results[i].content;
        content[i] = content[i].toString();
      }
      res.render('blog',{results: results, content: content});
    }    
});
});

//add-blogs

app.get('/add-blogs', (req,res) =>{
  res.render('addblogs');
});

app.post('/add-blogs', (req,res) =>{
  let {topic, title, content} = req.body;
  
  content = content.replace(/\,/g,"@");
  content = content.replace(/\'/g,"$");
  content = content.replace(/\`/g,"#");
  content = content.replace(/\’/g,"^");

  
  if (!req.files)
  return res.status(400).send('No files were uploaded.');

  var file = req.files.image;
  var image = file.data.toString('base64');

    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){

      const sql = "INSERT INTO sathi_blogs (topic, title, image, content) VALUES ('"+ topic +"', '"+ title +"','"+ image +"' ,'"+ content +"')";
      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('/add-blogs');
      });
        } else {
          message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
          res.render('addblogs',{message: message});
        }
});

const server = app.listen(port, (req, res) => {
    console.log(`Server started at port ${port}..`)
  });


  // <% for(let i=0; i< topics.length; i++){ %>