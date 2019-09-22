const express = require('express');
const connection = require('../db/connection');

const router = express.Router();

router.get('/Our-blogs', (req,res) =>{  
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


module.exports = router;