const express = require('express');
const dotenv = require('dotenv');
const env = dotenv.config();
const app = express();
const port = 3000;


app.get('/keys', (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.json(env.parsed);
});

app.listen(port, () => {
    console.log("Backend loaded and running!")
});