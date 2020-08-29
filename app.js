const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./routes');
require('handlebars-helpers')();
require('./config/mongoose');

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
app.use(routes);

app.listen(PORT, () => {
  console.log(`Running on the localhost:${PORT} `);
});
