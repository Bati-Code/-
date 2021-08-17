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

const secret_key = '@apple!banana#';
// app.use('*', (req, res, next) => {
//     console.log(req.originalUrl);

//     if (req.originalUrl == '/login') {
//         console.log("pass");
//         return next();
//     }
//     else {
//         let token = req.header('authorization');
//         if (token) {
//             try {

//                 jwt.verify(token, secret_key, (err, decoded) => {
//                     if (err) {
//                         console.log("token verify error");
//                         token_check = false;
//                         next();
//                     }
//                     else {
//                         console.log(moment(), "token checked");
//                         //console.log(decoded);
//                         token_check = true;
//                         next();
//                     }
//                 });
//             } catch (error) {
//                 console.log("catch token error", error);
//                 token_check = false;
//                 return;
//             }

//         } else {
//             console.log("token is not exist")
//             token_check = false;
//             return;
//         }
//     }
// })

const memberRouter = require('./router/member_router')(secret_key);
const boardRouter = require('./router/board_router')(secret_key);
const financeRouter = require('./router/finance_router')(secret_key);

app.use('/', memberRouter);
app.use('/board', boardRouter);
app.use('/finance', financeRouter);
//require('./router/main_router')(app, secret_key);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


