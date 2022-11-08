const express = require('express');
const dotenv = require('dotenv');
const axios = require("axios");
const env = dotenv.config();
const app = express();
const port = 3000;

const cache = new Map();

/*app.get('/keys', (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.json(env.parsed);
});*/

app.get('/lastfm', async (req, res) => {

    let __START = new Date().getTime();

    res.set("Access-Control-Allow-Origin", "*");

    let { method, param, period, limit } = req.query;
    let now = new Date();
    let cacheKey = `${method}:${param}`;
    let existsCache = cache.get(cacheKey);

    let data;

    if(existsCache && (now.getTime() - existsCache.date.getTime()) <= 2 * 60 * 1000) {

        data = existsCache.data;

    } else {

        let url = `http://ws.audioscrobbler.com/2.0/?method=${method.trim()}&${param.trim()}&${period ? `period=${period}&` : 'period=overall'}${limit ? `&limit=${limit}` : 'limit=50'}&api_key=${process.env.LAST_FM_API_KEY}&format=json`;

        function call() {
            return new Promise(async (resolve, reject) => {
                let __RESPONSE = null;
                __RESPONSE = await axios({
                    url,
                    method: 'GET'
                }).catch((err) => {
                    console.log(err);

                    return resolve(call())
                });

                return resolve(__RESPONSE);
            });
        }

        let raw = await call();

        if(raw !== null && raw.data) {
            data = raw.data;

            cache.set(cacheKey, {date: new Date(), data: data });
        } else {
            data = undefined;
        }
    }

    let __END = new Date().getTime();

    console.log("Operation time response %d ms", __END - __START);
    
    return res.json(data);
}) 

app.listen(port, () => {
    console.log("Backend loaded and running!")
});