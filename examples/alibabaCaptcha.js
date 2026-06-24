const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.alibaba({
    pageurl: "https://www.example.com",
    sceneId: "abc123xyz4",
    prefix: "dlw3kug",
    user_id: "Abc123Def456Ghi789Jkl012Mno345Pqr678Stu901=",
    user_user_id: "Xyz987Abc654Def321Ghi098Jkl765Mno432Pqr109=",
    verifyType: "1.0",
    region: "sgp",
    userCertifyId: "abc123def456ghi789jkl012mno345pq",
    apiGetLib: "https://o.example.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js?t=2041",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    proxy: "login:password@1.2.3.4:8080",
    proxytype: "HTTP"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
