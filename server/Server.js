const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongo_db = require('./DB');
const path = require('path');
//const mongoose = require('mongoose');
//const MongoStore = require('connect-mongo');


app.set('views', __dirname + '/views/');
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine());
mongo_db();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
}));

app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, './views/css')));
app.use('/views', express.static(path.join(__dirname, './views/')));
app.use(session({
  name: "sid",
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
  },
  rolling: true,

}));

const secret_key = '@apple!banana#'
require('./router/main_router')(app, secret_key);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


