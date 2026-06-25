const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.tspd({
    pageurl: "https://example.com/login",
    tspdCookie: "TS386a400d029=082670...010245; TS386a400d078=082670...dbb3b0c",
    htmlPageBase64: "PCFET0NUWVBFIGh0bWw+...",
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
