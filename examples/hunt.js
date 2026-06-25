const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

// Step 1: get X-HD
solver.hunt({
    pageurl: "https://example.com/page-with-hunt",
    apiGetLib: "https://example.com/hd-api/external/apps/app-id/api.js",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
})
.then((res) => {
console.log(res.data); // X-HD
})
.catch((err) => {
console.log(err);
})

// Step 2: solve captcha with meta.token
solver.hunt({
    pageurl: "https://example.com/page-with-hunt",
    apiGetLib: "https://example.com/hd-api/external/apps/app-id/api.js",
    data: "META_TOKEN_VALUE",
    proxy: "login:password@1.2.3.4:8080",
    proxytype: "HTTP"
})
.then((res) => {
console.log(res.data); // solution token
})
.catch((err) => {
console.log(err);
})
