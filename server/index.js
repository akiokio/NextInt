require('dotenv').config();
const fs = require('fs');
const join = require('path').join;
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const compression = require('compression');
const mongoose = require('mongoose');
const MongoStore = connectMongo(session);
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const flash = require('connect-flash');

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;
// Bootstrap models
const models = join(__dirname, 'models');
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => { require(join(models, file)) });

const routes = require('./routes');
const strategies = require('./strategies');
const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}

// MongoDB Connection
mongoose.connect(process.env.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});

app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// CookieParser should be above session
app.use(cookieParser());
app.use(cookieSession({ secret: '1KxJ2gX4OR' }));
app.use(session({
  secret: '1KxJYgXHOR',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions'
  }),
}))

// use passport session
app.use(passport.initialize());
app.use(passport.session());
// Flash messages
app.use(flash());

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Routes
app.use(routes);

app.listen(port, function (err) {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`NextInt app listening on port ${port}!`);
  console.log(`App url: http://localhost:${port}!`);
});
