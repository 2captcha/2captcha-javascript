<b>[English](README.md)</b> (recommended) | [中国语文科](README.zh.md) | [Русский](README.ru.md)


# CAPTCHA solving module for 2Captcha API

## Description
A wrapper around the [2Captcha](https://2captcha.com/) API. This wrapper supports any captcha bypass: reCAPTCHA V2, reCAPTCHA V3, hCaptcha, Arkose Labs FunCaptcha, image captcha, Coordinates (Click Captcha), GeeTest, GeeTest V4, Yandex Smart Captcha, Lemin Captcha, Amazon WAF, Cloudflare Turnstile, Capy Puzzle, DataDome CAPTCHA, CyberSiARA, MTCaptcha, Friendly Captcha. 

Also added support for the `bounding_box` method. The Bounding Box Method allows you to mark data on the image. This method can be used to mark up datasets or highlight any objects in an image according to the given instructions. Read more about using *Bounding Box Method* on [documentation](https://2captcha.com/2captcha-api#bounding_box).

[2Captcha](https://2captcha.com/) is a service that solves many different types of CAPTCHAs, this library serves as a wrapper around 2Captcha's API to bring easy, promise-based functionality to Node. This library specializes in concurrent solves, and Bulk API usage.

- [Install](#install)
- [Configuration](#configuration)
- [Solve captcha](#solve-captcha)
  - [reCAPTCHA v2](#recaptcha-v2)
  - [reCAPTCHA v3](#recaptcha-v3)
  - [hCaptcha](#hcaptcha)
  - [Arkose Labs FunCaptcha](#arkose-labs-funcaptcha)
  - [Image CAPTCHAs](#image-captcha) (`base64` format)
  - [GeeTest](#geetest-captcha)
  - [GeeTest V4](#geetest-v4-captcha)
  - [Yandex Smart Captcha](#yandex-smart-captcha)
  - [Lemin Cropped Captcha](#lemin-captcha)
  - [Cloudflare Turnstile](#cloudflare-turnstile)
  - [Amazon WAF](#amazon-waf-captcha)
  - [Capy Puzzle](#capy-puzzle)
  - [Coordinates (Click Captcha)](#coordinates-captcha)
  - [DataDome CAPTCHA](#datadome-captcha)
  - [CyberSiARA](#cybersiara)
  - [MTCaptcha](#mtcaptcha)
  - [Friendly Captcha](#friendly-captcha)
  - [Bounding Box method](#bounding-box-method)
  - [Usage of proxy](#usage-of-proxy)
- [Other methods](#other-methods)
  - [badReport](#badreport)
  - [goodReport](#goodreport)
  - [balance](#balance)
- [Proxies](#proxies)
- [Useful articles](#useful-articles)
  - [How to bypass GeeTest v4 CAPTCHA](https://2captcha.com/blog/geetest-v4-support)
  - [Automatic reCAPTCHA V3 resolution - a tutorial for developers and customers](https://2captcha.com/blog/recaptcha-v3-automatic-resolution)
  - Finding Sitekey <a href="./docs/hcaptcha.md">hCaptcha</a>


## Install

```sh
npm install @2captcha/captcha-solver
```
or
```sh
yarn add @2captcha/captcha-solver
```

## Configuration

Instance can be created like this:

```js
const Captcha = require("@2captcha/captcha-solver")
const solver = new Captcha.Solver("<Your 2Captcha API key>")
```

## Solve captcha

### reCAPTCHA V2

Use this method to solve reCAPTCHA V2 and obtain a token to bypass the protection.

```js
solver.recaptcha({
  pageurl: 'https://2captcha.com/demo/recaptcha-v2',
  googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### reCAPTCHA V3

This method provides reCAPTCHA V3 solver and returns a token.

```js
solver.recaptcha({
    pageurl: 'https://2captcha.com/demo/recaptcha-v3',
    googlekey: '6Lcyqq8oAAAAAJE7eVJ3aZp_hnJcI6LgGdYD8lge',
    version: "v3",
    min_score: "0.4",
    action: 'demo_action'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```


### hCaptcha

Use this method to solve hCaptcha challenge. Returns a token to bypass captcha.

```js
solver.hcaptcha({
  pageurl: "https://2captcha.com/demo/hcaptcha?difficulty=moderate",
  sitekey: "b76cd927-d266-4cfb-a328-3b03ae07ded6"
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Arkose Labs FunCaptcha

FunCaptcha (Arkoselabs) solving method. Returns a token.

```js
solver.funCaptcha({
  pageurl: "https://funcaptcha.com/tile-game-lite-mode/fc/api/nojs/?pkey=804380F4-6844-FFA1-ED4E-5877CA1F1EA4&lang=en",
  publickey: "804380F4-6844-FFA1-ED4E-5877CA1F1EA4"
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Image CAPTCHA

To bypass a normal captcha (distorted text on image) use this method. This method also can be used to recognize any text on the image.

```js
// Read from a file as base64 text
const imageBase64 = fs.readFileSync("./tests/media/imageCaptcha_6e584.png", "base64")

solver.imageCaptcha({
    body: imageBase64,
    numeric: 4,
    min_len: 5,
    max_len: 5
})
.then((res) => {
  // Logs the image text
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```


### GeeTest Captcha

Method to solve GeeTest puzzle captcha. Returns a set of tokens as JSON.

```js
// Read more about `challenge` on the page https://2captcha.com/p/geetest
solver.geetest({ 
  pageurl: 'https://2captcha.com/demo/geetest',
  gt: '81388ea1fc187e0c335c0a8907ff2625',
  challenge: '<you need to get a new challenge value each time>'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### GeeTest V4 Captcha

Method to solve GeeTest V4 puzzle captcha. Returns a set of tokens as JSON.

```js
solver.geetestV4({
  pageurl: 'https://2captcha.com/demo/geetest-v4',
  captcha_id: 'e392e1d7fd421dc63325744d5a2b9c73'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Yandex Smart Captcha

Use this method to solve Yandex Smart Captcha and obtain a token to bypass the protection.

```js
solver.yandexSmart({ 
  pageurl: "https://captcha-api.yandex.ru/demo",
  sitekey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxjtNB9"
 })
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Lemin Captcha

Use this method to solve Lemin CAPTCHAs and obtain a token to bypass the protection.

```js
solver.lemin({
  pageurl:'https://2captcha.com/demo/lemin', 
  captcha_id: 'CROPPED_3dfdd5c_d1872b526b794d83ba3b365eb15a200b',
  div_id: 'lemin-cropped-captcha',
  api_server: 'api.leminnow.com'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Cloudflare Turnstile

Use this method to solve Turnstile and obtain a token to bypass the protection.

```js
solver.cloudflareTurnstile({
    pageurl: "https://app.nodecraft.com/login",
    sitekey: "0x4AAAAAAAAkg0s3VIOD10y4"    
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

<h3 id="amazon-waf-captcha">Amazon WAF Captcha (AWS WAF):</h3>

Use this method to solve AmazonWaf and obtain a token to bypass the protection.

```js
//INFO: The `context` value is dynamic, it is necessary to take the actual value from the page each time.
solver.amazonWaf({
  pageurl: "https://non-existent-example.execute-api.us-east-1.amazonaws.com/latest",
  sitekey: "AQIDAHjcYu/GjX+QlghicBgQ/7bFaQZ+m5FKCMDnO+vTbNg96AHMDLodoefdvyOnsHMRt...",
  context: "9BUgmlm48F92WUoqv97a49ZuEJJ50TCk9MVr3C7WMtQ0X6flVbufM4n8mjFLmbLVAPgaQ...",
  iv: "CgAHbCe2GgAAAAAj",
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Capy Puzzle

Token-based method to bypass Capy puzzle captcha.

```js
solver.capyPuzzle({
    pageurl: "https://www.capy.me/account/register/",
    captchakey: "PUZZLE_Cme4hZLjuZRMYC3uh14C52D3uNms5w"
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### DataDome CAPTCHA

Use this method to solve DataDome and obtain a token to bypass the protection. 

> [!IMPORTANT]  
> To solve the DataDome captcha, you must use a proxy. It is recommended to use mobile residential proxies.

```js
solver.dataDome({
    pageurl: "https://rendezvousparis.hermes.com/client/register",
    captcha_url: "https://geo.captcha-delivery.com/captcha/?initialCid=AHrlqAAAAAMAEuQtkf4k1c0ABZhYZA%3D%3D&hash=789361B674144528D0B7EE76B35826&cid=mY4z7GNmh7Nt1lAFwpbNHAOcWPhyPgjHD2K1Pm~Od1iEKYLUnK3t7N2ZGUj8OqDK65cnwJHtHwd~t902vlwpSBA5l4ZHbS1Qszv~jEuEUJNQ_jMAjar2Kj3kq20MRJYh&t=fe&referer=https%3A%2F%2Frendezvousparis.hermes.com%2Fclient%2Fregister&s=40119&e=67fef144ac1a54dbd7507776367d2f9d5e36ec3add17fa22f3cb881db8385838",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    proxy: "login:password@1.2.3.4:8888", // The (Username : Password @ Address : Port) of our chosen proxy
    proxytype: "http" // The 'Type' of proxy, http, https, socks, ect.
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### CyberSiARA

Use this method to solve CyberSiARA and obtain a token to bypass the protection.

```js
solver.cyberSiARA({
    pageurl: "https://www.cybersiara.com/book-a-demo",
    master_url_id: "OXR2LVNvCuXykkZbB8KZIfh162sNT8S2",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### MTCaptcha

Use this method to solve MTCaptcha and obtain a token to bypass the protection.

```js
solver.mtCaptcha({
    pageurl: "https://service.mtcaptcha.com/mtcv1/demo/index.html",
    sitekey: "MTPublic-DemoKey9M"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### Friendly Captcha

Use this method to solve Friendly Captcha and obtain a token to bypass the protection.
> **Important:** To successfully use the received token, the captcha widget must not be loaded on the page. To do this, you need to abort request to `/friendlycaptcha/...module.min.js` on the page. When the captcha widget is already loaded on the page, there is a high probability that the received token will not work.

```js
solver.friendlyCaptcha({
    pageurl: "https://geizhals.de/?liftban=1&from=/455973138?fsean=5901747021356",
    sitekey: "FCMST5VUMCBOCGQ9"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

<h3 id="coordinates-captcha">Coordinates (Click Captcha):</h3>

ClickCaptcha method returns coordinates of points on captcha image. Can be used if you need to click on particular points on the image.

```js
const imageBase64 = fs.readFileSync("./tests/media/hCaptchaImage.jpg", "base64")

solver.coordinates({
    body: imageBase64,
    textinstructions: 'Select all photos containing the boat'
 })
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Bounding Box Method:

Bounding Box Method allows you to select objects specified in the image. To do this, you need to pass markup instructions. The instructions can be sent as text or as an image encoded in `base64` format. It is mandatory to pass at least one instruction `imginstructions` or `textinstructions`.

```js
solver.boundingBox({ 
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR4AAACwCAIAAAB...",
  textinstructions: "Circle all the cars in the image.",
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Usage of proxy

Solving reCAPTCHA V2 whis a proxy, code example:

```js
solver.recaptcha({
  pageurl: 'https://2captcha.com/demo/recaptcha-v2',
  googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u',
  proxy: "login:password@1.2.3.4:8888", // The (Username : Password @ Address : Port) of our chosen proxy
  proxytype: "http" // The 'Type' of proxy, http, https, socks4, socks5.
})
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.error(err.message)
})
```

## Other methods

### goodReport

Use this method to report good captcha answer.

```js
solver.goodReport('7031846604')
```

### badReport 

Use this method to report bad captcha answer.

```js
solver.badReport('7031854546')
```

### balance 

Use this method to get your account's balance

```js
solver.balance()
.then((res) => {
    console.log(res)
})
```

## Proxies

You can pass your proxy as an additional argument for methods: recaptcha, funcaptcha, geetest, geetest v4, hcaptcha, keycaptcha, capy puzzle, lemin, turnstile, amazon waf, DataDome, CyberSiARA, MTCaptcha, Friendly Captcha and etc. The proxy will be forwarded to the API to solve the captcha.

We have our own proxies that we can offer you. [Buy residential proxies] for avoid restrictions and blocks. [Quick start].

Solving reCAPTCHA V2 using proxy:
```js
solver.recaptcha({
    pageurl: 'https://2captcha.com/demo/recaptcha-v2',
    googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u',
    proxy: 'HTTPS',
    proxytype: 'login:password@123.123.123.123:3128'
})
```


## Useful articles
* [How to bypass Geetest v4 CAPTCHA](https://2captcha.com/blog/geetest-v4-support)
* [Automatic reCAPTCHA V3 resolution - a tutorial for developers and customers](https://2captcha.com/blog/recaptcha-v3-automatic-resolution)
* Finding Sitekey <a href="./docs/hcaptcha.md">hCaptcha</a>

<!-- Shared links -->
[Buy residential proxies]: https://2captcha.com/proxy/residential-proxies
[Quick start]: https://2captcha.com/proxy?openAddTrafficModal=true