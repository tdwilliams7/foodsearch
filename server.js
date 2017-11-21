var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoURI = 'mongodb://admin:fakepass@ds115436.mlab.com:15436/savedrecipes';
var methodOverride = require('method-override');
mongoose.connection.openUri(mongoURI);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

var Recipe = mongoose.model('Recipe', {
    uri: String,
    name: String,
    image: String,
    url: String,
    source: String
});

app.get('/myrecipes', (req, res)=>{
    Recipe.find( (err, recipes) =>{
        if (err)
            return console.log(err);
        res.json(recipes);
    });
});

app.post('/myrecipes', (req, res) =>{
    console.log(req);
    Recipe.create({
        'uri': req.body.uri,
        'name': req.body.label,
        'image': req.body.image,
        'url': req.body.url,
        'source': req.body.source
    }, (err, recipe) =>{
        if (err)
            res.send(err);
        Recipe.find( (err, recipes) =>{
            if (err)
                res.send(err);
            res.json(recipes);
        });
    });
});

app.delete('/myrecipes/:id', (req, res) => {
    Recipe.remove({
        _id: req.params.id
    }, function(err, recipe){
        if (err)
            return console.log(err);
        Recipe.find( (err, recipes) =>{
            if (err)
                return console.log(err);
            res.json(recipes);
        });
    });
});

app.listen(process.env.PORT || 5000);
console.log('listening on port 5000');
