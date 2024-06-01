import  getProviderData  from "./providers/providers"
import fetch from "../utils/fetch"
import { APIError } from "./2captchaError"
import * as utils from "../utils/generic"
import { softId } from "./constants/constants"
import checkCaptchaParams from "../utils/checkCaptchaParams"
import { paramsRecaptcha, paramsHCaptcha, paramsGeetest, paramsGeeTestV4, yandexSmart, paramsImageCaptcha, paramsFunCapthca, paramsLemin, paramsAmazonWAF, paramsTurnstile, paramsCoordinates, paramsCapyPuzzle, paramsDataDome, paramsCyberSiARA, paramsMTCaptcha, friendlyCaptcha, paramsBoundingBox } from "./2captcha"

const provider = getProviderData ()

/**
 * An object containing properties of the captcha solution.
 * @typedef {Object} CaptchaAnswer
 * @param {string} data The solution to the captcha
 * @param {string} id The captcha ID
 */
interface CaptchaAnswer {
  /** The solution to the captcha */
  data: string,
  /** The ID of the captcha solve */
  id: string
}

/**
* The main 2captcha class, housing all API calls and api interactions.
* 
*/
export class Solver {
  public _apikey: string
  public _pollingFrequency: number
  public _headerACAO: number;

  /**
   * The constructor for the 2captcha Solver class.
   * 
   * @param {string} apikey The API key to use
   * @param {number} pollingFrequency The frequency to poll for requests
   * 
   */
  constructor(apikey: string, pollingFrequency: number = 5000, enableACAO: boolean = true) {
      this._apikey = apikey
      this._pollingFrequency = pollingFrequency
      this._headerACAO = enableACAO ? 1 : 0

  }

  /** The API key this instance is using */
  public get apikey() { return this._apikey }
  /** Frequency the instance polls for updates */
  public get pollingFrequency() { return this._pollingFrequency }
  /** Set the API key for this instance */
  public set apikey(update: string) { this._apikey = update }

  private get in() { return provider.in }
  private get res() { return provider.res}
  private get defaultPayload() { return { key: this.apikey, json: 1, header_acao: this._headerACAO, soft_id: softId } }

  /**
   * Returns the remaining account balance.
   * 
   * @return {Promise<Number>} Remaining balance
   * @throws APIError
   * @example
   * solver.balance()
   * .then((res) => {
   *   console.log(res)
   * })
   */
  public async balance(): Promise<number> {
      const res = await fetch(this.res + utils.objectToURI({
          ...this.defaultPayload,
          action: "getbalance"
      }))
      const result = await res.text()

      try {
          const data = JSON.parse(result)
          if (data.status == 1) {
              return parseFloat(data.request)
          }
          throw new APIError(data.request)
      } catch {
          throw new APIError(result)
      }
  }

  /**
   * @private
   * 
   * Polls for  a captcha, finding out if it's been completed
   * @param {string} id Captcha ID
   * 
   * @returns {Promise<CaptchaAnswer>}
   * @throws APIError
   */
  private async pollResponse(id: string): Promise<CaptchaAnswer> {
      const payload = {
          ...this.defaultPayload,
          action: "get",
          id: id
      }

      await utils.sleep(this.pollingFrequency)

      const res = await fetch(this.res + utils.objectToURI(payload))
      const result = await res.text()

      let data;
      try {
          data = JSON.parse(result)
          if (data.status == 1) {
              return { data: data.request, id: id }
          }
      } catch {
          throw new APIError(result)
      }
      switch (data.request) {
          case "CAPCHA_NOT_READY": 
              // console.log('CAPCHA_NOT_READY')
              return this.pollResponse(id);
          default: {
              throw new APIError(data.request)
          }
      }
  }

   /**
   * ### Solves a google reCAPTCHA V2 | V3. 
   * 
   * [Read more about other reCAPTCHA parameters](https://2captcha.com/2captcha-api#solving_recaptchav2_new).
   * 
   * @param {{pageurl, googlekey, cookies, proxy, proxytype, userAgent, invisible, datas, pingback, action, enterprise, min_score, version, domain}} params Object
   * @param {string} params.pageurl The URL the captcha appears on.
   * @param {string} params.googlekey Value of `k` or `data-sitekey` parameter you found on page.
   * @param {string} params.cookies Your cookies that will be passed to our worker who solve the captha.
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128`. You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`. 
   * @param {string} params.userAgent Your `userAgent` that will be passed to our worker and used to solve the captcha. 
   * @param {number} params.invisible `1` - means that reCAPTCHA is invisible. `0` - normal reCAPTCHA.  
   * @param {string} params.datas Value of `data-s` parameter you found on page. Curenttly applicable for Google Search and other Google services.
   * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.action Value of `action` parameter you found on page.
   * @param {string} params.enterprise `1` - defines that you're sending reCAPTCHA Enterpise.
   * @param {number} params.min_score The score needed for resolution reCAPTCHA V3. Currently it's almost impossible to get token with score higher than `0.3`
   * @param {string} params.version `v2` — defines that you're sending a reCAPTCHA V2. `v3` — defines that you're sending a reCAPTCHA V3.
   * @param {string} params.domain Domain used to load the captcha: `google.com` or `recaptcha.net`
   * 
   * @returns {Promise<CaptchaAnswer>} The result from the solve.
   * @throws APIError
   * @example
   * solver.recaptcha({
   *   pageurl: 'https://2captcha.com/demo/recaptcha-v2',
   *   googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u'
   * })
   * .then((res) => {
   *     console.log(res);
   * })
   * .catch((err) => {
   *     console.log(err);
   * })
   */
  public async recaptcha(params: paramsRecaptcha): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "userrecaptcha")
      const payload = {
          ...params,
          method: "userrecaptcha",
          ...this.defaultPayload
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   * Solves a hCaptcha, returning the result as a string.
   * 
   * [Read more about other hCaptcha parameters](https://2captcha.com/2captcha-api#solving_hcaptcha).
   * 
   * @param {{sitekey, pageurl, data, userAgent, invisible, pingback, proxy, proxytype, domain}} params Object
   * @param {string} params.sitekey The hcaptcha site key. Value of `k` or `data-sitekey` parameter you found on page.
   * @param {string} params.pageurl The URL the captcha appears on.
   * @param {string} params.data Custom `data` that is used in some implementations of hCaptcha, mostly with `invisible=1`. In most cases you see it as `rqdata` inside network requests. IMPORTANT: you MUST provide `userAgent` if you submit captcha with `data` paramater. The value should match the User-Agent you use when interacting with the target website.
   * @param {string} params.userAgent Your userAgent that will be passed to our worker and used to solve the captcha. Required for hCaptcha with `data` parameter.
   * @param {number} params.invisible Use `1` for invisible version of hcaptcha. Currently it is a very rare case.
   * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. More info [here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * @param {string} params.domain Domain used to load the captcha: `hcaptcha.com` or `js.hcaptcha.com`
   * 
   * @returns {Promise<CaptchaAnswer>} The result from the solve
   * @throws APIError
   * @example
   * solver.hcaptcha({
   *   pageurl: "https://2captcha.com/demo/hcaptcha",
   *   sitekey: "b76cd927-d266-4cfb-a328-3b03ae07ded6"
   * .then((res) => {
   *     console.log(res);
   * })
   * .catch((err) => {
   *     console.log(err);
   * })
   */
  public async hcaptcha(params: paramsHCaptcha): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "hcaptcha")
      const payload = {
          ...params,
          method: "hcaptcha",
          ...this.defaultPayload
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   * Solves a GeeTest Captcha. [Read more about parameters and solving for Geetest captcha](https://2captcha.com/2captcha-api#solving_geetest).
   * 
   * @param {{ gt, challenge, api_server, offline, new_captcha,
   *  pageurl, pingback, proxy, proxytype, userAgent }} params
   * @param {string} params.gt Value of gt parameter found on site
   * @param {string} params.challenge Value of challenge parameter found on site
   * @param {string} params.pageurl The URL the captcha appears on
   * @param {string} params.api_server The URL of the api_server (recommended)
   * @param {number} params.offline In rare cases `initGeetest` can be called with `offline` parameter on the target page. If the call uses offline: true, set the value to `1`.
   * @param {number} params.new_captcha In rare cases `initGeetest` can be called with `new_captcha` parameter. If the call uses `new_captcha: true`, set the value to `1`. Mostly used with offline parameter.
   * @param {string} params.pingback URL for `pingback` (callback) response that will be sent when captcha is solved. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128`. You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * @param {string} params.userAgent Your `userAgent` that will be passed to our worker and used to solve the captcha.
   * 
   * @returns {Promise<CaptchaAnswer>} The result from the solve.
   * @throws APIError
   * @example
   * ;(async () => {
   *      
   *  // Warning: Attention, the `challenge` value is not static but dynamic.
   *  // You need to find the queries that makes the captcha on the page to API.
   *  // Then you need to make request to this API and get new `challenge`.
   *  
   *  // For page https://rucaptcha.com/demo/geetest, api address is https://rucaptcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}
   *  // Also note that when make request to API, the request uses the dynamic parameter `t`
   *  
   *  // You can read more about sending GeeTest here https://2captcha.com/2captcha-api#solving_geetest, or here https://2captcha.com/p/geetest
   *  // In this example I solve GeeTest from page https://2captcha.com/demo/geetest
   *  
   *  const t = new Date().getTime()
   *  // below i make a request to get a new `challenge`. 
   *  const response = await fetch(`https://2captcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}`)
   *  const data = await response.json()
   *
   *  const params = { 
   *      pageurl: 'https://rucaptcha.com/demo/geetest',
   *      gt: data.gt,
   *      challenge: data.challenge
   *  }
   *
   *  const res = await solver.geetest(params)
   *  try {
   *      console.log(res)
   *      } catch (error) {
   *      console.error(error);
   *      }
   *  })()
   */
   public async geetest(params: paramsGeetest): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "geetest")
      const payload = {
          ...params,
          method: "geetest",
          ...this.defaultPayload
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   * ### Solves a GeeTest V4 Captcha.
   * 
   * 
   * This method accepts an object with the following fields: `pageurl`, `captcha_id`, `pingback`, `proxy`, `proxytype`, `userAgent`.
   * The `pageurl` and `captcha_id` fields are required.
   * 
   * @param {{pageurl, captcha_id, pingback, proxy, proxytype, userAgent}} params The method geetestV4 takes arguments as an object.
   * @param {string} params.pageurl Full URL of the page where you see Geetest V4 captcha.
   * @param {string} params.captcha_id Required parameter. Value of `captcha_id` parameter you found on target website.
   * @param {string} params.pingback An optional param. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy An optional param. Format: `login:password@123.123.123.123:3128`. You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype An optional param. Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * @param {string} params.userAgent An optional param. Your `userAgent` that will be passed to our worker and used to solve the captcha.
   * 
   * @returns {Promise<CaptchaAnswer>} The result from the solve.
   * @throws APIError
   * @example
   * solver.geetestV4({    
   *    pageurl: 'https://2captcha.com/demo/geetest-v4',
   *    captcha_id: 'e392e1d7fd421dc63325744d5a2b9c73'
   * })
   * .then((res) => {
   *   console.log(res)
   * })
   * .catch((err) => {
   *   console.log(err);
   * })
   */
    public async geetestV4(params: paramsGeeTestV4): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "geetest_v4")
      const payload = {
          ...params,
          method: "geetest_v4",
          ...this.defaultPayload
      }
  
      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()
  
      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }
  
      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   * Method for sending Yandex Smart Captcha.
   * This method accepts an object with the following fields: `pageurl`, `sitekey`, `pingback`, `proxy`, `proxytype`.
   * The `pageurl` and `sitekey` fields are required.
   * 
   * @param {{pageurl, sitekey, pingback, proxy, proxytype, userAgent}} params The method takes arguments as an object.
   * @param {string} params.pageurl Required parameter. URL of the page where the captcha is located.
   * @param {string} params.sitekey Required parameter. The `sitekey` value you found on the captcha page.
   * @param {string} params.pingback An optional param.
   * @param {string} params.proxy An optional param. Format: `login:password@123.123.123.123:3128`.
   * @param {string} params.proxytype An optional param. Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * @param {string} params.userAgent An optional param. Your `userAgent` that will be passed to our worker and used to solve the captcha.
   * 
   * @returns {Promise<CaptchaAnswer>} The result from the solve.
   * @throws APIError
   * @example
   * solver.yandexSmart({ 
   *   pageurl: "https://captcha-api.yandex.ru/demo",
   *   sitekey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxjtNB9"
   * })
   * .then((res) => {
   *   console.log(res)
   * })
   * .catch((err) => {
   *   console.log(err);
   * })
   */
  public async yandexSmart(params: yandexSmart): Promise<CaptchaAnswer> {
  checkCaptchaParams(params, "yandex")
  const payload = {
      ...params,
      method: "yandex",
      ...this.defaultPayload
  }

  const response = await fetch(this.in + utils.objectToURI(payload))
  const result = await response.text()

  let data;
  try {
      data = JSON.parse(result)
  } catch {
      throw new APIError(result)
  }

  if (data.status == 1) {
      return this.pollResponse(data.request)
  } else {
      throw new APIError(data.request)
  }
}

  /**
   * Solves a image-based captcha. [Read more about parameters for image captcha](https://2captcha.com/2captcha-api#solving_normal_captcha).
   * 
   * @param {{ body,
   *           phrase,
   *           regsense,
   *           numeric,
   *           calc,
   *           min_len,
   *           max_len,
   *           language,
   *           lang,
   *           textinstructions,
   *           pingback }} params Extra properties to pass to 2captcha.
   * @param {number} params.body Base64 image data for the captcha.
   * @param {number} params.phrase Captcha contains two or more words? `1` - Yes. `0` - No.
   * @param {number} params.regsense Captcha is case sensitive? `1` - Yes. `0` - No.
   * @param {number} params.numeric `0` - not specified. `1` - captcha contains only numbers. `2` - captcha contains only letters. `3` - captcha contains only numbers OR only letters. `4` - captcha MUST contain both numbers AND letters.
   * @param {number} params.calc  Does captcha require calculations? (e.g. type the result 4 + 8 = ) `1` - Yes. `0` - No.
   * @param {number} params.min_len `1..20` - minimal number of symbols in captcha. `0` - not specified.
   * @param {number} params.max_len `1..20` - maximal number of symbols in captcha. `0` - not specified.
   * @param {number} params.language `0` - not specified. `1` - Cyrillic captcha. `2` - Latin captcha
   * @param {string} params.lang Language code. [See the list of supported languages](https://2captcha.com/2captcha-api#language).
   * @param {string} params.textinstructions Text will be shown to worker to help him to solve the captcha correctly. For example: type red symbols only.
   * @param {string} params.pingback URL for `pingback` (callback) response that will be sent when captcha is solved. [More info here](https://2captcha.com/2captcha-api#pingback).
   * 
   * @returns {Promise<CaptchaAnswer>} The result from the solve
   * @throws APIError
   * @example
   * const imageBase64 = fs.readFileSync("./tests/media/imageCaptcha_6e584.png", "base64")
   * 
   *  solver.imageCaptcha({
   *      body: imageBase64,
   *      numeric: 4,
   *      min_len: 5,
   *      max_len: 5
   *  })
   * .then((res) => {
   *     console.log(res);
   * })
   * .catch((err) => {
   *     console.log(err);
   * })
   */
  public async imageCaptcha( params: paramsImageCaptcha ): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "base64")

      const payload = {
          ...params,
          ...this.defaultPayload,
          method: "base64"
      }
      const URL = this.in
      const response = await fetch(URL, {
          body: JSON.stringify( payload ),
          method: "post",
          headers: {'Content-Type': 'application/json'}
      })
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   * ### Solves Arkose Labs FunCaptcha.
   * 
   * [Read more](https://2captcha.com/2captcha-api#solving_funcaptcha_new) about other solving and other parameters for Arkose Labs FunCaptcha.
   * 
   * @param {{pageurl, publicKey, surl, data, pingback, proxy, proxytype, userAgent}} params Object
   * @param {string} params.publicKey The FunCaptcha Public Key
   * @param {string} params.pageurl The URL to the website the captcha is seen on
   * @param {string} params.surl The FunCaptcha Service URL (recommended)
   * @param {string} params.data Custom data to pass to FunCaptcha. For example: `'data': '{"blob": "foo"}'`.
   * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * @param {string} params.userAgent Your `userAgent` that will be passed to our worker and used to solve the captcha.
   * 
   * @returns {Promise<CaptchaAnswer>} The result from the solve
   * @throws APIError
   * 
   * @example
   *  solver.funCaptcha({
   *    pageurl: "https://funcaptcha.com/tile-game-lite-mode/fc/api/nojs/?pkey=804380F4-6844-FFA1-ED4E-5877CA1F1EA4&lang=en",
   *    publickey: "804380F4-6844-FFA1-ED4E-5877CA1F1EA4"
   *  })
   *  .then((res) => {
   *      console.log(res);
   *  })
   *  .catch((err) => {
   *      console.log(err);
   *  })
   */
  public async funCaptcha(params: paramsFunCapthca): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "funcaptcha")
      const payload = {
          ...params,
          method: "funcaptcha",
          ...this.defaultPayload,
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }


  /**
   * 
   * ### Solves a Lemin captcha
   * 
   * [Read more about other Lemin captcha parameters](https://2captcha.com/2captcha-api#lemin).
   * 
   * @param {{ pageurl, captcha_id, div_id, api_server, pingback, proxy, proxytype}} params Object
   * @param {string} params.pageurl The URL the captcha appears on.
   * @param {string} params.captcha_id Value of `captcha_id` parameter you found on page.
   * @param {string} params.div_id Value `id` of captcha pareent `<div></div>` element.
   * @param {string} params.api_server The domain part of script URL you found on page. Default value: `https://api.leminnow.com/`
   * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * 
   * @example
   * solver.lemin({
   *   pageurl:'https://2captcha.com/demo/lemin', 
   *   captcha_id: 'CROPPED_3dfdd5c_d1872b526b794d83ba3b365eb15a200b',
   *   div_id: 'lemin-cropped-captcha',
   *   api_server: 'api.leminnow.com'
   * })
   * .then((res) => {
   *     console.log(res);
   * })
   * .catch((err) => {
   *     console.log(err);
   * })
   */
  public async lemin(params: paramsLemin): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "lemin")
      const payload = {
          ...params,
          method: "lemin",
          ...this.defaultPayload,
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }


  /**
   * 
   * ### Solves Amazon WAF captcha
   * 
   * [Read more about "Amazon WAF" captcha](https://2captcha.com/2captcha-api#amazon-waf).
   * 
   * @param {{ pageurl, sitekey, iv, context, pingback, proxy, proxytype}} params The `amazonWaf` method takes arguments as an object. Thus, the `pageurl`, `sitekey`, `iv`, `context` fields in the passed object are mandatory.
   * @param {string} params.pageurl Is the full `URL` of page where you were challenged by the captcha.
   * @param {string} params.sitekey Is a value of `key` parameter in the page source.
   * @param {string} params.iv Is a value of `iv` parameter in the page source.
   * @param {string} params.context  Is a value of `context` parameter in the page source.
   * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * 
   * @example 
   * solver.amazonWaf({
   *  pageurl: "https://non-existent-example.execute-api.us-east-1.amazonaws.com/latest",
   *  sitekey: "AQIDAHjcYu/GjX+QlghicBgQ/7bFaQZ+m5FKCMDnO+vTbNg96AHMDLodoefdvyOnsHMRtEKQAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMUX+ZqwwuANRnZujSAgEQgDvHSxUQmVBuyUtumoW2n4ccTG7xQN1r3X/zz41qmQaYv9SSSvQrjIoDXKaUQ23tVb4ii8+uljuRdz/HPA==",
   *  context: "9BUgmlm48F92WUoqv97a49ZuEJJ50TCk9MVr3C7WMtQ0X6flVbufM4n8mjFLmbLVAPgaQ1Jydeaja94iAS49ljb+sUNLoukWedAQZKrlY4RdbOOzvcFqmD/ZepQFS9N5w15Exr4VwnVq+HIxTsDJwRviElWCdzKDebN/mk8/eX2n7qJi5G3Riq0tdQw9+C4diFZU5E97RSeahejOAAJTDqduqW6uLw9NsjJBkDRBlRjxjn5CaMMo5pYOxYbGrM8Un1JH5DMOLeXbq1xWbC17YSEoM1cRFfTgOoc+VpCe36Ai9Kc=",
   *  iv: "CgAHbCe2GgAAAAAj",
   * })
   * .then((res) => {
   *     console.log(res);
   * })
   * .catch((err) => {
   *     console.log(err);
   * })
   */
  public async amazonWaf(params: paramsAmazonWAF): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "amazon_waf")
      const payload = {
          ...params,
          method: "amazon_waf",
          ...this.defaultPayload,
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   * 
   * ### Solves Cloudflare Turnstile captcha
   * 
   * [Read more about Cloudflare Turnstile captcha](https://2captcha.com/2captcha-api#turnstile).
   * 
   * @param {{ pageurl, sitekey, action, data, pingback, proxy, proxytype}} params The `сloudflareTurnstile` method takes arguments as an object. Thus, the `pageurl`, `sitekey` fields in the passed object are mandatory.
   * @param {string} params.pageurl 	Full `URL` of the page where you see the captcha.
   * @param {string} params.sitekey Is a value of `sitekey` parameter in the page source.
   * @param {string} params.action Value of optional `action` parameter you found on page.
   * @param {string} params.data  Value of optional `data` parameter you found on page.
   * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * 
   * @example 
   * solver.cloudflareTurnstile({
   *   pageurl: "https://app.nodecraft.com/login",
   *   sitekey: "0x4AAAAAAAAkg0s3VIOD10y4"    
   * })
   * .then((res) => {
   *   console.log(res);
   * })
   * .catch((err) => {
   *   console.log(err);
   * })
   */
  public async cloudflareTurnstile(params: paramsTurnstile): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "turnstile")
      const payload = {
          ...params,
          method: "turnstile",
          ...this.defaultPayload,
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

 /**
  * ### Solves a Coordinates captcha. 
  * 
  * @param {{ body, imginstructions, textinstructions, language, lang, pingback }} params parameters Сoordinates Captcha as an object.
  * @param {string} params.body Base64-encoded captcha image.
  * @param {string} params.imginstructions Base64-encoded image with instruction for solving captcha.
  * @param {string} params.textinstructions Text will be shown to worker to help him to solve the captcha correctly. For example: click on all objects in red color.
  * @param {number} params.language `0` - not specified. `1` - Cyrillic captcha. `2` - Latin captcha
  * @param {string} params.lang Language code. [See the list of supported languages](https://2captcha.com/2captcha-api#language).
  * @param {string} params.pingback URL for `pingback` (callback) response that will be sent when captcha is solved. [More info here](https://2captcha.com/2captcha-api#pingback).
  * 
  * @returns {Promise<CaptchaAnswer>} The result from the solve
  * 
  * @example
  *  const imageBase64 = fs.readFileSync("./tests/media/hCaptchaImage.jpg", "base64")
  * 
  *  solver.coordinates({
  *      body: imageBase64,
  *      textinstructions: 'Select all photos containing the boat'
  *  })
  *  .then((res) => {
  *      console.log(res);
  *  })
  *  .catch((err) => {
  *      console.log(err);
  *  })
  */
  public async coordinates(params: paramsCoordinates): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "base64")
     
      const payload = {
          ...params,
          method: "base64",
          coordinatescaptcha: 1,
          ...this.defaultPayload,
      }

      const URL = this.in
      const response = await fetch(URL, {
          method: 'post',
          body: JSON.stringify(payload),
          headers: {'Content-Type': 'application/json'}  
      })
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   *     pageurl: string,
  captchakey: string,
  api_server?: string,
  version?: string,
  header_acao?: boolean,
  pingback?: string,
  proxy?: string,
  proxytype?: string,
   */

  /**
   * ### Solves Capy Puzzle captcha
   * 
   * @param {{ pageurl, captchakey, api_server, version, pingback, proxy, proxytype}} params Parameters Capy Puzzle Captcha as an object.
   * @param {string} params.pageurl 	Full `URL`of the page where you see the captcha.
   * @param {string} params.captchakey Value of `captchakey` parameter you found on page.
   * @param {string} params.api_server The domain part of script URL you found on page. Default value: `https://jp.api.capy.me/`.
   * @param {string} params.version  The version of captcha task: `puzzle` (assemble a puzzle) or `avatar` (drag an object)..
   * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * 
   * @example 
   * solver.capyPuzzle({
   *    pageurl: "https://www.capy.me/account/register/",
   *    captchakey: "PUZZLE_Cme4hZLjuZRMYC3uh14C52D3uNms5w"
   * })
   * .then((res) => {
   *   console.log(res);
   * })
   * .catch((err) => {
   *   console.log(err);
   * })
   */
  public async capyPuzzle(params: paramsCapyPuzzle): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "capy")

      const payload = {
          ...params,
          method: "capy",
          ...this.defaultPayload,
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   * ### Solves DataDome captcha
   * 
   * @param {{ pageurl, captcha_url, userAgent, pingback, proxy, proxytype}} params Parameters DataDome Captcha as an object.
   * @param {string} params.pageurl 	Full `URL` of the page where you see the captcha.
   * @param {string} params.captcha_url The value of the `src` parameter for the `iframe` element containing the captcha on the page.  
   * @param {string} params.userAgent ser-Agent of your MODERN browser
   * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
   * @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
   * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
   * 
   * @example 
   * solver.dataDome({
   *    pageurl: "https://rendezvousparis.hermes.com/client/register",
   *    captcha_url: "https://geo.captcha-delivery.com/captcha/?initialCid=AHrlqAAAAAMAEuQtkf4k1c0ABZhYZA%3D%3D&hash=789361B674144528D0B7EE76B35826&cid=mY4z7GNmh7Nt1lAFwpbNHAOcWPhyPgjHD2K1Pm~Od1iEKYLUnK3t7N2ZGUj8OqDK65cnwJHtHwd~t902vlwpSBA5l4ZHbS1Qszv~jEuEUJNQ_jMAjar2Kj3kq20MRJYh&t=fe&referer=https%3A%2F%2Frendezvousparis.hermes.com%2Fclient%2Fregister&s=40119&e=67fef144ac1a54dbd7507776367d2f9d5e36ec3add17fa22f3cb881db8385838",
   *    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
   *    proxy: "1.2.3.4:8888:user:password",
   *    proxytype: "http"
   * })
   * .then((res) => {
   *   console.log(res);
   * })
   * .catch((err) => {
   *   console.log(err);
   * })
   */
  public async dataDome(params: paramsDataDome): Promise<CaptchaAnswer> {
      checkCaptchaParams(params, "datadome")

      const payload = {
          ...params,
          method: "datadome",
          ...this.defaultPayload,
      }

      const response = await fetch(this.in + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.status == 1) {
          return this.pollResponse(data.request)
      } else {
          throw new APIError(data.request)
      }
  }

/**
* ### Solves CyberSiARA captcha
* 
* @param {{ pageurl, master_url_id, userAgent, pingback, proxy, proxytype}} params Parameters CyberSiARA Captcha as an object.
* @param {string} params.pageurl 	Full `URL` of the page where you see the captcha.
* @param {string} params.master_url_id The value of `MasterUrlId` parameter obtained from the request to the endpoint `API/CyberSiara/GetCyberSiara`.  
* @param {string} params.userAgent ser-Agent of your MODERN browser
* @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
* @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
* @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
* 
* @example 
* solver.cyberSiARA({
*   pageurl: "https://www.cybersiara.com/book-a-demo",
*   master_url_id: "OXR2LVNvCuXykkZbB8KZIfh162sNT8S2",
*   userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
* })
* .then((res) => {
*   console.log(res);
*  })
* .catch((err) => {
*   console.log(err);
* })
*/
public async cyberSiARA(params: paramsCyberSiARA): Promise<CaptchaAnswer> {
  checkCaptchaParams(params, "cybersiara")

  const payload = {
      ...params,
      method: "cybersiara",
      ...this.defaultPayload,
  }

  const response = await fetch(this.in + utils.objectToURI(payload))
  const result = await response.text()

  let data;
  try {
      data = JSON.parse(result)
  } catch {
      throw new APIError(result)
  }

  if (data.status == 1) {
      return this.pollResponse(data.request)
  } else {
      throw new APIError(data.request)
  }
}

/**
* ### Solves MTCaptcha
* 
* @param {{ pageurl, sitekey, userAgent, pingback, proxy, proxytype}} params Parameters MTCaptcha as an object.
* @param {string} params.pageurl 	Full `URL` of the page where you see the captcha.
* @param {string} params.sitekey TThe value of `sitekey` parameter found on the page.  
* @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
* @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
* @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
* 
* @example 
* solver.mtCaptcha({
*   pageurl: "https://service.mtcaptcha.com/mtcv1/demo/index.html",
*   sitekey: "MTPublic-DemoKey9M"
* })
* .then((res) => {
*   console.log(res);
*  })
* .catch((err) => {
*   console.log(err);
* })
*/
public async mtCaptcha(params: paramsMTCaptcha): Promise<CaptchaAnswer> {
  checkCaptchaParams(params, "mt_captcha")

  const payload = {
      ...params,
      method: "mt_captcha",
      ...this.defaultPayload,
  }

  const response = await fetch(this.in + utils.objectToURI(payload))
  const result = await response.text()

  let data;
  try {
      data = JSON.parse(result)
  } catch {
      throw new APIError(result)
  }

  if (data.status == 1) {
      return this.pollResponse(data.request)
  } else {
      throw new APIError(data.request)
  }
}

/**
* ### Solves Cutcaptcha
* 
* @param {{ pageurl, sitekey, userAgent, pingback, proxy, proxytype}} params Parameters MTCaptcha as an object.
* @param {string} params.pageurl 	Full `URL` of the page where you see the captcha.
* @param {string} params.sitekey TThe value of `sitekey` parameter found on the page.  
* @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
* @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
* @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
* 
* @example 
* solver.cutCaptcha({
*   pageurl: "https://service.mtcaptcha.com/mtcv1/demo/index.html",
*   sitekey: "MTPublic-DemoKey9M"
* })
* .then((res) => {
*   console.log(res);
*  })
* .catch((err) => {
*   console.log(err);
* })
*/
public async cutCaptcha(params: paramsMTCaptcha): Promise<CaptchaAnswer> {
  checkCaptchaParams(params, "mt_captcha")

  const payload = {
      ...params,
      method: "mt_captcha",
      ...this.defaultPayload,
  }

  const response = await fetch(this.in + utils.objectToURI(payload))
  const result = await response.text()

  let data;
  try {
      data = JSON.parse(result)
  } catch {
      throw new APIError(result)
  }

  if (data.status == 1) {
      return this.pollResponse(data.request)
  } else {
      throw new APIError(data.request)
  }
}

/**
* ### Solves Friendly Captcha
* 
* @param {{ pageurl, sitekey, pingback, proxy, proxytype}} params Parameters Friendly Captcha as an object.
* @param {string} params.pageurl 	Full `URL` of the page where you see the captcha.
* @param {string} params.sitekey The value of `data-apikey` or `data-sitekey` parameter found on the page.  
* @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
* @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
* @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
* 
* @example 
* solver.friendlyCaptcha({
*   pageurl: "https://geizhals.de/?liftban=1&from=/455973138?fsean=5901747021356",
*   sitekey: "FCMST5VUMCBOCGQ9"
* })
* .then((res) => {
*   console.log(res);
*  })
* .catch((err) => {
*   console.log(err);
* })
*/
public async friendlyCaptcha(params: friendlyCaptcha): Promise<CaptchaAnswer> {
  checkCaptchaParams(params, "friendly_captcha")

  const payload = {
      ...params,
      method: "friendly_captcha",
      ...this.defaultPayload,
  }

  const response = await fetch(this.in + utils.objectToURI(payload))
  const result = await response.text()

  let data;
  try {
      data = JSON.parse(result)
  } catch {
      throw new APIError(result)
  }

  if (data.status == 1) {
      return this.pollResponse(data.request)
  } else {
      throw new APIError(data.request)
  }
}

/**
* ### Bounding Box Method
* 
* @param {{ image, textinstructions, imginstructions }} params Parameters Bounding Box Method as an object.
* @param {image} params.image 	Image containing data for markup. The image must be encoded in `Base64` format.
* @param {textinstructions} params.textinstructions Text will be shown to worker to help him to select object on the image correctly. For example: "*Select cars in the image*". **Optional parameter**, if the instruction already exists in the form of the `imginstructions`. 
* @param {imginstructions} params.imginstructions Image with instruction for worker to help him to select object on the image correctly. The image must be encoded in `Base64` format. **Optional parameter**, if the instruction already exists in the form of the `textinstructions`.
* 
* @example 
* solver.boundingBox({
*   image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgG...",
*   textinstructions: "Select cars in the image"
* })
* .then((res) => {
*   console.log(res);
*  })
* .catch((err) => {
*   console.log(err);
* })
*/
public async boundingBox(params: paramsBoundingBox): Promise<CaptchaAnswer> {
  checkCaptchaParams(params, "bounding_box")

  const payload = {
      ...params,
      method: "bounding_box",
      ...this.defaultPayload,
  }

  const URL = this.in
  const response = await fetch(URL, {
      body: JSON.stringify( payload ),
      method: "post",
      headers: {'Content-Type': 'application/json'}
  })
  const result = await response.text()

  let data;
  try {
      data = JSON.parse(result)
  } catch {
      throw new APIError(result)
  }

  if (data.status == 1) {
      return this.pollResponse(data.request)
  } else {
      throw new APIError(data.request)
  }
}

  /**
   * Reports a captcha as correctly solved.
   * 
   * @param {string} id The ID of the captcha
   * @throws APIError
   * @example
   * solver.goodReport("7031854546")
   * 
   */
  public async goodReport(id: string): Promise<void> {
      const payload = {
          id: id,
          action: "reportgood",
          ...this.defaultPayload
      }

      const response = await fetch(this.res + utils.objectToURI(payload))
      const result = await response.text();

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.request == "OK_REPORT_RECORDED") {
          return data.request
      } else {
          throw new APIError(data.request)
      }
  }

  /**
   * Report an unsuccessful solve
   * 
   * @param {string} id The id of the captcha solve
   * 
   * @returns {Promise<void>} Resolves on completion
   * @throws APIError
   * @example
   * solver.badReport("7031854546")
   */
  public async badReport(id: string): Promise<void> {
      const payload = {
          id: id,
          action: "reportbad",
          ...this.defaultPayload
      }

      const response = await fetch(this.res + utils.objectToURI(payload))
      const result = await response.text()

      let data;
      try {
          data = JSON.parse(result)
      } catch {
          throw new APIError(result)
      }

      if (data.request == "OK_REPORT_RECORDED" || data.request == "ERROR_DUPLICATE_REPORT") {
          return data.request
      } else {
          throw new APIError(data.request)
      }
  }
}
