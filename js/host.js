const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");



// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, './assets');

const viewsPath = path.join(__dirname, '../HTMLfiles');

// Setup static directory to ser
app.use(express.static(publicDirectoryPath));

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDirectoryPath, { maxAge: 0 }));


// Routes
app.get("/", (req, res) => {
    res.render("index");s
});

app.get("/main", (req, res) => {
    res.render("main");
});

app.listen(3002, () => {
    console.log("Server is running on port 3002");
});
