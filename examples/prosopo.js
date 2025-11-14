const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY); 

solver.prosopo({
    pageurl: "https://mysite.com/page/with/prosopo",
    sitekey: "5DWvYfCSGqbUiQ..."
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);   
})