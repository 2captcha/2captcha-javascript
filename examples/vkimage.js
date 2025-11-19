const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);
const fs = require('fs')
const imageBase64 = fs.readFileSync("./examples/media/vkimage.jpeg", "base64")

solver.vkimage({
  body: imageBase64,
  steps: "[5,19,4,3,23,8,20,4,18,10,6,10,5,12,13,18,9,14,9,15,12,19,3,12,14,22,5,2,13,16,5,17,23,21,23,9,3,2,10,20,21,7,17,0,19,2,19,6,22,10,4,20,13,6,12,20,2,23,13,2,3,11,18,3,21,1,22,9,21,12,9,22,13,2,23,23,3,15,20,18,13,18,16,4,6,7,15,12,7,15,3,6,21,9,7,21,2,6,21,2]",
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})