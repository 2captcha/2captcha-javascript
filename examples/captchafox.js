const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const proxy = process.env.proxy
const proxytype = process.env.proxytype
const solver = new TwoCaptcha.Solver(APIKEY);

solver.captchaFox({
    pageurl: "https://mysite.com/page/with/captchafox",
    sitekey: "sk_ILKWN...",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    proxy: "login:password@1.2.3.4:8888",
    proxytype: "HTTP"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})