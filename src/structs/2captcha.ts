interface BaseSolve {

}

export interface paramsRecaptcha extends BaseSolve {
    pageurl: string,
    googlekey: string,
    invisible?: boolean,
    datas?: string,
    domain?: string,
    cookies?: string,
    userAgent?: string,
    header_acao?: boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string,
    action?: string,
    enterprise?: 0 | 1,
    min_score?: number,
    version?: string
}


export interface paramsHCaptcha extends BaseSolve {
    sitekey: string,
    pageurl: string,
    header_acao?: boolean,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
    invisible?: 0 | 1,
    data?: string,
    userAgent?: string,
    soft_id?: number,
    domain?: string
}

// FixMe:data[key] - how to send this parameter
export interface paramsFunCaptcha extends BaseSolve {
  publickey: string,
  pageurl: string,
  surl?: string,
  header_acao?: boolean,
  pingback?: string,
  proxy?: string,
  proxytype?: string,
  userAgent?: string,
  data?: string
}

export interface paramsImageCaptcha {
    body: string,
    phrase?: 0 | 1,
    regsense?: 0 | 1,
    numeric?: 0 | 1 | 2 | 3 | 4,
    calc?: 0 | 1,
    min_len?: 0 | string | number, // 1..20
    max_len?: 0 | string | number, // 1..20
    language?: 0 | 1 | 2,
    lang?: string,
    pingback?: string,
    textinstructions?: string
}

export interface paramsGeetest {
    gt: string,
    challenge: string,
    pageurl: string,
    api_server?: string,
    offline?: number | boolean,
    new_captcha?: number | boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string,
    userAgent?: string
}

/**
 * Interface for yandexSmart captcha
 * 
 * @typedef {object} yandexSmart
 * @property {string} pageurl URL of the page where the captcha is located
 * @property {string} sitekey The `sitekey` value you found on the captcha page
 * @property {string} pingback
 * @property {string} proxy Format: `login:password@123.123.123.123:3128`. You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
 * @property {string} proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
 * @property {string} userAgent Your `userAgent` that will be passed to our worker and used to solve the captcha.
 * 
 */
export interface yandexSmart {
    pageurl: string,
    sitekey: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
    userAgent?: string
}

/**
 * Interface for GeeTest V4 captcha
 * 
 * @typedef {object} paramsGeeTestV4
 * @property {string} pageurl Required parameter. URL of the page where the captcha is located
 * @property {string} captcha_id Required parameter. Value of `captcha_id` parameter you found on target website.
 * @property {string} pingback An optional param. [More info here](https://2captcha.com/2captcha-api#pingback).
 * @property {string} proxy An optional param. Format: `login:password@123.123.123.123:3128`
 * @property {string} proxytype An optional param. Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
 * @property {string} userAgent An optional param. Your `userAgent` that will be passed to our worker and used to solve the captcha.
 * 
 */
export interface paramsGeeTestV4 {
    pageurl: string,
    captcha_id: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
    userAgent?: string
}

export interface paramsLemin {
    pageurl: string,
    captcha_id: string,
    div_id: string,
    api_server?: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string
}

export interface paramsAmazonWAF {
    pageurl: string,
    sitekey: string,
    iv: string
    context: string,
    header_acao?: boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string,
}

export interface paramsTurnstile {
    pageurl: string,
    sitekey: string,
    action?: string,
    data?: string,
    header_acao?: boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string,
}

export interface paramsCapyPuzzle {
    pageurl: string,
    captchakey: string,
    api_server?: string,
    version?: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
}

export interface paramsCoordinates {
    body: string,
    language?: 0 | 1 | 2,
    lang?: string,
    pingback?: string,
    textinstructions?: string,
    imginstructions?: string
}

export interface paramsDataDome {
    pageurl: string,
    captcha_url: string,
    userAgent: string,
    pingback?: string,
    proxy: string,
    proxytype: string,
}

export interface paramsCyberSiARA {
    pageurl: string,
    master_url_id: string,
    userAgent: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
}

export interface paramsMTCaptcha {
    pageurl: string,
    sitekey: string,
    userAgent?: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
}

export interface friendlyCaptcha {
    pageurl: string,
    sitekey: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
}

export interface paramsBoundingBox {
    image: string,
    textinstructions?: string,
    imginstructions?: string,
}
