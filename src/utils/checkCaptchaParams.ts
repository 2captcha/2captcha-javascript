// Captcha methods for which parameter checking is available
const supportedMethods = ["userrecaptcha", "hcaptcha", "geetest", "geetest_v4","yandex","funcaptcha","lemin","amazon_waf",
"turnstile", "base64", "capy","datadome", "cybersiara", "mt_captcha", "bounding_box", 'friendly_captcha', 'grid',
 'textcaptcha', 'canvas', 'rotatecaptcha', 'keycaptcha', 'cutcaptcha', 'tencent', 'atb_captcha', 'prosopo', 'captchafox', 'audio']

// Names of required fields that must be contained in the parameters captcha
const recaptchaRequiredFields =   ['pageurl','googlekey']
const hcaptchaRequiredFields =    ['pageurl','sitekey']
const geetestRequiredFields =     ['pageurl','gt','challenge']
const geetestV4RequiredFields =   ['pageurl','captcha_id']
const yandexSmartRequiredFields = ['pageurl','sitekey']
const funCaptchaRequiredFields =  ['pageurl','publickey']
const leminRequiredFields =       ['pageurl','div_id','captcha_id']
const amazonWafRequiredFields =   ['pageurl','context','iv','sitekey']
const turnstileRequiredFields =   ['pageurl','sitekey']
// `base64RequiredFields` for Normal Captcha and Coordinates captcha
const base64RequiredFields =      ['body'] 
const capyPuzzleRequiredFields =  ['captchakey']
const dataDomeRequiredFields =    ['pageurl', 'captcha_url', 'userAgent', 'proxy', 'proxytype']
const cyberSiARARequiredFields =  ['pageurl', 'master_url_id', 'userAgent']
const mtCaptchaRequiredFields =   ['pageurl', 'sitekey']
const boundingBoxRequiredFields = ['image'] // and textinstructions or imginstructions
const friendlyCaptchaFields =     ['pageurl','sitekey']
const gridRequiredFields =        ['body']  // and textinstructions or imginstructions
const textCaptchaRequiredFields = ['textcaptcha']
const canvasRequiredFields =      ['body'] // and textinstructions or imginstructions
const rotateRequiredFields =      ['body'] 
const keycaptchaRequiredFields =  ['pageurl', 's_s_c_user_id', 's_s_c_session_id', 's_s_c_web_server_sign', 's_s_c_web_server_sign2'] 
const cutcaptchaRequiredFields =  ['pageurl', 'misery_key', 'api_key'] 
const tencentRequiredFields =     ['pageurl', 'app_id']
const atbCaptchaRequiredFields =  ['pageurl', 'app_id', 'api_server']
const prosopoRequiredFields =     ['pageurl','sitekey']
const captchaFoxRequiredFields =  ['pageurl', 'sitekey', 'userAgent', 'proxy', 'proxytype']
const audioRequiredFields =       ['body', 'lang']

/**
 * Getting required arguments for a captcha.
 * 
 * @param {string} method method for solving captcha.
 * @returns {Array} An array containing the required arguments for this captcha
 */
const getRequiredFildsArr = (method: string):Array<string> => {
  let requiredFieldsArr = ['pageurl']

  switch(method){
    case "userrecaptcha":
      requiredFieldsArr = recaptchaRequiredFields
      break;
    case "hcaptcha":
      requiredFieldsArr = hcaptchaRequiredFields
      break;
    case "geetest":
      requiredFieldsArr = geetestRequiredFields
      break;
    case "geetest_v4":
      requiredFieldsArr = geetestV4RequiredFields
      break;
    case "yandex":
      requiredFieldsArr = yandexSmartRequiredFields
      break;
    case "funcaptcha":
      requiredFieldsArr = funCaptchaRequiredFields
      break;
    case "lemin":
      requiredFieldsArr = leminRequiredFields
      break;
    case "amazon_waf":
      requiredFieldsArr = amazonWafRequiredFields
      break;
    case "turnstile":
      requiredFieldsArr = turnstileRequiredFields
      break;
    case "base64":
      requiredFieldsArr = base64RequiredFields
      break;
    case "grid":
      requiredFieldsArr = gridRequiredFields
      break;
    case "capy":
      requiredFieldsArr = capyPuzzleRequiredFields
      break;
    case "datadome":
      requiredFieldsArr = dataDomeRequiredFields
      break;
    case "cybersiara":
      requiredFieldsArr = cyberSiARARequiredFields
      break;
    case "mt_captcha":
      requiredFieldsArr = mtCaptchaRequiredFields
      break;
    case "bounding_box":
      requiredFieldsArr = boundingBoxRequiredFields
      break;
    case "friendly_captcha":
      requiredFieldsArr = friendlyCaptchaFields
      break;
    case "textcaptcha":
      requiredFieldsArr = textCaptchaRequiredFields
      break;
    case "canvas":
      requiredFieldsArr = canvasRequiredFields
      break;
    case "rotatecaptcha":
      requiredFieldsArr = rotateRequiredFields
      break;
    case "keycaptcha":
      requiredFieldsArr = keycaptchaRequiredFields
      break;
    case "cutcaptcha":
      requiredFieldsArr = cutcaptchaRequiredFields
      break;
    case "tencent":
      requiredFieldsArr = tencentRequiredFields
      break;
    case "atb_captcha":
      requiredFieldsArr = atbCaptchaRequiredFields
      break;
    case "prosopo":
    requiredFieldsArr = prosopoRequiredFields
      break;
    case "captchafox":
    requiredFieldsArr = captchaFoxRequiredFields
      break;
    case "audio":
      requiredFieldsArr = audioRequiredFields
      break;
  }
  return requiredFieldsArr
}

/**
 * ### Captcha Required Parameters Check.
 *
 * Checking required captcha parameters before sending.
 * This function checks for required fields in the provided captcha parameters.
 * Throws an error if the specified method is not supported or if required fields are missing.
 * 
 * Note: The `checkCaptchaParams()` function should be called after `renameParams()`, if function `renameParams()` is used.
 *
 * @param { Object } params Captcha parameters that need to be checked.
 * @returns true | false | Error
 * @example
 * checkCaptchaParams(params, 'userrecaptcha')
 */
export default function checkCaptchaParams(params: Object, method: string) {
  let isCorrectCaptchaParams
  const isIncorrectCaptchaMethod = !supportedMethods.includes(method)

  if(isIncorrectCaptchaMethod) {
    isCorrectCaptchaParams = false
    throw new Error(`Error when check params captcha. \nNot found "${method}" method in the "supportedMethods" array. \nCheck if the method is written correctly `)
  }

  const requiredFields = getRequiredFildsArr(method)
  
  requiredFields.forEach(fieldName => {
    const isThisFieldNotAvailable = !params.hasOwnProperty(fieldName)

    if(isThisFieldNotAvailable) {
      isCorrectCaptchaParams = false
      throw new Error(`Error when check params captcha.\nNot found "${fieldName}" field in the Object. Field "${fieldName}" is required for "${method}" method. Please add field "${fieldName}" in object and try again.\nPlease correct your code for the "${method}" method according to the code examples`)
    } else {
      isCorrectCaptchaParams = true
    }
  })

  //The parameters `textinstructions` and `imginstructions` are mandatory for the methods `bounding_box`, `grid`, and `canvas`.
  if(method === "bounding_box" || method === "grid" || method === "canvas") {
    if(params.hasOwnProperty('textinstructions') || params.hasOwnProperty('imginstructions')) {
      isCorrectCaptchaParams = true
    } else {
      isCorrectCaptchaParams = false
      throw new Error(`Error when check params captcha.\nNot found "textinstructions" or "imginstructions" field in the Object. One of this field is required for "${method}" method. Please add field "textinstructions" or "imginstructions" to captcha parameters.`)
    }
  }

  return isCorrectCaptchaParams
}
