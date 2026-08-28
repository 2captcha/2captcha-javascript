const fs = require('fs');
const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY;
const solver = new TwoCaptcha.Solver(APIKEY);

const backgroundBase64 = fs.readFileSync("./media/drag_drop_main.jpeg", "base64")
const imagesBase64 = [
    fs.readFileSync("./media/drag_drop_image1.jpeg", "base64"),
    fs.readFileSync("./media/drag_drop_image2.jpeg", "base64")
]

solver.dragAndDrop({
    body: backgroundBase64,
    images: imagesBase64,
    textinstructions: "Drag the images to proper position"
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
