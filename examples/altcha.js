const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.altcha({
    pageurl: "https://mysite.com/page/with/altcha",
    challenge_url: "https://example/altcha",
    challenge_json: '{"algorithm":"SHA-256","challenge":"a4c9d8e7f1b23a6c...",..."signature":"7b3e2a9d5c8f1046e2d91c3a..."}'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
