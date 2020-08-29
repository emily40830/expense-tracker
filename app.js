const express = require('express');

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./routes');
const session = require('express-session');
const flash = require('connect-flash');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('handlebars-helpers')();
require('./config/mongoose');
const userPassport = require('./config/passport');

const app = express();
const PORT = process.env.PORT;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //使用者每次發送request時，要不要去更新session
    saveUninitialized: true, //把未初始化的session初始化並建立
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: {
      equal: function (str1, str2) {
        return str1 === str2;
      },
      isExsit: function (str1) {
        return str1 != '';
      },
    },
  }),
);
app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.use(methodOverride('_method'));

userPassport(app);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.login_err_msg = req.flash('login_err_msg');
  res.locals.create_err = req.flash('create_err');
  return next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`Running on the localhost:${PORT} `);
});
