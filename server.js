const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
const multer = require('multer');
let last = 0;
mongoose.connect('mongodb://localhost:27017/wishlist', {useUnifiedTopology: true});

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('images'));

imageSchema = new mongoose.Schema({
    imageDescription: String,
    image:String,
    wish: String
});

imageModel = mongoose.model('Image', imageSchema);

//setting multer

let upload = multer({
    storage: multer.diskStorage({
        destination:(req, file, cb) => {
            cb(null, './images');
        
        },
        filename: function(req, file, cb){
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
})



app.get('/', (req, res)=>{
    imageModel.find()
    .then(document => {
        console.log(document);
        res.render('gallery', {item:document});
    })
});
app.get('/random', (req, res)=>{
    let array = [];
    imageModel.find()
    .then(document => {
        array = document;
        let ran =0;
        do {
           ran = Math.floor(Math.random() * document.length);
        } while (last == ran);
        last = ran;
        let document2 = {
            image:"",
            imageDescription:"",
            wish:""
        };
        document2.image = document[ran].image;
        document2.imageDescription = document[ran].imageDescription;
        document2.wish = document[ran].wish;
      
        res.render('random', {item:document2});
    })
});



app.get('/admin', (req, res)=>{
    res.render('index');
});

app.post('/upload', upload.single('userFile'), (req, res)=>{
    console.log(req.file);

    let newImage = new imageModel();
    newImage.imageDescription = req.body.description;
    newImage.image = req.file.filename;
    newImage.wish = req.body.wish;
    newImage.save((error, document) => {
        if(!error){
            console.log('file saved');
            res.redirect('/');
        } else{
            console.log(error);
        }
    });
})



const port = 5000;

app.listen(port, ()=> {
    console.log(`Server is running on Port ${port}.`);
});