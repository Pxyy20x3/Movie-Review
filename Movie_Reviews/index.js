const express = require("express");
var bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const axios = require("axios");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5500;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "your-secret-key",
        resave: true,
        saveUninitialized: true,
    })
);

const base_url = "http://localhost:3000";

app.get('/', (req, res) => {
    res.render('index.ejs', {
        loggedInUsername: req.session.loggedInUsername || ""
    });
});

app.get('/register', async (req, res) => {
    res.render('Register.ejs', {
        loggedInUsername: req.session.loggedInUsername || ""
    });
});

app.post("/registerPost", async (req, res) => {
    const data = req.body;

    try {
        const response = await axios.post(`${base_url}/registerPost`, data);

        if (response.status === 200) {
            res.render('login.ejs', {
                loggedInUsername: req.session.loggedInUsername || ""
            });
        } else if (response.status === 400) {
            return res.render('register.ejs', { alertMessage: response.data.error });
        } else {
            res.status(response.status).send(response.data);
        }

        console.log('Response Headers:', response.headers);
        console.log('Response Status:', response.status);
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:5500`);
})