const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

;(async () => {
/**
 * Warning: Attention, the `challenge` value is not static but dynamic.
 * You need to find the queries that makes the captcha on the page to API.
 * Then you need to make request to this API and get new `challenge`.
 * 
 * For page https://2captcha.com/demo/geetest, api address is https://2captcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}
 * Also note that when make request to API, the request uses the dynamic parameter `t`
 * 
 * You can read more about sending GeeTest here https://2captcha.com/2captcha-api#solving_geetest, or here https://2captcha.com/p/geetest
 * In this example you can see how to solve GeeTest on the page https://2captcha.com/demo/geetest
 * 
 */ 
   
  const t = new Date().getTime()
  // below is a request to get a new `challenge`.
  const response = await fetch(`https://2captcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}`)
  const data = await response.json()

  const params = { 
    pageurl: 'https://2captcha.com/demo/geetest',
    gt: data.gt,
    challenge: data.challenge
  }

  const res = await solver.geetest(params)
  try {
      console.log(res)
    } catch (error) {
      console.error(error);
    }
})()