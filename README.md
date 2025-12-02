<a href="https://github.com/2captcha/2captcha-python"><img src="https://github.com/user-attachments/assets/37e1d860-033b-4cf3-a158-468fc6b4debc" width="82" height="30"></a>
<a href="https://github.com/2captcha/2captcha-javascript"><img src="https://github.com/user-attachments/assets/371b271e-33c3-4217-af21-b95517a4677c" width="36" height="30"></a>
<a href="https://github.com/2captcha/2captcha-go"><img src="https://github.com/user-attachments/assets/ab22182e-6cb2-41fa-91f4-d5e89c6d7c6f" width="63" height="30"></a>
<a href="https://github.com/2captcha/2captcha-ruby"><img src="https://github.com/user-attachments/assets/0270d56f-79b0-4c95-9b09-4de89579914b" width="75" height="30"></a>
<a href="https://github.com/2captcha/2captcha-cpp"><img src="https://github.com/user-attachments/assets/36de8512-acfd-44fb-bb1f-b7c793a3f926" width="45" height="30"></a>
<a href="https://github.com/2captcha/2captcha-php"><img src="https://github.com/user-attachments/assets/e8797843-3f61-4fa9-a155-ab0b21fb3858" width="52" height="30"></a>
<a href="https://github.com/2captcha/2captcha-java"><img src="https://github.com/user-attachments/assets/a3d923f6-4fec-4c07-ac50-e20da6370911" width="50" height="30"></a>
<a href="https://github.com/2captcha/2captcha-csharp"><img src="https://github.com/user-attachments/assets/f4d449de-780b-49ed-bb0a-b70c82ec4b32" width="38" height="30"></a>

# JavaScript module for 2Captcha API (captcha solver)

The easiest way to quickly integrate the [2Captcha] captcha-solving service into your code and automate the solving of any type of captcha.
Examples of API requests for different captcha types are available on the [JavaScript captcha solver] page.

- [JavaScript module for 2Captcha API (captcha solver)](#javascript-module-for-2captcha-api-captcha-solver)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [TwoCaptcha instance options](#twocaptcha-instance-options)
  - [Solve captcha](#solve-captcha)
    - [Image Captcha](#image-captcha)
    - [reCAPTCHA v2](#recaptcha-v2)
    - [reCAPTCHA v3](#recaptcha-v3)
    - [FunCaptcha](#funcaptcha)
    - [GeeTest](#geetest-captcha)
    - [GeeTest V4](#geetest-v4-captcha)
    - [Yandex Smart Captcha](#yandex-smart-captcha)
    - [Lemin Cropped Captcha](#lemin-cropped-captcha)
    - [Cloudflare Turnstile](#cloudflare-turnstile)
    - [Amazon WAF](#amazon-waf)
    - [Capy](#capy)
    - [ClickCaptcha](#clickcaptcha)
    - [DataDome CAPTCHA](#datadome-captcha)
    - [CyberSiARA](#cybersiara)
    - [MTCaptcha](#mtcaptcha)
    - [Friendly Captcha](#friendly-captcha)
    - [Bounding Box Method](#bounding-box-method)
    - [Grid](#grid)
    - [Text Captcha](#text-captcha)
    - [Canvas](#canvas)
    - [Rotate](#rotate)
    - [KeyCaptcha](#keycaptcha)
    - [Cutcaptcha](#cutcaptcha)
    - [Tencent](#tencent)
    - [atbCAPTCHA](#atbcaptcha)
    - [Prosopo](#prosopo)
    - [CaptchaFox](#captchafox)
    - [Audio Captcha](#audio-captcha)
  - [Other methods](#other-methods)
    - [goodReport](#goodreport)
    - [badReport](#badreport)
    - [balance](#balance)
  - [Proxies](#proxies)
  - [Examples](#examples)
  - [Examples using Puppeteer](#examples-using-puppeteer)
- [Useful articles](#useful-articles)
- [Get in touch](#get-in-touch)
- [Join the team 👪](#join-the-team-)
- [License](#license)
  - [Graphics and Trademarks](#graphics-and-trademarks)


## Installation
This package can be installed with NPM:

```sh
npm install @2captcha/captcha-solver
```
or Yarn:
```sh
yarn add @2captcha/captcha-solver
```

## Configuration

TwoCaptcha instance can be created like this:

```js
const TwoCaptcha = require("@2captcha/captcha-solver")
const solver = new TwoCaptcha.Solver("<Your 2captcha api key>")
```

Also, there are a few options that can be configured:

```javascript
const apiKey = 'YOUR_API_KEY'
const pollingInterval = 10

const solver = new TwoCaptcha.Solver(apiKey, pollingInterval)
```
### TwoCaptcha instance options

| Option           | Default value  | Description                                                                                  |
| ---------------- | -------------- | -------------------------------------------------------------------------------------------- |
| apiKey           | -              | Your API key                                                                                 |
| pollingInterval  | 5000           | Interval in milliseconds between requests to the `res.php` API endpoint. Setting values less than 5 seconds is not recommended |

## Solve captcha

When you submit any image-based captcha use can provide additional options to help 2captcha workers to solve it properly.

### Captcha options

| Option        | Default Value | Description                                                                                        |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| numeric       | 0             | Defines if the captcha contains numeric or other symbols [see more info in the API docs][post options] |
| min_len       | 0             | minimal answer length                                                                              |
| max_len       | 0             | maximum answer length                                                                              |
| phrase        | 0             | defines if the answer contains multiple words or not                                               |
| regsense      | 0             | defines if the answer is case sensitive                                                            |
| calc          | 0             | defines captcha requires calculation                                                               |
| lang          | -             | defines the captcha language; see the [list of supported languages]                                |
| textinstructions| -           | hint or task text shown to workers with the captcha                                                |

Below you can find basic examples for every captcha type, check out the code below.

### Image captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_normal_captcha)</sup>

To bypass a normal captcha (distorted text on an image) use the following method. This method can also be used to recognize any text in an image.

```js
const imageBase64 = fs.readFileSync("./examples/media/imageCaptcha_6e584.png", "base64")

solver.imageCaptcha({
    body: imageBase64,
    numeric: 4,
    min_len: 5,
    max_len: 5
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### reCAPTCHA V2

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_recaptchav2_new)</sup>

Use the following method to solve reCAPTCHA V2 and obtain a token to bypass the protection.

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

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_recaptchav3)</sup>

This method provides a reCAPTCHA V3 solver and returns a token.

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

### FunCaptcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_funcaptcha_new)</sup>

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

### GeeTest Captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_geetest)</sup>

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

<sup>[API method description.](https://2captcha.com/2captcha-api#geetest-v4)</sup>

Use this method to solve GeeTest v4. Returns the response in JSON.

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

### Lemin Cropped Captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#lemin)</sup>

Use this method to solve Lemin and obtain a token to bypass the protection.

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

<sup>[API method description.](https://2captcha.com/2captcha-api#turnstile)</sup>

Use this method to solve Cloudflare Turnstile. Returns JSON with the token.

Turnstile captcha has two types, one of them is Cloudflare Turnstile Challenge page. For Turnstile Challenge page cases, we have a [demo](https://github.com/2captcha/cloudflare-demo). Try this [demo](https://github.com/2captcha/cloudflare-demo) if you need to solve Cloudflare Turnstile Challenge page captcha.

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

### Amazon WAF

<sup>[API method description.](https://2captcha.com/2captcha-api#amazon-waf)</sup>

Use this method to solve Amazon WAF Captcha also known as AWS WAF Captcha is a part of Intelligent threat mitigation for Amazon AWS. Returns JSON with the token.

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

### Capy

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_capy)</sup>

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

<sup>[API method description.](https://2captcha.com/2captcha-api#datadome)</sup>

Use this method to solve DataDome and obtain a token to bypass the protection. 

> [!IMPORTANT]  
> To solve the DataDome captcha, you must use a proxy. It is recommended to use [residential proxies][Buy residential proxies].

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

<sup>[API method description.](https://2captcha.com/2captcha-api#cybersiara)</sup>

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

<sup>[API method description.](https://2captcha.com/2captcha-api#mtcaptcha)</sup>

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

<sup>[API method description.](https://2captcha.com/2captcha-api#friendly-captcha)</sup>

Use this method to solve Friendly Captcha and obtain a token to bypass the protection.

> [!IMPORTANT]  
> To successfully use the received token, the captcha widget must not be loaded on the page. To do this, you need to abort request to `/friendlycaptcha/...module.min.js` on the page. When the captcha widget is already loaded on the page, there is a high probability that the received token will not work.

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

### ClickCaptcha

<sup>[API method description.](https://2captcha.com/2captcha-api#coordinates)</sup>

The ClickCaptcha method returns the coordinates of points on the captcha image. It can be used if you need to click on particular points in the image.

```js
const imageBase64 = fs.readFileSync("./tests/media/coordinates.jpg", "base64")

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

### Bounding Box Method

<sup>[API method description.](https://2captcha.com/2captcha-api#bounding_box)</sup>


Use Bounding Box Method when you need to select objects on the image. To do this, you need to pass the markup instructions and image for markup. The instructions can be sent as text or as an image encoded in `base64` format. 
> [!IMPORTANT]  
> You must to send instruction `imginstructions` or `textinstructions`.

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

### Grid

<sup>[API method description.](https://2captcha.com/2captcha-api#grid)</sup>

This method allows to solve any captcha where image can be divided into equal parts like reCAPTCHA V2. A grid is applied above the image. And you receive the numbers clicked boxes.

> [!IMPORTANT]  
> You must to send instruction `imginstructions` or `textinstructions`.

```js
solver.grid({ 
  body: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR4AAACwCAIAAAB...",
  textinstructions: "Select cars in the image"
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Text Captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_text_captcha)</sup>

This method can be used to bypass a captcha that requires answering a question provided in clear text.

```js
solver.textCaptcha({
  textcaptcha: "If tomorrow is Saturday, what day is today?",
  lang: 'en'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Canvas

<sup>[API method description.](https://2captcha.com/2captcha-api#canvas)</sup>

The canvas method can be used when you need to draw a line around an object on an image. Returns a set of points' coordinates to draw a polygon.

```js
solver.canvas({
    body: 'iVBORw0KGgoAAAANSgAAAcIA...',
    imginstructions: '/9j/4AAQSkZJRgABAQEA...',
    textinstructions: 'Highlight the red CIRCLE'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Rotate

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_rotatecaptcha)</sup>

This method can be used to solve a captcha that asks to rotate an object. It is mostly used to bypass FunCaptcha. Returns the rotation angle.

```js
solver.rotate({
  body: imageBase64,
  textinstructions: "Rotate the object to the correct position"
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### KeyCaptcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_keycaptcha)</sup>

Token-based method to solve KeyCaptcha.

```js
solver.keyCaptcha({
    pageurl: "https://2captcha.com/demo/keycaptcha",
    userId: '184015',
    sessionId: '0917788cad24ad3a69813c4fcd556061',
    webServerSign: '02f7f9669f1269595c4c69bcd4a3c52e',
    webServerSign2: 'd888700f6f324ec0f32b44c32c50bde1'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Cutcaptcha

<sup>[API method description.](https://2captcha.com/2captcha-api#cutcaptcha)</sup>

Use this method to solve Cutcaptcha. Returns the response in JSON.

```js
solver.cutCaptcha({
    pageurl: "https://mysite.com/page/with/cutcaptcha",
    misery_key: "098e6a849af406142e3150dbf4e6d0538db2b51f", 
    api_key: "SAs61IAI",
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### Tencent

<sup>[API method description.](https://2captcha.com/2captcha-api#tencent)</sup>

Use this method to solve Tencent captcha. Returns the response in JSON.

```js
solver.tencent({
    pageurl: "https://mysite.com/page/with/tencent",
    appId: "189956587"  
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### atbCAPTCHA

<sup>[API method description.](https://2captcha.com/2captcha-api#atb-captcha)</sup>

Use this method to solve atbCAPTCHA challenge. Returns a token to bypass the captcha.

```js
solver.atbCaptcha({
    pageurl: "https://mysite.com/page/with/atbCAPTCHA",
    appId: "af25e409b33d722a95e56a230ff8771c",
    apiServer: "https://cap.aisecurius.com"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### Prosopo

<sup>[API method description.](http://2captcha.com/2captcha-api#prosopo-procaptcha)</sup>

Use this method to solve Prosopo and obtain a token to bypass the protection.

```js
solver.prosopo({
    pageurl: "https://mysite.com/page/with/prosopo",
    sitekey: "5DWvYfCSGqbUiQ..."
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### CaptchaFox

<sup>[API method description.](https://2captcha.com/2captcha-api#captchafox)</sup>

Use this method to solve CaptchaFox and obtain a token to bypass the protection. 

> [!IMPORTANT]  
> To solve the CaptchaFox, you must use a proxy. It is recommended to use [residential proxies][Buy residential proxies].

```js
solver.captchaFox({
    pageurl: "https://mysite.com/page/with/captchafox",
    sitekey: "sk_ILKWN...",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit...",
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

### Audio Captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#audio-recognition)</sup>

Use the following method to bypass an audio captcha (`mp3` formats only). You must provide the language as `lang = 'en'`. Supported languages are "en", "ru", "de", "el", "pt", "fr".

```js
solver.audio({
  body: "SUQzBAAAAAAAHFRTU0UAAAA...",
  lang: "en"
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

## Other methods

### goodReport

<sup>[API method description.](https://2captcha.com/2captcha-api#reporting-answers)</sup>

Use this method to report good captcha answer.

```js
solver.goodReport('7031846604')
```

### badReport 

<sup>[API method description.](https://2captcha.com/2captcha-api#reporting-answers)</sup>

Use this method to report bad captcha answer.

```js
solver.badReport('7031854546')
```

### balance 

<sup>[API method description.](https://2captcha.com/2captcha-api#additional-methods)</sup>

Use this method to get your account's balance.

```js
solver.balance()
.then((res) => {
    console.log(res)
})
```

## Proxies

You can pass your proxy as an additional argument for methods: recaptcha, funcaptcha, geetest, geetest v4, keycaptcha, capy puzzle, lemin, turnstile, amazon waf, DataDome, CyberSiARA, MTCaptcha, Friendly Captcha and etc. The proxy will be forwarded to the API to solve the captcha.

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
## Examples

Examples of solving all supported captcha types are located in the [examples] directory.

## Examples using Puppeteer
Also we have a separate repositories you can find examples of solving captcha using Puppeteer.
At the moment we have implemented examples of bypassing Cloudflare Challenge page and reCAPTCHA.
Links: 
- [Cloudflare Bypassing Demo using Puppeteer](https://github.com/2captcha/cloudflare-demo)
- [Solving reCAPTCHA V2 using Puppeteer and clicks](https://github.com/2captcha/puppeteer-recaptcha-solver-using-clicks)
- [Custom Slider Captcha Demo](https://github.com/2captcha/custom-slider-demo)


## Useful articles
* [How to bypass captcha using JavaScript](https://2captcha.com/blog/how-to-use-javascript-to-bypass-captcha#how-to-solve-and-bypass-a-captcha-with-javascript-using-npm-package-2captchacaptcha-solver)
* [Bypassing Cloudflare Challenge with Puppeteer and 2Captcha](https://2captcha.com/blog/bypassing-cloudflare-challenge-with-puppeteer-and-2captcha)
* [How to bypass Geetest v4 CAPTCHA](https://2captcha.com/blog/geetest-v4-support)
* [Automatic reCAPTCHA V3 resolution - a tutorial for developers and customers](https://2captcha.com/blog/recaptcha-v3-automatic-resolution)

## Get in touch

<a href="mailto:support@2captcha.com"><img src="https://github.com/user-attachments/assets/539df209-7c85-4fa5-84b4-fc22ab93fac7" width="80" height="30"></a>
<a href="https://2captcha.com/support/tickets/new"><img src="https://github.com/user-attachments/assets/be044db5-2e67-46c6-8c81-04b78bd99650" width="81" height="30"></a>

## Join the team 👪

There are many ways to contribute, of which development is only one! Find your next job. Open positions: AI experts, scrapers, developers, technical support, and much more! 😍

<a href="mailto:job@2captcha.com"><img src="https://github.com/user-attachments/assets/36d23ef5-7866-4841-8e17-261cc8a4e033" width="80" height="30"></a>

## License

The code in this repository is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

### Graphics and Trademarks

The graphics and trademarks included in this repository are not covered by the MIT License. Please contact <a href="mailto:support@2captcha.com">support</a> for permissions regarding the use of these materials.

<!-- Shared links -->
[2Captcha]: https://2captcha.com/
[JavaScript captcha solver]: https://2captcha.com/lang/javascript
[post options]: https://2captcha.com/2captcha-api#normal_post
[list of supported languages]: https://2captcha.com/2captcha-api#language
[Buy residential proxies]: https://2captcha.com/proxy/residential-proxies
[Quick start]: https://2captcha.com/proxy?openAddTrafficModal=true
[examples]: ./examples
