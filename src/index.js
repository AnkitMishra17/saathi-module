const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const connection = require('./db/connection');

const sathi = require("./routes/sathi-program");

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

const viewsPath = path.join(__dirname, "/views");

app.set('view engine', 'ejs')
app.set("views", viewsPath)

app.use('/public',express.static(path.join(__dirname, "../public")));

// sathi-routes
app.use("/program/sathi/", sathi);

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

app.get('/sathiblogs/:title', (req,res) =>{
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