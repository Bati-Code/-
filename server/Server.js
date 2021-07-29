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
  credentials: true
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, './views/css')));
app.use('/views', express.static(path.join(__dirname, './views/')));
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge: 60000 * 10},
  rolling: true
}));

require('./router/main_router')(app);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


