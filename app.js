var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')
var mongojs = require('mongojs');
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1/customerapp');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
// var expressValidator('express-validator');
db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${location}[${param}]: ${msg}`;
};

app.use(function (req, res, next) {
  res.locals.errors = null;
  next();
});

// app.use(expressValidator({}));

app.get('/',function(req, res){
   db.users.find(function (err, docs){
     console.log(docs);
     res.render('index', {
       title: 'Customers',
       users: docs
     });
   });
});
app.post('/users/add', [
    check('f_name').isLength({ min: 3 }),
    check('l_name').isLength({ min: 3 })
], function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.mapped() });
        return res.render('index', {
          title: 'Customers',
          users: users,
          errors:  errors.mapped()
        });
    } else {
      console.log(req.body.f_name);
      var newUser = {
          f_name: req.body.f_name,
          l_name: req.body.l_name,
          email: req.body.email
      }
      db.users.insert(newUser, function(err,result){
        if(err){
          console.log(err);
        }
        console.log(result);
        res.redirect('/');
      })
      console.log(newUser);
    }
  }
);

app.delete('/users/delete/:id',function(req, res) {
    db.users.remove({_id: ObjectId(req.params.id) },function(err, result){
      if(err){
        console.log(err);
      }
      res.redirect('/');
    });

});

app.listen(3000, function(){
  console.log('Server started on Port 3000 ...')
});
