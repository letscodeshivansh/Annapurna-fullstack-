const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const { User } = require('./mongodb');  
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


require('dotenv').config();

const app = express();
const server = http.createServer(app);

const sessionMiddleware = session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000, 
  },
});

app.use(sessionMiddleware);


const parentDir = path.join(__dirname, '../');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(parentDir, 'templates'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(parentDir, 'public')));
app.use(express.static(path.join(parentDir, 'assets')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/aboutus', (req, res) => {
    res.render("aboutus");
});

app.get('/services', (req, res) => {
    res.render(ervice");
});

app.get('/map', (req, res) => {
    res.render("map");
});

app.get('/feed', (req, res) => {
    res.render("feed");
});


// app.get('/index', async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     const loggedInUsername = req.session.loggedInUsername; 
//     res.render('index', { tasks, loggedInUsername });
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).send('Error fetching tasks');
//   }
// });

app.get('/login', (req, res) => {
    res.render('login');
  });
app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username, password });
  
      if (!user) {
        return res.status(401).render('login', { error: 'Invalid username or password' });
      }
  
      req.session.loggedInUsername = username;
      res.redirect('/index');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in');
    }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});


app.post('/signup', [
  check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('signup', { error: errors.array()[0].msg });
  }

  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).render('signup', { error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    req.session.loggedInUsername = username;
    res.redirect('/index');
  } catch (error) {
    console.error(error);
    res.status(500).render('signup', { error: 'An error occurred during signup. Please try again.' });
  }
});


const port = 6969;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


