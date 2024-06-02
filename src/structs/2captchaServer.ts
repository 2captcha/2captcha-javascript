import { EventEmitter } from "events";
import { paramsReCaptcha } from "./2captcha.js";

// For creating the server
import * as http from "http";

export interface ServerCaptchaResult {
    data: string,
    id: string
}

export interface ServerEvents {
    "recaptcha": (captcha: ServerCaptchaResult) => void;
    "hcaptcha": (captcha: ServerCaptchaResult) => void;
}

export interface Server {
    on<U extends keyof ServerEvents>(
        event: U, listener: ServerEvents[U]
    ): this;
}

/**
 * ! WIP
 * This class will bind an http server to a specific port to allow for post requests from the 2captcha site, providing
 * an alternative to manually polling each captcha. A feature 2captcha allows for massive solve requirements. 
 */
export class Server extends EventEmitter {
    private _apikey: string;
    private _headerACAO: number;

    private _serverAddr: string;
    private _serverPort: number;
    private _pingbackString: string;

    private _terminated: boolean = false;

    constructor(apikey: string, serverAddr: string, serverPort: number, pingbackString: string, enableACAO: boolean = true) {
        super();
        this._apikey = apikey;
        this._headerACAO = enableACAO ? 1 : 0;
        this._serverAddr = serverAddr;
        this._serverPort = serverPort
        this._pingbackString = pingbackString;

        this.server();
    }

    private async server() {
        const server = http.createServer((req, res) => {
            if (req.method == "POST") {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    console.log(body);
                    res.end('ok');
                });
            }

            if (req.method == "GET" && req.url == "/2captcha.txt") {
                console.log("writing")
                res.write(this._pingbackString, "utf8")
                res.end();
            }
        })

        server.listen(this._serverPort);

        // let i = setInterval(() => {
        //     if (this._terminated == true) {
        //         clearInterval(i);
        //         server.close();
        //     }
        // }, 100)
    }

    private get defaultPayload() {
        return {
            key: this._apikey, json: 1, header_acao: this._headerACAO, soft_id: 4587
        }
    }

    /**
     * Termintes the running HTTP server.
     */
    public terminate() {
        this._terminated = true;
    }
    requestRecaptcha(params: paramsReCaptcha) {
        const payload = {
            ...params,
            method: "userrecaptcha",
            ...this.defaultPayload
        }
    }
}