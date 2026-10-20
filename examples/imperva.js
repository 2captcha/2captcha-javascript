const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.imperva({
    pageurl: "https://micropact.co.henry.ga.us/MagistrateCourtsCMWS/",
    incapsulaScriptUrl: "/_Incapsula_Resource?SWJIYLWA=719d34d31c8e3a6e6fffd425f7e032f3",
    incapsulaCookies: "visid_incap_2705870=vgmigpy2QGOqNJZc8KM/jo8d12oAAAAAQUIPAAAAAABqX D/H/MsR3nFhvJcxDlO; incap_ses_1021_2705870=yu3CZ8I9KyLXl1KCJ1IrDo8d12oAAAAAt/QGabcviDNe9aI4O/eiDg==",
    // reese84UrlEndpoint: "https://example.com/_Incapsula_Resource?reese84=1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    proxy: "ub6900fef552505bc-zone-custom-region-ca-session-jUrtu0yco-sessTime-120:ubbT@eu.proxy.2captcha.com:2334",
    proxytype: "HTTP"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
