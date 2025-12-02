const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const proxy = process.env.proxy
const proxytype = process.env.proxytype
const solver = new TwoCaptcha.Solver(APIKEY);

solver.vkcaptcha({
    redirect_uri: "https://id.vk.com/not_robot_captcha?domain=vk.com&session_token=eyJhbGciOiJBM...",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
    proxy: "login:password@1.2.3.4:8888",
    proxytype: "HTTP"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})