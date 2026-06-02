const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.yidun({
    pageurl: "https://mysite.com/page/with/yidun",
    sitekey: "your_site_key",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    yidunGetLib: "https://cstaticdun.126.net/load.min.js",
    yidunApiServerSubdomain: "cstaticdun.126.net",
    challenge: "12345678abc90123d4567ef8a9012345",
    hcg: "your_hcg_value",
    hct: 1234567890,
    proxy: "login:password@1.2.3.4:8888",
    proxytype: "HTTP"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
