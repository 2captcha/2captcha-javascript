const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.basilisk({
    pageurl: "https://example.com/login",
    sitekey: "b7890h...19fb2600897",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    proxy: "login:password@1.2.3.4:8080",
    proxytype: "HTTP"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
