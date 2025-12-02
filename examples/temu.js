const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);
const fs = require('fs')
const bodyBase64 = fs.readFileSync("./examples/media/temu_main.png", "base64")
const part1Base64 = fs.readFileSync("./examples/media/temu_part1.png", "base64")
const part2Base64 = fs.readFileSync("./examples/media/temu_part2.png", "base64")
const part3Base64 = fs.readFileSync("./examples/media/temu_part3.png", "base64")

solver.temu({
    body: bodyBase64,
    part1: part1Base64,
    part2: part2Base64,
    part3: part3Base64
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
