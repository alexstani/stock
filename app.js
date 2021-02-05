var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var app = express();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');

const stk = require('./stock/stockroute');
const lg = require('./routes/authRoutes');


mongoose.connect('mongodb+srv://alex:8870023970@cluster0-oeyng.mongodb.net/stock');
mongoose.connection.on('connected',()=>{
    console.log('connected to database mongo @27017');
});

mongoose.connection.on('error',(err)=>{
    if(err){
        console.log('error in database connection:'+err);
    }
}); 
const port = process.env.PORT ||3450;


app.use(cors());
app.use(cookieParser());
app.use(bodyparser.json());

app.use('/public', express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(stk);
app.use(lg);


app.get('/',(req,res,next)=>{
    res.send('foobar');
});


app.listen(port,()=>{
    console.log('server started at port:'+port);
});


