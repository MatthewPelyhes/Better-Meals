const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const session = require('express-session');
const methodOverride = require('method-override');
const SavedMeal = require('./models/savedMeal');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/better-meals', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret: 'dragonsarereal',
  resave: false,
  saveUninitialized: true,
  // Set up mongo store when ready to deploy!
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires in one week
    maxAge: 1000 * 60 * 60 * 24 * 7 // one week
  }

}
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session()); //Set up sessions! Sessions must come before this line!!!!
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/index', (req, res) => {
  res.render('meals/index')
})

app.get('/meals/search', (req, res) => {
  res.render('meals/search')
})

app.post('/meals/search', catchAsync(async (req, res, next) => {
  const savedMeal = new SavedMeal(req.body.savedMeal);
  await savedMeal.save();
  console.log(savedMeal);
}));

app.get('/meals/myMeals', catchAsync(async (req, res, next) => {
  const savedMeal = await SavedMeal.find({});

  res.render('meals/myMeals', { savedMeal })
}));

app.get('/meals/mealPlan', (req, res) => {
  res.render('meals/mealPlan')
})


app.get('/users/register', (req, res) => {
  res.render('users/register')
})

app.get('/users/login', (req, res) => {
  res.render('users/login')
})

app.use((err, req, res, next) => {
  res.send('Oh boy, something went wrong');
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})