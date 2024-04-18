(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RingCentral"] = factory();
	else
		root["RingCentral"] = root["RingCentral"] || {}, root["RingCentral"]["Subscriptions"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9252:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.boundary = void 0;
async function stream2buffer(stream) {
    return new Promise((resolve, reject) => {
        const buf = Array();
        stream.on('data', (chunk) => buf.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(buf)));
        stream.on('error', (err) => reject(new Error(`error converting stream - ${err}`)));
    });
}
exports.boundary = 'ad05fc42-a66d-4a94-b807-f1c91136c17b';
class FormData {
    constructor() {
        this.files = [];
    }
    append(formFile) {
        this.files.push(formFile);
    }
    prepend(formFile) {
        this.files.unshift(formFile);
    }
    async getBody() {
        let buffer = Buffer.alloc(0);
        for (const formFile of this.files) {
            let temp = `--${exports.boundary}\r\n`;
            temp += `Content-Type: ${formFile.contentType}\r\n`;
            temp += `Content-Disposition: form-data; name="${formFile.name}"; filename="${formFile.filename}"\r\n\r\n`;
            buffer = Buffer.concat([buffer, Buffer.from(temp, 'utf-8')]);
            let fileBuffer = Buffer.alloc(0);
            if (typeof formFile.content === 'string') {
                fileBuffer = Buffer.from(`${formFile.content}\r\n`, 'utf-8');
            }
            else if (Buffer.isBuffer(formFile.content)) {
                fileBuffer = formFile.content;
            }
            else if (formFile.content instanceof Blob) {
                fileBuffer = Buffer.from(await formFile.content.arrayBuffer());
            }
            else {
                // NodeJS.ReadableStream
                fileBuffer = await stream2buffer(formFile.content);
            }
            buffer = Buffer.concat([buffer, fileBuffer]);
        }
        return Buffer.concat([buffer, Buffer.from(`\r\n--${exports.boundary}--\r\n`, 'utf8')]);
    }
}
exports["default"] = FormData;
//# sourceMappingURL=FormData.js.map

/***/ }),

/***/ 500:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const axios_1 = __importDefault(__webpack_require__(3139));
const qs_1 = __importDefault(__webpack_require__(8985));
const FormData_1 = __webpack_require__(9252);
const RestException_1 = __importDefault(__webpack_require__(7087));
const version = '1.3.x';
class Rest {
    constructor(options) {
        var _a, _b, _c, _d, _e;
        this.server = (_a = options.server) !== null && _a !== void 0 ? _a : Rest.sandboxServer;
        this.clientId = (_b = options.clientId) !== null && _b !== void 0 ? _b : '';
        this.clientSecret = options.clientSecret;
        this.token = (_c = options.token) !== null && _c !== void 0 ? _c : undefined;
        this.appName = (_d = options.appName) !== null && _d !== void 0 ? _d : 'Unknown';
        this.appVersion = (_e = options.appVersion) !== null && _e !== void 0 ? _e : '0.0.1';
        this.httpClient = axios_1.default.create({
            headers: {
                'X-User-Agent': `${this.appName}/${this.appVersion} ringcentral-extensible/core/${version}`,
            },
            validateStatus: () => true,
            paramsSerializer: {
                serialize: (params) => qs_1.default.stringify(params, { arrayFormat: 'repeat' }),
            },
        });
        this.httpClient.interceptors.request.use((config) => {
            if (Buffer.isBuffer(config.data)) {
                return {
                    ...config,
                    headers: { ...config.headers, 'Content-Type': `multipart/form-data; boundary=${FormData_1.boundary}` },
                };
            }
            return config;
        });
    }
    // eslint-disable-next-line max-params
    async request(method, endpoint, content, queryParams, config) {
        var _a;
        const newConfig = {
            baseURL: this.server,
            method,
            url: endpoint,
            data: content,
            params: queryParams,
            ...config,
        };
        // /restapi/oauth/wstoken uses bearer token
        if (endpoint === '/restapi/oauth/token' || endpoint === '/restapi/oauth/revoke') {
            if (this.clientSecret) {
                // basic token
                newConfig.auth = {
                    username: this.clientId,
                    password: this.clientSecret,
                };
            }
            // else: PKCE: https://medium.com/ringcentral-developers/use-authorization-code-pkce-for-ringcentral-api-in-client-app-e9108f04b5f0
            newConfig.data = qs_1.default.stringify(newConfig.data);
        }
        else {
            // bearer token
            newConfig.headers = {
                ...newConfig.headers,
                Authorization: `Bearer ${(_a = this.token) === null || _a === void 0 ? void 0 : _a.access_token}`,
            };
        }
        const r = await this.httpClient.request(newConfig);
        if (r.status >= 200 && r.status < 300) {
            return r;
        }
        throw new RestException_1.default(r);
    }
}
Rest.sandboxServer = 'https://platform.devtest.ringcentral.com';
Rest.productionServer = 'https://platform.ringcentral.com';
exports["default"] = Rest;
//# sourceMappingURL=Rest.js.map

/***/ }),

/***/ 7087:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Utils_1 = __importDefault(__webpack_require__(7097));
class RestException extends Error {
    constructor(r) {
        const message = Utils_1.default.formatTraffic(r);
        super(message);
        Object.setPrototypeOf(this, RestException.prototype);
        this.response = r;
        this.message = message;
    }
}
exports["default"] = RestException;
//# sourceMappingURL=RestException.js.map

/***/ }),

/***/ 8059:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class SdkExtension {
    constructor() {
        this.enabled = true;
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
}
exports["default"] = SdkExtension;
//# sourceMappingURL=SdkExtension.js.map

/***/ }),

/***/ 7097:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const FormData_1 = __importDefault(__webpack_require__(9252));
class Utils {
    static formatTraffic(r) {
        return `HTTP ${r.status} ${r.statusText}${r.data.message ? ` - ${r.data.message}` : ''}

    Response:
    ${JSON.stringify({
            data: r.data,
            status: r.status,
            statusText: r.statusText,
            headers: r.headers,
        }, null, 2)}

    Request:
    ${JSON.stringify({
            method: r.config.method,
            baseURL: r.config.baseURL,
            url: r.config.url,
            params: r.config.params,
            data: Buffer.isBuffer(r.config.data) ? '<Buffer>' : r.config.data,
            headers: r.config.headers,
        }, null, 2)}
    `;
    }
    static isAttachment(obj) {
        return typeof obj === 'object' && obj !== null && 'filename' in obj && 'content' in obj;
    }
    static getFormData(...objects) {
        const formData = new FormData_1.default();
        const obj = Object.assign({}, ...objects);
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            if (value === undefined || value === null) {
                delete obj[key];
                continue;
            }
            if (Utils.isAttachment(value)) {
                const attachment = value;
                formData.append({
                    name: key,
                    filename: attachment.filename,
                    contentType: attachment.contentType,
                    content: attachment.content,
                });
                delete obj[key];
                continue;
            }
            if (Array.isArray(value) && Utils.isAttachment(value[0])) {
                for (const attachment of value) {
                    formData.append({
                        name: key,
                        filename: attachment.filename,
                        contentType: attachment.contentType,
                        content: attachment.content,
                    });
                }
                delete obj[key];
            }
        }
        if (Object.keys(obj).length > 0) {
            formData.prepend({
                name: 'request.json',
                filename: 'request.json',
                contentType: 'application/json',
                content: JSON.stringify(obj),
            });
        }
        return formData.getBody();
    }
}
exports["default"] = Utils;
//# sourceMappingURL=Utils.js.map

/***/ }),

/***/ 112:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Rest_1 = __importDefault(__webpack_require__(500));
const Restapi_1 = __importDefault(__webpack_require__(2446));
const Scim_1 = __importDefault(__webpack_require__(2568));
const Analytics_1 = __importDefault(__webpack_require__(7184));
const Ai_1 = __importDefault(__webpack_require__(3042));
const Rcvideo_1 = __importDefault(__webpack_require__(3062));
const Webinar_1 = __importDefault(__webpack_require__(6354));
const TeamMessaging_1 = __importDefault(__webpack_require__(9071));
class RingCentral {
    constructor(restOptions) {
        this.sdkExtensions = [];
        this.rest = new Rest_1.default(restOptions !== null && restOptions !== void 0 ? restOptions : {});
    }
    async installExtension(sdkExtension) {
        await sdkExtension.install(this);
        this.sdkExtensions.push(sdkExtension);
    }
    get token() {
        return this.rest.token;
    }
    set token(token) {
        this.rest.token = token;
    }
    // eslint-disable-next-line max-params
    async request(method, endpoint, content, queryParams, config) {
        try {
            const r = await this.rest.request(method, endpoint, content, queryParams, config);
            RingCentral.config.logger.info(`[${new Date().toLocaleString()} HTTP ${method} ${r.status} ${r.statusText}] ${this.rest.server} ${endpoint}`);
            return r;
        }
        catch (e) {
            const re = e;
            if (re.response) {
                const r = re.response;
                RingCentral.config.logger.info(`[${new Date().toLocaleString()} HTTP ${method} ${r.status} ${r.statusText}] ${this.rest.server} ${endpoint}`);
            }
            throw e;
        }
    }
    async get(endpoint, queryParams, config) {
        return this.request('GET', endpoint, undefined, queryParams, config);
    }
    // eslint-disable-next-line max-params
    async delete(endpoint, content, queryParams, config) {
        return this.request('DELETE', endpoint, content, queryParams, config);
    }
    // eslint-disable-next-line max-params
    async post(endpoint, content, queryParams, config) {
        return this.request('POST', endpoint, content, queryParams, config);
    }
    // eslint-disable-next-line max-params
    async put(endpoint, content, queryParams, config) {
        return this.request('PUT', endpoint, content, queryParams, config);
    }
    // eslint-disable-next-line max-params
    async patch(endpoint, content, queryParams, config) {
        return this.request('PATCH', endpoint, content, queryParams, config);
    }
    async getToken(getTokenRequest) {
        getTokenRequest.client_id = this.rest.clientId;
        this.token = await this.restapi(null).oauth().token().post(getTokenRequest);
        return this.token;
    }
    async authorize(options) {
        const getTokenRequest = {};
        if ('username' in options) {
            // eslint-disable-next-line no-console
            console.warn('Username/password authentication is deprecated. Please migrate to the JWT grant type.');
            getTokenRequest.grant_type = 'password';
            getTokenRequest.username = options.username;
            getTokenRequest.extension = options.extension;
            getTokenRequest.password = options.password;
        }
        else if ('code' in options) {
            getTokenRequest.grant_type = 'authorization_code';
            getTokenRequest.code = options.code;
            getTokenRequest.redirect_uri = options.redirect_uri;
            // PKCE: https://medium.com/ringcentral-developers/use-authorization-code-pkce-for-ringcentral-api-in-client-app-e9108f04b5f0
            getTokenRequest.code_verifier = options.code_verifier;
        }
        else if ('jwt' in options) {
            getTokenRequest.grant_type = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
            getTokenRequest.assertion = options.jwt;
        }
        else {
            throw new Error('Unsupported authorization flow');
        }
        return this.getToken(getTokenRequest);
    }
    /**
     * Just a synonym of authorize
     */
    async login(options) {
        return this.authorize(options);
    }
    /**
     * Each time you call token endpoint using this flow, you continue current client session, and receive a new token pair: access token and refresh token in response to this request.
     * The old token pair immediately becomes inactive.
     *
     * https://developers.ringcentral.com/api-reference/Get-Token
     *
     * @param refreshToken Refresh Token
     */
    async refresh(refreshToken) {
        var _a;
        const tokenToRefresh = refreshToken !== null && refreshToken !== void 0 ? refreshToken : (_a = this.token) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!tokenToRefresh) {
            throw new Error('tokenToRefresh must be specified.');
        }
        const getTokenRequest = {};
        getTokenRequest.grant_type = 'refresh_token';
        getTokenRequest.refresh_token = tokenToRefresh;
        return this.getToken(getTokenRequest);
    }
    /**
     * Each time you call token endpoint using this flow, you continue current client session, and receive a new token pair: access token and refresh token in response to this request.
     * The old token pair immediately becomes inactive.
     *
     * https://developers.ringcentral.com/api-reference/Revoke-Token
     *
     * @param tokenToRevoke AccessToken
     */
    async revoke(tokenToRevoke) {
        var _a, _b, _c;
        for (const sdkExtension of this.sdkExtensions) {
            await sdkExtension.revoke();
        }
        if (!tokenToRevoke && !this.token) {
            // nothing to revoke
            return;
        }
        if (!this.rest.clientId || !this.rest.clientSecret) {
            // no clientId or clientSecret, the token is from external source, cannot revoke
            return;
        }
        const temp = (_b = tokenToRevoke !== null && tokenToRevoke !== void 0 ? tokenToRevoke : (_a = this.token) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : (_c = this.token) === null || _c === void 0 ? void 0 : _c.refresh_token;
        await this.restapi(null).oauth().revoke().post({ token: temp });
        this.token = undefined;
    }
    restapi(apiVersion = 'v1.0') {
        return new Restapi_1.default(this, apiVersion);
    }
    scim(version = 'v2') {
        return new Scim_1.default(this, version);
    }
    analytics() {
        return new Analytics_1.default(this);
    }
    teamMessaging() {
        return new TeamMessaging_1.default(this);
    }
    ai() {
        return new Ai_1.default(this);
    }
    rcvideo() {
        return new Rcvideo_1.default(this);
    }
    webinar() {
        return new Webinar_1.default(this);
    }
}
RingCentral.config = {
    logger: {
        debug: () => { },
        log: () => { },
        info: () => { },
        warn: () => { },
        error: () => { },
    },
};
exports["default"] = RingCentral;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4102:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/speaker-diarize`;
    }
    /**
     * Identifies who said what. Speaker diarization will identify the speaker for each segment
     * so you can tell who spoke the sentence, paragraph, or phrase.
     *
     * HTTP Method: post
     * Endpoint: /ai/audio/v1/async/speaker-diarize
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async post(diarizeInput, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), diarizeInput, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1156:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/speaker-identify`;
    }
    /**
     * Returns Speaker Identification to the provided webhook uri.
     * HTTP Method: post
     * Endpoint: /ai/audio/v1/async/speaker-identify
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async post(identifyInput, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), identifyInput, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5183:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/speech-to-text`;
    }
    /**
     * Returns Speech to Text Conversion to the provided webhook uri.
     * HTTP Method: post
     * Endpoint: /ai/audio/v1/async/speech-to-text
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async post(asrInput, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), asrInput, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4738:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const SpeakerIdentify_1 = __importDefault(__webpack_require__(1156));
const SpeakerDiarize_1 = __importDefault(__webpack_require__(4102));
const SpeechToText_1 = __importDefault(__webpack_require__(5183));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/async`;
    }
    speechToText() {
        return new SpeechToText_1.default(this);
    }
    speakerDiarize() {
        return new SpeakerDiarize_1.default(this);
    }
    speakerIdentify() {
        return new SpeakerIdentify_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2199:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, speakerId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.speakerId = speakerId;
    }
    path(withParameter = true) {
        if (withParameter && this.speakerId !== null) {
            return `${this._parent.path()}/enrollments/${this.speakerId}`;
        }
        return `${this._parent.path()}/enrollments`;
    }
    /**
     * Returns the List of Enrolled Speakers
     * HTTP Method: get
     * Endpoint: /ai/audio/v1/enrollments
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates Enrollment for the provided Speaker.
     * HTTP Method: post
     * Endpoint: /ai/audio/v1/enrollments
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async post(enrollmentInput, restRequestConfig) {
        const r = await this.rc.post(this.path(false), enrollmentInput, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Get The Status of Enrollment for the provided Speaker.
     * HTTP Method: get
     * Endpoint: /ai/audio/v1/enrollments/{speakerId}
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async get(restRequestConfig) {
        if (this.speakerId === null) {
            throw new Error('speakerId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Delete The Enrollment for the provided Speaker.
     * HTTP Method: delete
     * Endpoint: /ai/audio/v1/enrollments/{speakerId}
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async delete(restRequestConfig) {
        if (this.speakerId === null) {
            throw new Error('speakerId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Add newer audio data to improve an existing speaker enrollment
     * HTTP Method: patch
     * Endpoint: /ai/audio/v1/enrollments/{speakerId}
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async patch(enrollmentPatchInput, restRequestConfig) {
        if (this.speakerId === null) {
            throw new Error('speakerId must be specified.');
        }
        const r = await this.rc.patch(this.path(), enrollmentPatchInput, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6694:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Enrollments_1 = __importDefault(__webpack_require__(2199));
const Async_1 = __importDefault(__webpack_require__(4738));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    async() {
        return new Async_1.default(this);
    }
    enrollments(speakerId = null) {
        return new Enrollments_1.default(this, speakerId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2051:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(6694));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/audio`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 862:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/analyze-interaction`;
    }
    /**
     * Returns multiple insights including summaries, emotion, key phrases, questions asked, and more in a single API call.
     *
     * HTTP Method: post
     * Endpoint: /ai/insights/v1/async/analyze-interaction
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async post(interactionInput, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), interactionInput, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9017:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AnalyzeInteraction_1 = __importDefault(__webpack_require__(862));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/async`;
    }
    analyzeInteraction() {
        return new AnalyzeInteraction_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4214:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Async_1 = __importDefault(__webpack_require__(9017));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    async() {
        return new Async_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8522:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(4214));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/insights`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6524:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, jobId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.jobId = jobId;
    }
    path(withParameter = true) {
        if (withParameter && this.jobId !== null) {
            return `${this._parent.path()}/jobs/${this.jobId}`;
        }
        return `${this._parent.path()}/jobs`;
    }
    /**
     * Returns async task status by Job ID
     * HTTP Method: get
     * Endpoint: /ai/status/v1/jobs/{jobId}
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async get(restRequestConfig) {
        if (this.jobId === null) {
            throw new Error('jobId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4951:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Jobs_1 = __importDefault(__webpack_require__(6524));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    jobs(jobId = null) {
        return new Jobs_1.default(this, jobId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3981:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(4951));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/status`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9429:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/punctuate`;
    }
    /**
     * Returns Smart Punctuation to the provided webhook uri.
     * HTTP Method: post
     * Endpoint: /ai/text/v1/async/punctuate
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async post(punctuateInput, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), punctuateInput, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8413:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/summarize`;
    }
    /**
     * Returns Conversational Summarization to webhook uri for segmented transcript of audios with start,end,speakerId, text(alphanumeric and punctuations).
     * HTTP Method: post
     * Endpoint: /ai/text/v1/async/summarize
     * Rate Limit Group: Heavy
     * App Permission: AI
     */
    async post(summaryInput, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), summaryInput, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9599:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Punctuate_1 = __importDefault(__webpack_require__(9429));
const Summarize_1 = __importDefault(__webpack_require__(8413));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/async`;
    }
    summarize() {
        return new Summarize_1.default(this);
    }
    punctuate() {
        return new Punctuate_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5516:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Async_1 = __importDefault(__webpack_require__(9599));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    async() {
        return new Async_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1756:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(5516));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/text`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3042:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Insights_1 = __importDefault(__webpack_require__(8522));
const Status_1 = __importDefault(__webpack_require__(3981));
const Audio_1 = __importDefault(__webpack_require__(2051));
const Text_1 = __importDefault(__webpack_require__(1756));
class Index {
    constructor(rc) {
        this.rc = rc;
    }
    path() {
        return '/ai';
    }
    text() {
        return new Text_1.default(this);
    }
    audio() {
        return new Audio_1.default(this);
    }
    status() {
        return new Status_1.default(this);
    }
    insights() {
        return new Insights_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6317:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/fetch`;
    }
    /**
     * Returns call aggregations filtered by parameters specified
     * HTTP Method: post
     * Endpoint: /analytics/calls/v1/accounts/{accountId}/aggregation/fetch
     * Rate Limit Group: Light
     * App Permission: Analytics
     */
    async post(aggregationRequest, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), aggregationRequest, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9762:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Fetch_1 = __importDefault(__webpack_require__(6317));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/aggregation`;
    }
    fetch() {
        return new Fetch_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7891:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/fetch`;
    }
    /**
     * Returns time-value data aggregations filtered by parameters specified
     * HTTP Method: post
     * Endpoint: /analytics/calls/v1/accounts/{accountId}/timeline/fetch
     * Rate Limit Group: Light
     * App Permission: Analytics
     */
    async post(timelineRequest, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), timelineRequest, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4131:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Fetch_1 = __importDefault(__webpack_require__(7891));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/timeline`;
    }
    fetch() {
        return new Fetch_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9575:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Aggregation_1 = __importDefault(__webpack_require__(9762));
const Timeline_1 = __importDefault(__webpack_require__(4131));
class Index {
    constructor(_parent, accountId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.accountId = accountId;
    }
    path(withParameter = true) {
        if (withParameter && this.accountId !== null) {
            return `${this._parent.path()}/accounts/${this.accountId}`;
        }
        return `${this._parent.path()}/accounts`;
    }
    timeline() {
        return new Timeline_1.default(this);
    }
    aggregation() {
        return new Aggregation_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6870:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Accounts_1 = __importDefault(__webpack_require__(9575));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    accounts(accountId = null) {
        return new Accounts_1.default(this, accountId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3050:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(6870));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/calls`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7184:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Calls_1 = __importDefault(__webpack_require__(3050));
class Index {
    constructor(rc) {
        this.rc = rc;
    }
    path() {
        return '/analytics';
    }
    calls() {
        return new Calls_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/recordings`;
    }
    /**
     * Returns all recordings available for specific extension.
     * This endpoint is used in admin recording service, not regular web
     *
     * HTTP Method: get
     * Endpoint: /rcvideo/v1/account/{accountId}/extension/{extensionId}/recordings
     * Rate Limit Group: Light
     * App Permission: Video
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3092:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Recordings_1 = __importDefault(__webpack_require__(6161));
class Index {
    constructor(_parent, extensionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.extensionId = extensionId;
    }
    path(withParameter = true) {
        if (withParameter && this.extensionId !== null) {
            return `${this._parent.path()}/extension/${this.extensionId}`;
        }
        return `${this._parent.path()}/extension`;
    }
    recordings() {
        return new Recordings_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4635:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/recordings`;
    }
    /**
     * Returns all account recordings.
     * This endpoint is used in Admin recording service, not regular web
     *
     * HTTP Method: get
     * Endpoint: /rcvideo/v1/account/{accountId}/recordings
     * Rate Limit Group: Light
     * App Permission: Video
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1338:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Recordings_1 = __importDefault(__webpack_require__(4635));
const Extension_1 = __importDefault(__webpack_require__(3092));
class Index {
    constructor(_parent, accountId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.accountId = accountId;
    }
    path(withParameter = true) {
        if (withParameter && this.accountId !== null) {
            return `${this._parent.path()}/account/${this.accountId}`;
        }
        return `${this._parent.path()}/account`;
    }
    extension(extensionId = null) {
        return new Extension_1.default(this, extensionId);
    }
    recordings() {
        return new Recordings_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2525:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/delegators`;
    }
    /**
     * Returns the list of users who can delegate bridge/meeting creation to the given user.
     * HTTP Method: get
     * Endpoint: /rcvideo/v1/accounts/{accountId}/extensions/{extensionId}/delegators
     * Rate Limit Group: Medium
     * App Permission: Video
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8622:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Delegators_1 = __importDefault(__webpack_require__(2525));
class Index {
    constructor(_parent, extensionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.extensionId = extensionId;
    }
    path(withParameter = true) {
        if (withParameter && this.extensionId !== null) {
            return `${this._parent.path()}/extensions/${this.extensionId}`;
        }
        return `${this._parent.path()}/extensions`;
    }
    delegators() {
        return new Delegators_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4443:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Extensions_1 = __importDefault(__webpack_require__(8622));
class Index {
    constructor(_parent, accountId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.accountId = accountId;
    }
    path(withParameter = true) {
        if (withParameter && this.accountId !== null) {
            return `${this._parent.path()}/accounts/${this.accountId}`;
        }
        return `${this._parent.path()}/accounts`;
    }
    extensions(extensionId = null) {
        return new Extensions_1.default(this, extensionId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6360:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, meetingId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.meetingId = meetingId;
    }
    path(withParameter = true) {
        if (withParameter && this.meetingId !== null) {
            return `${this._parent.path()}/meetings/${this.meetingId}`;
        }
        return `${this._parent.path()}/meetings`;
    }
    /**
     * Returns the list of user meetings.
     * HTTP Method: get
     * Endpoint: /rcvideo/v1/history/meetings
     * Rate Limit Group: Light
     * App Permission: Video
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a user meeting by ID.
     * HTTP Method: get
     * Endpoint: /rcvideo/v1/history/meetings/{meetingId}
     * Rate Limit Group: Light
     * App Permission: Video
     */
    async get(restRequestConfig) {
        if (this.meetingId === null) {
            throw new Error('meetingId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9037:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Meetings_1 = __importDefault(__webpack_require__(6360));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/history`;
    }
    meetings(meetingId = null) {
        return new Meetings_1.default(this, meetingId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6426:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Accounts_1 = __importDefault(__webpack_require__(4443));
const History_1 = __importDefault(__webpack_require__(9037));
const Account_1 = __importDefault(__webpack_require__(1338));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    account(accountId = null) {
        return new Account_1.default(this, accountId);
    }
    history() {
        return new History_1.default(this);
    }
    accounts(accountId = null) {
        return new Accounts_1.default(this, accountId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4586:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/default`;
    }
    /**
     * Returns a default bridge (PMI) for the user specified by **accountId**
     * and **extensionId** identifiers.
     *
     * HTTP Method: get
     * Endpoint: /rcvideo/v2/account/{accountId}/extension/{extensionId}/bridges/default
     * Rate Limit Group: Medium
     * App Permission: Video
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1888:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Default_1 = __importDefault(__webpack_require__(4586));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bridges`;
    }
    /**
     * Creates a new bridge for the user specified by **accountId** and **extensionId** identifiers. The request body
     * should contain JSON object which describes properties of the new bridge.
     * The bridge can be created by a user himself, his delegate or any user who has the **Super Admin** privilege.
     *
     * HTTP Method: post
     * Endpoint: /rcvideo/v2/account/{accountId}/extension/{extensionId}/bridges
     * Rate Limit Group: Heavy
     * App Permission: Video
     */
    async post(createBridgeRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), createBridgeRequest, undefined, restRequestConfig);
        return r.data;
    }
    default() {
        return new Default_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Bridges_1 = __importDefault(__webpack_require__(1888));
class Index {
    constructor(_parent, extensionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.extensionId = extensionId;
    }
    path(withParameter = true) {
        if (withParameter && this.extensionId !== null) {
            return `${this._parent.path()}/extension/${this.extensionId}`;
        }
        return `${this._parent.path()}/extension`;
    }
    bridges() {
        return new Bridges_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9887:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Extension_1 = __importDefault(__webpack_require__(8041));
class Index {
    constructor(_parent, accountId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.accountId = accountId;
    }
    path(withParameter = true) {
        if (withParameter && this.accountId !== null) {
            return `${this._parent.path()}/account/${this.accountId}`;
        }
        return `${this._parent.path()}/account`;
    }
    extension(extensionId = null) {
        return new Extension_1.default(this, extensionId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1476:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, pin = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.pin = pin;
    }
    path(withParameter = true) {
        if (withParameter && this.pin !== null) {
            return `${this._parent.path()}/pstn/${this.pin}`;
        }
        return `${this._parent.path()}/pstn`;
    }
    /**
     * Finds a bridge by Host or Participant PSTN PIN.
     * HTTP Method: get
     * Endpoint: /rcvideo/v2/bridges/pin/pstn/{pin}
     * Rate Limit Group: Medium
     * App Permission: Video
     */
    async get(queryParams, restRequestConfig) {
        if (this.pin === null) {
            throw new Error('pin must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7347:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, pin = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.pin = pin;
    }
    path(withParameter = true) {
        if (withParameter && this.pin !== null) {
            return `${this._parent.path()}/web/${this.pin}`;
        }
        return `${this._parent.path()}/web`;
    }
    /**
     * Finds a bridge by short identifier (Web PIN). Also it can be used to find a default bridge by the alias
     * (personal meeting name).
     *
     * HTTP Method: get
     * Endpoint: /rcvideo/v2/bridges/pin/web/{pin}
     * Rate Limit Group: Medium
     * App Permission: Video
     */
    async get(queryParams, restRequestConfig) {
        if (this.pin === null) {
            throw new Error('pin must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9742:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Pstn_1 = __importDefault(__webpack_require__(1476));
const Web_1 = __importDefault(__webpack_require__(7347));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/pin`;
    }
    web(pin = null) {
        return new Web_1.default(this, pin);
    }
    pstn(pin = null) {
        return new Pstn_1.default(this, pin);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4250:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Pin_1 = __importDefault(__webpack_require__(9742));
class Index {
    constructor(_parent, bridgeId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.bridgeId = bridgeId;
    }
    path(withParameter = true) {
        if (withParameter && this.bridgeId !== null) {
            return `${this._parent.path()}/bridges/${this.bridgeId}`;
        }
        return `${this._parent.path()}/bridges`;
    }
    /**
     * Returns a bridge by **bridgeId** identifier.
     * HTTP Method: get
     * Endpoint: /rcvideo/v2/bridges/{bridgeId}
     * Rate Limit Group: Medium
     * App Permission: Video
     */
    async get(queryParams, restRequestConfig) {
        if (this.bridgeId === null) {
            throw new Error('bridgeId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a bridge by **bridgeId** identifier.
     * Deletion can only be done by bridge owner, his delegate or any user who has the **Super Admin** privilege.
     *
     * HTTP Method: delete
     * Endpoint: /rcvideo/v2/bridges/{bridgeId}
     * Rate Limit Group: Medium
     * App Permission: Video
     */
    async delete(restRequestConfig) {
        if (this.bridgeId === null) {
            throw new Error('bridgeId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a bridge by **bridgeId** identifier. The request body should contain JSON object with updating properties.
     * Update can only be done by bridge owner, his delegate or any user who has the **Super Admin** privilege.
     *
     * HTTP Method: patch
     * Endpoint: /rcvideo/v2/bridges/{bridgeId}
     * Rate Limit Group: Medium
     * App Permission: Video
     */
    async patch(updateBridgeRequest, restRequestConfig) {
        if (this.bridgeId === null) {
            throw new Error('bridgeId must be specified.');
        }
        const r = await this.rc.patch(this.path(), updateBridgeRequest, undefined, restRequestConfig);
        return r.data;
    }
    pin() {
        return new Pin_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3791:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Bridges_1 = __importDefault(__webpack_require__(4250));
const Account_1 = __importDefault(__webpack_require__(9887));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v2`;
    }
    account(accountId = null) {
        return new Account_1.default(this, accountId);
    }
    bridges(bridgeId = null) {
        return new Bridges_1.default(this, bridgeId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3062:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V2_1 = __importDefault(__webpack_require__(3791));
const V1_1 = __importDefault(__webpack_require__(6426));
class Index {
    constructor(rc) {
        this.rc = rc;
    }
    path() {
        return '/rcvideo';
    }
    v1() {
        return new V1_1.default(this);
    }
    v2() {
        return new V2_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9129:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, batchId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.batchId = batchId;
    }
    path(withParameter = true) {
        if (withParameter && this.batchId !== null) {
            return `${this._parent.path()}/batches/${this.batchId}`;
        }
        return `${this._parent.path()}/batches`;
    }
    /**
     * Returns the list of A2P batches sent from the current account.
     * The list can be filtered by message batch ID and/or from phone number.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/a2p-sms/batches
     * Rate Limit Group: Light
     * App Permission: A2PSMS
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Allows to send high volume of A2P (Application-to-Person) SMS messages
     * (in message batches). Only phone number with the `A2PSmsSender` feature can
     * be used as a sender.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/a2p-sms/batches
     * Rate Limit Group: Light
     * App Permission: A2PSMS
     */
    async post(messageBatchCreateRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), messageBatchCreateRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns information on a message batch.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/a2p-sms/batches/{batchId}
     * Rate Limit Group: Light
     * App Permission: A2PSMS
     */
    async get(restRequestConfig) {
        if (this.batchId === null) {
            throw new Error('batchId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 798:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, messageId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.messageId = messageId;
    }
    path(withParameter = true) {
        if (withParameter && this.messageId !== null) {
            return `${this._parent.path()}/messages/${this.messageId}`;
        }
        return `${this._parent.path()}/messages`;
    }
    /**
     * Returns the list of outbound/inbound A2P messages sent from/to A2P phone numbers of the current account. The list can be filtered by message batch ID and/or phone number.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/a2p-sms/messages
     * Rate Limit Group: Light
     * App Permission: A2PSMS
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the details of an A2P SMS message by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/a2p-sms/messages/{messageId}
     * Rate Limit Group: Light
     * App Permission: A2PSMS
     */
    async get(restRequestConfig) {
        if (this.messageId === null) {
            throw new Error('messageId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3534:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Adds multiple opt-outs and/or opt-ins for the specified sender number and a set of recipient numbers.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/a2p-sms/opt-outs/bulk-assign
     * Rate Limit Group: Light
     * App Permission: A2PSMS
     */
    async post(optOutBulkAssignRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), optOutBulkAssignRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 986:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAssign_1 = __importDefault(__webpack_require__(3534));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/opt-outs`;
    }
    /**
     * Returns the list of numbers opted out from the account. The list can be filtered by `to`/`from` phone number query parameters. Specifying `text/csv` in the Accept header downloads the data in CSV format.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/a2p-sms/opt-outs
     * Rate Limit Group: Light
     * App Permission: A2PSMS
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8636:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/statuses`;
    }
    /**
     * Retrieves a set of message counts by message status and error codes filtered by dates, batchId and message direction.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/a2p-sms/statuses
     * Rate Limit Group: Light
     * App Permission: A2PSMS
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2285:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const OptOuts_1 = __importDefault(__webpack_require__(986));
const Statuses_1 = __importDefault(__webpack_require__(8636));
const Messages_1 = __importDefault(__webpack_require__(798));
const Batches_1 = __importDefault(__webpack_require__(9129));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/a2p-sms`;
    }
    batches(batchId = null) {
        return new Batches_1.default(this, batchId);
    }
    messages(messageId = null) {
        return new Messages_1.default(this, messageId);
    }
    statuses() {
        return new Statuses_1.default(this);
    }
    optOuts() {
        return new OptOuts_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5166:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/active-calls`;
    }
    /**
     * Returns records of all calls that are in progress, ordered by start time in descending order.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/active-calls
     * Rate Limit Group: Heavy
     * App Permission: ReadCallLog
     * User Permission: ReadCallLog
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5040:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, taskId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.taskId = taskId;
    }
    path(withParameter = true) {
        if (withParameter && this.taskId !== null) {
            return `${this._parent.path()}/tasks/${this.taskId}`;
        }
        return `${this._parent.path()}/tasks`;
    }
    /**
     * Returns the status of a task on adding multiple contacts to multiple extensions.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/address-book-bulk-upload/tasks/{taskId}
     * Rate Limit Group: Light
     * App Permission: Contacts
     * User Permission: EditPersonalContacts
     */
    async get(restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4685:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Tasks_1 = __importDefault(__webpack_require__(5040));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/address-book-bulk-upload`;
    }
    /**
     * Uploads multiple contacts for multiple extensions at once.
     * Maximum 500 extensions can be uploaded per request. Max amount
     * of contacts that can be uploaded per extension is 10,000.
     * Each contact uploaded for a certain extension is not visible
     * to other extensions.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/address-book-bulk-upload
     * Rate Limit Group: Heavy
     * App Permission: Contacts
     * User Permission: EditPersonalContacts
     */
    async post(addressBookBulkUploadRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), addressBookBulkUploadRequest, undefined, restRequestConfig);
        return r.data;
    }
    tasks(taskId = null) {
        return new Tasks_1.default(this, taskId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9529:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, ruleId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.ruleId = ruleId;
    }
    path(withParameter = true) {
        if (withParameter && this.ruleId !== null) {
            return `${this._parent.path()}/answering-rule/${this.ruleId}`;
        }
        return `${this._parent.path()}/answering-rule`;
    }
    /**
     * Returns a list of company call handling rules.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/answering-rule
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyAnsweringRules
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates call handling rule on account level.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/answering-rule
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyAnsweringRules
     */
    async post(companyAnsweringRuleRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), companyAnsweringRuleRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a company call handling rule by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/answering-rule/{ruleId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyAnsweringRules
     */
    async get(restRequestConfig) {
        if (this.ruleId === null) {
            throw new Error('ruleId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a company call handling rule.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/answering-rule/{ruleId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyAnsweringRules
     */
    async put(companyAnsweringRuleUpdate, restRequestConfig) {
        if (this.ruleId === null) {
            throw new Error('ruleId must be specified.');
        }
        const r = await this.rc.put(this.path(), companyAnsweringRuleUpdate, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a company custom call handling rule by a particular ID.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/answering-rule/{ruleId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyAnsweringRules
     */
    async delete(restRequestConfig) {
        if (this.ruleId === null) {
            throw new Error('ruleId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 503:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/assigned-role`;
    }
    /**
     * Returns a list of roles assigned to the current account.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/assigned-role
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadAssignedRoles
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5099:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/search`;
    }
    /**
     * Returns the audit trail data with specific filters applied.
     * Audit trail searching is limited to the last 10,000 records or last 180 days, whichever comes first.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/audit-trail/search
     * Rate Limit Group: Heavy
     * App Permission: ReadAuditTrail
     */
    async post(accountHistorySearchPublicRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), accountHistorySearchPublicRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 54:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Search_1 = __importDefault(__webpack_require__(5099));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/audit-trail`;
    }
    search() {
        return new Search_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4976:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/business-address`;
    }
    /**
     * Returns business address of a company.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/business-address
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the business address of a company that account is linked
     * to.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/business-address
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyInfo
     */
    async put(modifyAccountBusinessAddressRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), modifyAccountBusinessAddressRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3864:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/business-hours`;
    }
    /**
     * Returns the company business hours schedule. Business hours (and After hours - all the remaining time) schedules are commonly used for setting call handling rules - `business-hours-rule` and `after-hours-rule` correspondingly.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/business-hours
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyAnsweringRules
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the company business hours schedule.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/business-hours
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserAnsweringRules
     */
    async put(companyBusinessHoursUpdateRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), companyBusinessHoursUpdateRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 979:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, callRecordId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.callRecordId = callRecordId;
    }
    path(withParameter = true) {
        if (withParameter && this.callRecordId !== null) {
            return `${this._parent.path()}/call-log/${this.callRecordId}`;
        }
        return `${this._parent.path()}/call-log`;
    }
    /**
     * Returns call log records filtered by parameters specified.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-log
     * Rate Limit Group: Heavy
     * App Permission: ReadCallLog
     * User Permission: FullCompanyCallLog
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns individual call log record(s) by ID. Batch syntax is supported.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-log/{callRecordId}
     * Rate Limit Group: Heavy
     * App Permission: ReadCallLog
     * User Permission: FullCompanyCallLog
     */
    async get(queryParams, restRequestConfig) {
        if (this.callRecordId === null) {
            throw new Error('callRecordId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4136:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/call-log-sync`;
    }
    /**
     * Synchronizes company call log records.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-log-sync
     * Rate Limit Group: Heavy
     * App Permission: ReadCallLog
     * User Permission: ReadCallLog
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2595:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Updates a list of call monitoring groups.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-monitoring-groups/{groupId}/bulk-assign
     * Rate Limit Group: Heavy
     * App Permission: EditExtensions
     * User Permission: Groups
     */
    async post(callMonitoringBulkAssign, restRequestConfig) {
        const r = await this.rc.post(this.path(), callMonitoringBulkAssign, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 533:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/members`;
    }
    /**
     * Returns a list of members for a call monitoring group specified in path.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-monitoring-groups/{groupId}/members
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4977:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAssign_1 = __importDefault(__webpack_require__(2595));
const Members_1 = __importDefault(__webpack_require__(533));
class Index {
    constructor(_parent, groupId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.groupId = groupId;
    }
    path(withParameter = true) {
        if (withParameter && this.groupId !== null) {
            return `${this._parent.path()}/call-monitoring-groups/${this.groupId}`;
        }
        return `${this._parent.path()}/call-monitoring-groups`;
    }
    /**
     * Returns a list of call monitoring groups filtered by an extension.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-monitoring-groups
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new call monitoring group.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-monitoring-groups
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: Groups
     */
    async post(createCallMonitoringGroupRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createCallMonitoringGroupRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a call monitoring group name.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-monitoring-groups/{groupId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: Groups
     */
    async put(createCallMonitoringGroupRequest, restRequestConfig) {
        if (this.groupId === null) {
            throw new Error('groupId must be specified.');
        }
        const r = await this.rc.put(this.path(), createCallMonitoringGroupRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Removes information about a call monitoring group specified in path.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-monitoring-groups/{groupId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: Groups
     */
    async delete(restRequestConfig) {
        if (this.groupId === null) {
            throw new Error('groupId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    members() {
        return new Members_1.default(this);
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7805:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Assigns multiple call queue members to call queue group.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-queues/{groupId}/bulk-assign
     * Rate Limit Group: Heavy
     * App Permission: EditExtensions
     * User Permission: Groups
     */
    async post(callQueueBulkAssignResource, restRequestConfig) {
        const r = await this.rc.post(this.path(), callQueueBulkAssignResource, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5831:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/members`;
    }
    /**
     * Returns a list of call queue group members.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-queues/{groupId}/members
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2365:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/presence`;
    }
    /**
     * Returns presence status of the call queue members.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-queues/{groupId}/presence
     * Rate Limit Group: Light
     * App Permission: ReadPresence
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates presence status of the call queue members in the specified queue.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-queues/{groupId}/presence
     * Rate Limit Group: Medium
     * App Permission: EditPresence
     */
    async put(callQueueUpdatePresence, restRequestConfig) {
        const r = await this.rc.put(this.path(), callQueueUpdatePresence, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7667:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAssign_1 = __importDefault(__webpack_require__(7805));
const Presence_1 = __importDefault(__webpack_require__(2365));
const Members_1 = __importDefault(__webpack_require__(5831));
class Index {
    constructor(_parent, groupId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.groupId = groupId;
    }
    path(withParameter = true) {
        if (withParameter && this.groupId !== null) {
            return `${this._parent.path()}/call-queues/${this.groupId}`;
        }
        return `${this._parent.path()}/call-queues`;
    }
    /**
     * Returns a call queue list.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-queues
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns basic information on a call queue group extension.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-queues/{groupId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(restRequestConfig) {
        if (this.groupId === null) {
            throw new Error('groupId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates information on a call queue group extension.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-queues/{groupId}
     * Rate Limit Group: Light
     * App Permission: EditExtensions
     * User Permission: EditUserInfo
     */
    async put(callQueueDetails, restRequestConfig) {
        if (this.groupId === null) {
            throw new Error('groupId must be specified.');
        }
        const r = await this.rc.put(this.path(), callQueueDetails, undefined, restRequestConfig);
        return r.data;
    }
    members() {
        return new Members_1.default(this);
    }
    presence() {
        return new Presence_1.default(this);
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 826:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Creates or updates the list of extensions to be recorded.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-recording/bulk-assign
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async post(bulkAccountCallRecordingsResource, restRequestConfig) {
        const r = await this.rc.post(this.path(), bulkAccountCallRecordingsResource, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, greetingId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.greetingId = greetingId;
    }
    path(withParameter = true) {
        if (withParameter && this.greetingId !== null) {
            return `${this._parent.path()}/custom-greetings/${this.greetingId}`;
        }
        return `${this._parent.path()}/custom-greetings`;
    }
    /**
     * Returns call recording custom greetings.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-recording/custom-greetings
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes call recording custom greetings.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-recording/custom-greetings
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyInfo
     */
    async deleteAll(restRequestConfig) {
        const r = await this.rc.delete(this.path(false), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes call recording custom greeting(s).
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-recording/custom-greetings/{greetingId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyInfo
     */
    async delete(restRequestConfig) {
        if (this.greetingId === null) {
            throw new Error('greetingId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1721:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/extensions`;
    }
    /**
     * Returns the list of extensions to be recorded.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-recording/extensions
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 454:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const CustomGreetings_1 = __importDefault(__webpack_require__(8));
const BulkAssign_1 = __importDefault(__webpack_require__(826));
const Extensions_1 = __importDefault(__webpack_require__(1721));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/call-recording`;
    }
    /**
     * Returns call recording settings.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-recording
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates current call recording settings.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-recording
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyInfo
     */
    async put(callRecordingSettingsResource, restRequestConfig) {
        const r = await this.rc.put(this.path(), callRecordingSettingsResource, undefined, restRequestConfig);
        return r.data;
    }
    extensions() {
        return new Extensions_1.default(this);
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
    customGreetings(greetingId = null) {
        return new CustomGreetings_1.default(this, greetingId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7695:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/call-recordings`;
    }
    /**
     * Deletes company call recordings by their IDs.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/call-recordings
     * Rate Limit Group: Heavy
     * App Permission: EditCallLog
     * User Permission: EditCompanyCallRecordings
     */
    async delete(callRecordingIds, restRequestConfig) {
        const r = await this.rc.delete(this.path(), callRecordingIds, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 337:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, fieldId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.fieldId = fieldId;
    }
    path(withParameter = true) {
        if (withParameter && this.fieldId !== null) {
            return `${this._parent.path()}/custom-fields/${this.fieldId}`;
        }
        return `${this._parent.path()}/custom-fields`;
    }
    /**
     * Returns the list of created custom fields.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/custom-fields
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadUserInfo
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Creates custom field attached to the object.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/custom-fields
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: Users
     */
    async post(customFieldCreateRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), customFieldCreateRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates custom field by ID specified in path.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/custom-fields/{fieldId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: Users
     */
    async put(customFieldUpdateRequest, restRequestConfig) {
        if (this.fieldId === null) {
            throw new Error('fieldId must be specified.');
        }
        const r = await this.rc.put(this.path(), customFieldUpdateRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes custom field(s) by ID(s) with the corresponding values.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/custom-fields/{fieldId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: Users
     */
    async delete(restRequestConfig) {
        if (this.fieldId === null) {
            throw new Error('fieldId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7139:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/emergency`;
    }
    /**
     * Updates account device emergency information.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/device/{deviceId}/emergency
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyDevices
     */
    async put(accountDeviceUpdate, restRequestConfig) {
        const r = await this.rc.put(this.path(), accountDeviceUpdate, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9282:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/sip-info`;
    }
    /**
     * Returns device SIP information.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/device/{deviceId}/sip-info
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyDevices
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9141:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Emergency_1 = __importDefault(__webpack_require__(7139));
const SipInfo_1 = __importDefault(__webpack_require__(9282));
class Index {
    constructor(_parent, deviceId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.deviceId = deviceId;
    }
    path(withParameter = true) {
        if (withParameter && this.deviceId !== null) {
            return `${this._parent.path()}/device/${this.deviceId}`;
        }
        return `${this._parent.path()}/device`;
    }
    /**
     * Returns account device(s) by their ID(s).
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/device/{deviceId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyDevices
     */
    async get(queryParams, restRequestConfig) {
        if (this.deviceId === null) {
            throw new Error('deviceId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates account device(s) by their ID(s).
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/device/{deviceId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyDevices
     */
    async put(accountDeviceUpdate, queryParams, restRequestConfig) {
        if (this.deviceId === null) {
            throw new Error('deviceId must be specified.');
        }
        const r = await this.rc.put(this.path(), accountDeviceUpdate, queryParams, restRequestConfig);
        return r.data;
    }
    sipInfo() {
        return new SipInfo_1.default(this);
    }
    emergency() {
        return new Emergency_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 126:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/search`;
    }
    /**
     * Returns contact information on corporate users of federated accounts according to the specified filtering and ordering.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/directory/entries/search
     * Rate Limit Group: Heavy
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async post(searchDirectoryEntriesRequest, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), searchDirectoryEntriesRequest, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5873:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Search_1 = __importDefault(__webpack_require__(126));
class Index {
    constructor(_parent, entryId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.entryId = entryId;
    }
    path(withParameter = true) {
        if (withParameter && this.entryId !== null) {
            return `${this._parent.path()}/entries/${this.entryId}`;
        }
        return `${this._parent.path()}/entries`;
    }
    /**
     * Returns contact information on corporate users of federated accounts. Please note: 1. `User`, `DigitalUser`, `VirtualUser` and `FaxUser` types are returned as `User` type. 2. `ApplicationExtension` type is not returned. 3. Only extensions in `Enabled`, `Disabled` and `NotActivated` state are returned.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/directory/entries
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns contact information on a particular corporate user of a federated account.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/directory/entries/{entryId}
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     */
    async get(restRequestConfig) {
        if (this.entryId === null) {
            throw new Error('entryId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    search() {
        return new Search_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4182:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/federation`;
    }
    /**
     * Returns information on a federation and associated accounts.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/directory/federation
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8514:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Federation_1 = __importDefault(__webpack_require__(4182));
const Entries_1 = __importDefault(__webpack_require__(5873));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/directory`;
    }
    entries(entryId = null) {
        return new Entries_1.default(this, entryId);
    }
    federation() {
        return new Federation_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1510:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Enables or disables Automatic Location Updates feature for the
     * specified common phones.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/devices/bulk-assign
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(assignMultipleDevicesAutomaticLocationUpdates, restRequestConfig) {
        const r = await this.rc.post(this.path(), assignMultipleDevicesAutomaticLocationUpdates, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6978:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAssign_1 = __importDefault(__webpack_require__(1510));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/devices`;
    }
    /**
     * Returns a list of common devices with their status of Automatic
     * Location Updates feature.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/devices
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1136:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, networkId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.networkId = networkId;
    }
    path(withParameter = true) {
        if (withParameter && this.networkId !== null) {
            return `${this._parent.path()}/networks/${this.networkId}`;
        }
        return `${this._parent.path()}/networks`;
    }
    /**
     * Returns a corporate network map with emergency addresses assigned
     * to the current account.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/networks
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new network in a corporate ethernet map for assignment
     * of emergency addresses to network access points.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/networks
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(createNetworkRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createNetworkRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the specified network with emergency addresses assigned
     * to the current account.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/networks/{networkId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async get(restRequestConfig) {
        if (this.networkId === null) {
            throw new Error('networkId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a network in a corporate ethernet map for assignment of emergency
     * addresses to network access points.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/networks/{networkId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async put(updateNetworkRequest, restRequestConfig) {
        if (this.networkId === null) {
            throw new Error('networkId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateNetworkRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes network(s) in a corporate ethernet map for Automatic Location
     * Updates feature.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/networks/{networkId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async delete(restRequestConfig) {
        if (this.networkId === null) {
            throw new Error('networkId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2719:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, switchId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.switchId = switchId;
    }
    path(withParameter = true) {
        if (withParameter && this.switchId !== null) {
            return `${this._parent.path()}/switches/${this.switchId}`;
        }
        return `${this._parent.path()}/switches`;
    }
    /**
     * Returns a corporate map of configured network switches with the assigned
     * emergency addresses for the logged-in account.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/switches
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new switch in corporate map based on chassis ID and used
     * for Automatic Locations Update feature.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/switches
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(createSwitchInfo, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createSwitchInfo, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the specified switch with the assigned emergency address.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/switches/{switchId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async get(restRequestConfig) {
        if (this.switchId === null) {
            throw new Error('switchId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates switch. Partial update is not supported, all switch parameters
     * should be specified. If null value is received or parameter is missing, its
     * value is removed.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/switches/{switchId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async put(updateSwitchInfo, restRequestConfig) {
        if (this.switchId === null) {
            throw new Error('switchId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateSwitchInfo, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes wireless switch(es) in a network configuration for Automatic
     * Location Updates feature.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/switches/{switchId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async delete(restRequestConfig) {
        if (this.switchId === null) {
            throw new Error('switchId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7031:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/switches-bulk-create`;
    }
    /**
     * Creates multiple switches in corporate map. The maximum number
     * of switches per request is 10 000; limitation for account is 10 000.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/switches-bulk-create
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(createMultipleSwitchesRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), createMultipleSwitchesRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7534:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/switches-bulk-update`;
    }
    /**
     * Updates multiple switches in corporate map. The maximum number
     * of switches per request is 10 000; limitation for account is 10 000.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/switches-bulk-update
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(updateMultipleSwitchesRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), updateMultipleSwitchesRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3493:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/switches-bulk-validate`;
    }
    /**
     * Validates switches before creation or update. The maximum number
     * of switches per request is 10 000.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/switches-bulk-validate
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(validateMultipleSwitchesRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), validateMultipleSwitchesRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 679:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, taskId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.taskId = taskId;
    }
    path(withParameter = true) {
        if (withParameter && this.taskId !== null) {
            return `${this._parent.path()}/tasks/${this.taskId}`;
        }
        return `${this._parent.path()}/tasks`;
    }
    /**
     * Returns results of the task created within the frame of Automatic
     * Location Updates feature. Currently four task types are supported: 'Wireless
     * Points Bulk Create', 'Wireless Points Bulk Update', 'Switches Bulk Create',
     * 'Switches Bulk Update'.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/tasks/{taskId}
     * Rate Limit Group: Light
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async get(restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 131:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Enables or disables Automatic Location Updates feature for multiple
     * account users.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/users/bulk-assign
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(emergencyAddressAutoUpdateUsersBulkAssignResource, restRequestConfig) {
        const r = await this.rc.post(this.path(), emergencyAddressAutoUpdateUsersBulkAssignResource, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1745:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAssign_1 = __importDefault(__webpack_require__(131));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/users`;
    }
    /**
     * Returns a list of users with their status of Automatic Location
     * Updates feature.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/users
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7052:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, pointId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.pointId = pointId;
    }
    path(withParameter = true) {
        if (withParameter && this.pointId !== null) {
            return `${this._parent.path()}/wireless-points/${this.pointId}`;
        }
        return `${this._parent.path()}/wireless-points`;
    }
    /**
     * Returns account wireless points configured and used for Automatic
     * Location Updates feature.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/wireless-points
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new wireless point in network configuration with the
     * emergency address assigned.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/wireless-points
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(createWirelessPoint, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createWirelessPoint, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the specified wireless access point of a corporate map
     * with the emergency address assigned.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/wireless-points/{pointId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async get(restRequestConfig) {
        if (this.pointId === null) {
            throw new Error('pointId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the specified wireless access point of a corporate map
     * by ID.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/wireless-points/{pointId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async put(updateWirelessPoint, restRequestConfig) {
        if (this.pointId === null) {
            throw new Error('pointId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateWirelessPoint, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes wireless point(s) of a corporate map by ID(s).
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/wireless-points/{pointId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async delete(restRequestConfig) {
        if (this.pointId === null) {
            throw new Error('pointId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2004:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/wireless-points-bulk-create`;
    }
    /**
     * Creates multiple wireless points in a corporate map. The maximum
     * number of wireless points per request is 10 000; limitation for account is
     * 70 000.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/wireless-points-bulk-create
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(createMultipleWirelessPointsRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), createMultipleWirelessPointsRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5777:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/wireless-points-bulk-update`;
    }
    /**
     * Updates wireless points in corporate map. The maximum number of
     * wireless points per request is 10 000; limitation for account is 70 000.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/wireless-points-bulk-update
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(updateMultipleWirelessPointsRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), updateMultipleWirelessPointsRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7818:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/wireless-points-bulk-validate`;
    }
    /**
     * Validates wireless points before creation or update. The maximum
     * number of wireless points per request is 10 000.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-address-auto-update/wireless-points-bulk-validate
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(validateMultipleWirelessPointsRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), validateMultipleWirelessPointsRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3658:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const WirelessPointsBulkValidate_1 = __importDefault(__webpack_require__(7818));
const WirelessPointsBulkUpdate_1 = __importDefault(__webpack_require__(5777));
const WirelessPointsBulkCreate_1 = __importDefault(__webpack_require__(2004));
const SwitchesBulkValidate_1 = __importDefault(__webpack_require__(3493));
const SwitchesBulkUpdate_1 = __importDefault(__webpack_require__(7534));
const SwitchesBulkCreate_1 = __importDefault(__webpack_require__(7031));
const WirelessPoints_1 = __importDefault(__webpack_require__(7052));
const Switches_1 = __importDefault(__webpack_require__(2719));
const Networks_1 = __importDefault(__webpack_require__(1136));
const Devices_1 = __importDefault(__webpack_require__(6978));
const Users_1 = __importDefault(__webpack_require__(1745));
const Tasks_1 = __importDefault(__webpack_require__(679));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/emergency-address-auto-update`;
    }
    tasks(taskId = null) {
        return new Tasks_1.default(this, taskId);
    }
    users() {
        return new Users_1.default(this);
    }
    devices() {
        return new Devices_1.default(this);
    }
    networks(networkId = null) {
        return new Networks_1.default(this, networkId);
    }
    switches(switchId = null) {
        return new Switches_1.default(this, switchId);
    }
    wirelessPoints(pointId = null) {
        return new WirelessPoints_1.default(this, pointId);
    }
    switchesBulkCreate() {
        return new SwitchesBulkCreate_1.default(this);
    }
    switchesBulkUpdate() {
        return new SwitchesBulkUpdate_1.default(this);
    }
    switchesBulkValidate() {
        return new SwitchesBulkValidate_1.default(this);
    }
    wirelessPointsBulkCreate() {
        return new WirelessPointsBulkCreate_1.default(this);
    }
    wirelessPointsBulkUpdate() {
        return new WirelessPointsBulkUpdate_1.default(this);
    }
    wirelessPointsBulkValidate() {
        return new WirelessPointsBulkValidate_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7684:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, locationId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.locationId = locationId;
    }
    path(withParameter = true) {
        if (withParameter && this.locationId !== null) {
            return `${this._parent.path()}/emergency-locations/${this.locationId}`;
        }
        return `${this._parent.path()}/emergency-locations`;
    }
    /**
     * Returns emergency response locations for the current account.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-locations
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new emergency response location for a company.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-locations
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async post(emergencyLocationInfoRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), emergencyLocationInfoRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns emergency response location by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-locations/{locationId}
     * Rate Limit Group: Light
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async get(queryParams, restRequestConfig) {
        if (this.locationId === null) {
            throw new Error('locationId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the specified emergency response location.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-locations/{locationId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async put(emergencyLocationInfoRequest, restRequestConfig) {
        if (this.locationId === null) {
            throw new Error('locationId must be specified.');
        }
        const r = await this.rc.put(this.path(), emergencyLocationInfoRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes the specified emergency response location.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/emergency-locations/{locationId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: ConfigureEmergencyMaps
     */
    async delete(queryParams, restRequestConfig) {
        if (this.locationId === null) {
            throw new Error('locationId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1116:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/active-calls`;
    }
    /**
     * Returns records of all extension calls that are in progress, ordered
     * by start time in descending order.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/active-calls
     * Rate Limit Group: Heavy
     * App Permission: ReadCallLog
     * User Permission: ReadCallLog
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 293:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, contactId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.contactId = contactId;
    }
    path(withParameter = true) {
        if (withParameter && this.contactId !== null) {
            return `${this._parent.path()}/contact/${this.contactId}`;
        }
        return `${this._parent.path()}/contact`;
    }
    /**
     * Returns the user personal contacts.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/address-book/contact
     * Rate Limit Group: Heavy
     * App Permission: ReadContacts
     * User Permission: ReadPersonalContacts
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates the user personal contact.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/address-book/contact
     * Rate Limit Group: Heavy
     * App Permission: Contacts
     * User Permission: EditPersonalContacts
     */
    async post(personalContactRequest, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(false), personalContactRequest, queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the user personal contact(s).
     * [Batch request syntax](https://developers.ringcentral.com/api-reference/Batch-Requests) is supported.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/address-book/contact/{contactId}
     * Rate Limit Group: Heavy
     * App Permission: ReadContacts
     * User Permission: ReadPersonalContacts
     */
    async get(restRequestConfig) {
        if (this.contactId === null) {
            throw new Error('contactId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the user personal contact(s) (full resource update).
     * [Batch request syntax](https://developers.ringcentral.com/api-reference/Batch-Requests) is supported.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/address-book/contact/{contactId}
     * Rate Limit Group: Heavy
     * App Permission: Contacts
     * User Permission: EditPersonalContacts
     */
    async put(personalContactRequest, queryParams, restRequestConfig) {
        if (this.contactId === null) {
            throw new Error('contactId must be specified.');
        }
        const r = await this.rc.put(this.path(), personalContactRequest, queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes the user personal contact(s).
     * [Batch request syntax](https://developers.ringcentral.com/api-reference/Batch-Requests) is supported.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/address-book/contact/{contactId}
     * Rate Limit Group: Heavy
     * App Permission: Contacts
     * User Permission: EditPersonalContacts
     */
    async delete(restRequestConfig) {
        if (this.contactId === null) {
            throw new Error('contactId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates particular values of a personal contact attributes specified in request (partial resource update). Omitted attributes will remain unchanged.
     * If any attribute is passed in request body with the null value, then this attribute value will be removed.
     *
     * HTTP Method: patch
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/address-book/contact/{contactId}
     * Rate Limit Group: Heavy
     * App Permission: Contacts
     * User Permission: EditPersonalContacts
     */
    async patch(personalContactRequest, queryParams, restRequestConfig) {
        if (this.contactId === null) {
            throw new Error('contactId must be specified.');
        }
        const r = await this.rc.patch(this.path(), personalContactRequest, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1114:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Contact_1 = __importDefault(__webpack_require__(293));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/address-book`;
    }
    contact(contactId = null) {
        return new Contact_1.default(this, contactId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8765:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/address-book-sync`;
    }
    /**
     * Synchronizes user contacts.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/address-book-sync
     * Rate Limit Group: Heavy
     * App Permission: ReadContacts
     * User Permission: ReadPersonalContacts
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4350:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/administered-sites`;
    }
    /**
     * Returns a list of sites administered by the current user.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/administered-sites
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the sites administered by the current user.
     * Please note: Only IDs of records are used for update.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/administered-sites
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditAssignedRoles
     */
    async put(businessSiteCollectionRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), businessSiteCollectionRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 803:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, ruleId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.ruleId = ruleId;
    }
    path(withParameter = true) {
        if (withParameter && this.ruleId !== null) {
            return `${this._parent.path()}/answering-rule/${this.ruleId}`;
        }
        return `${this._parent.path()}/answering-rule`;
    }
    /**
     * Returns call handling rules of an extension.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/answering-rule
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadUserAnsweringRules
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a custom call handling rule for a particular caller ID.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/answering-rule
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserAnsweringRules
     */
    async post(createAnsweringRuleRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createAnsweringRuleRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a call handling rule by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/answering-rule/{ruleId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadUserAnsweringRules
     */
    async get(queryParams, restRequestConfig) {
        if (this.ruleId === null) {
            throw new Error('ruleId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a custom call handling rule for a particular caller ID.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/answering-rule/{ruleId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserAnsweringRules
     */
    async put(updateAnsweringRuleRequest, restRequestConfig) {
        if (this.ruleId === null) {
            throw new Error('ruleId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateAnsweringRuleRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a custom call handling rule by a particular ID.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/answering-rule/{ruleId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserAnsweringRules
     */
    async delete(restRequestConfig) {
        if (this.ruleId === null) {
            throw new Error('ruleId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9733:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/assignable-roles`;
    }
    /**
     * Returns a list of roles which can be assigned to a given extension.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/assignable-roles
     * Rate Limit Group: Medium
     * App Permission: RoleManagement
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2851:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/default`;
    }
    /**
     * Assigns the default role to the currently logged-in user extension.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/assigned-role/default
     * Rate Limit Group: Medium
     * App Permission: RoleManagement
     * User Permission: Users
     */
    async put(restRequestConfig) {
        const r = await this.rc.put(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5113:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Default_1 = __importDefault(__webpack_require__(2851));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/assigned-role`;
    }
    /**
     * Returns a list of roles assigned to the current extension.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/assigned-role
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a list of roles assigned to the current user.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/assigned-role
     * Rate Limit Group: Medium
     * App Permission: RoleManagement
     * User Permission: EditAssignedRoles
     */
    async put(assignedRolesResource, restRequestConfig) {
        const r = await this.rc.put(this.path(), assignedRolesResource, undefined, restRequestConfig);
        return r.data;
    }
    default() {
        return new Default_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1419:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/check`;
    }
    /**
     * Checks if a certain user permission is activated for a particular extension.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/authz-profile/check
     * Rate Limit Group: Light
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3088:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Check_1 = __importDefault(__webpack_require__(1419));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/authz-profile`;
    }
    /**
     * Returns a list of user permissions granted at authorization procedure.
     * Please note: Some permissions may be restricted by extension type.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/authz-profile
     * Rate Limit Group: Medium
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    check() {
        return new Check_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8422:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/business-hours`;
    }
    /**
     * Returns the user business hours schedule. Business hours (and After hours - all the remaining time) schedules are commonly used for setting call handling rules - `business-hours-rule` and `after-hours-rule` correspondingly. **Please note:** If the user business hours are set to 'Custom hours' then a particular schedule is returned; however if set to '24 hours/7 days a week' the schedule will be empty.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/business-hours
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the user business hours schedule.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/business-hours
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserAnsweringRules
     */
    async put(userBusinessHoursUpdateRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), userBusinessHoursUpdateRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9085:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, callRecordId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.callRecordId = callRecordId;
    }
    path(withParameter = true) {
        if (withParameter && this.callRecordId !== null) {
            return `${this._parent.path()}/call-log/${this.callRecordId}`;
        }
        return `${this._parent.path()}/call-log`;
    }
    /**
     * Returns call log records filtered by parameters specified.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/call-log
     * Rate Limit Group: Heavy
     * App Permission: ReadCallLog
     * User Permission: ReadCallLog
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes filtered call log records.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/call-log
     * Rate Limit Group: Heavy
     * App Permission: EditCallLog
     * User Permission: EditCallLog
     */
    async delete(queryParams, restRequestConfig) {
        const r = await this.rc.delete(this.path(false), {}, queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns call log records by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/call-log/{callRecordId}
     * Rate Limit Group: Heavy
     * App Permission: ReadCallLog
     * User Permission: ReadCallLog
     */
    async get(queryParams, restRequestConfig) {
        if (this.callRecordId === null) {
            throw new Error('callRecordId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7782:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/call-log-sync`;
    }
    /**
     * Synchronizes the user call log records.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/call-log-sync
     * Rate Limit Group: Heavy
     * App Permission: ReadCallLog
     * User Permission: ReadCallLog
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2617:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/call-queue-presence`;
    }
    /**
     * Returns a list of agent's call queues with the agent presence status (per queue).
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/call-queue-presence
     * Rate Limit Group: Light
     * App Permission: ReadPresence
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates availability of the agent for the call queues.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/call-queue-presence
     * Rate Limit Group: Medium
     * App Permission: EditPresence
     */
    async put(extensionCallQueueUpdatePresenceList, restRequestConfig) {
        const r = await this.rc.put(this.path(), extensionCallQueueUpdatePresenceList, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8173:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/call-queues`;
    }
    /**
     * Updates a list of call queues where the user is an agent. This
     * is a full update request, which means that if any call queue where the user is
     * an agent is not mentioned in request, then the user is automatically removed
     * from this queue.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/call-queues
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCallQueuePresence
     */
    async put(userCallQueues, restRequestConfig) {
        const r = await this.rc.put(this.path(), userCallQueues, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6068:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, blockedNumberId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.blockedNumberId = blockedNumberId;
    }
    path(withParameter = true) {
        if (withParameter && this.blockedNumberId !== null) {
            return `${this._parent.path()}/phone-numbers/${this.blockedNumberId}`;
        }
        return `${this._parent.path()}/phone-numbers`;
    }
    /**
     * Returns the lists of blocked and allowed phone numbers.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-blocking/phone-numbers
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadBlockedNumbers
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates either blocked or allowed phone number list with a new phone number.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-blocking/phone-numbers
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditBlockedNumbers
     */
    async post(addBlockedAllowedPhoneNumber, restRequestConfig) {
        const r = await this.rc.post(this.path(false), addBlockedAllowedPhoneNumber, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns blocked or allowed phone number(s) by their ID(s).
     * [Batch request syntax](https://developers.ringcentral.com/api-reference/Batch-Requests) is supported.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-blocking/phone-numbers/{blockedNumberId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadBlockedNumbers
     */
    async get(restRequestConfig) {
        if (this.blockedNumberId === null) {
            throw new Error('blockedNumberId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates blocked or allowed phone number(s) by their ID(s).
     * [Batch request syntax](https://developers.ringcentral.com/api-reference/Batch-Requests) is supported.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-blocking/phone-numbers/{blockedNumberId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditBlockedNumbers
     */
    async put(addBlockedAllowedPhoneNumber, restRequestConfig) {
        if (this.blockedNumberId === null) {
            throw new Error('blockedNumberId must be specified.');
        }
        const r = await this.rc.put(this.path(), addBlockedAllowedPhoneNumber, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes blocked or allowed phone number(s) by their ID(s). Batch request is supported.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-blocking/phone-numbers/{blockedNumberId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditBlockedNumbers
     */
    async delete(restRequestConfig) {
        if (this.blockedNumberId === null) {
            throw new Error('blockedNumberId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 329:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const PhoneNumbers_1 = __importDefault(__webpack_require__(6068));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/caller-blocking`;
    }
    /**
     * Returns the current caller blocking settings of a user.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-blocking
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadBlockedNumbers
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the current caller blocking settings of a user.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-blocking
     * Rate Limit Group: Light
     * App Permission: EditExtensions
     * User Permission: EditBlockedNumbers
     */
    async put(callerBlockingSettingsUpdate, restRequestConfig) {
        const r = await this.rc.put(this.path(), callerBlockingSettingsUpdate, undefined, restRequestConfig);
        return r.data;
    }
    phoneNumbers(blockedNumberId = null) {
        return new PhoneNumbers_1.default(this, blockedNumberId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5243:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/caller-id`;
    }
    /**
     * Returns information on an outbound caller ID of an extension.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-id
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCallerIDSettings
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates outbound caller ID information of an extension.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/caller-id
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditCallerIDSettings
     */
    async put(extensionCallerIdInfoRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), extensionCallerIdInfoRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9331:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/company-pager`;
    }
    /**
     * Creates and sends an internal text message (company pager message).
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/company-pager
     * Rate Limit Group: Medium
     * App Permission: InternalMessages
     * User Permission: InternalSMS
     */
    async post(createInternalTextMessageRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), createInternalTextMessageRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 492:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/conferencing`;
    }
    /**
     * Returns information on Free Conference Calling (FCC) feature
     * for a given extension.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/conferencing
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: OrganizeConference
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the default conferencing number for the current extension.
     * The number can be selected from conferencing numbers of the current extension.
     * Updates the setting, allowing participants join the conference before host.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/conferencing
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: OrganizeConference
     */
    async put(updateConferencingInfoRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), updateConferencingInfoRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4567:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/device`;
    }
    /**
     * Returns devices of an extension or multiple extensions by their ID(s). Batch request
     * is supported.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/device
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadUserDevices
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2858:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, locationId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.locationId = locationId;
    }
    path(withParameter = true) {
        if (withParameter && this.locationId !== null) {
            return `${this._parent.path()}/emergency-locations/${this.locationId}`;
        }
        return `${this._parent.path()}/emergency-locations`;
    }
    /**
     * Returns a list of emergency response locations available for the particular extension.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/emergency-locations
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a personal emergency response location for the current user.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/emergency-locations
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: EmergencyFramework
     */
    async post(createUserEmergencyLocationRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createUserEmergencyLocationRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a personal emergency response location for the current user.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/emergency-locations/{locationId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async get(restRequestConfig) {
        if (this.locationId === null) {
            throw new Error('locationId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a personal emergency response location by the current user or admin.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/emergency-locations/{locationId}
     * Rate Limit Group: Light
     * App Permission: EditAccounts
     * User Permission: EmergencyFramework
     */
    async put(emergencyLocationInfoRequest, restRequestConfig) {
        if (this.locationId === null) {
            throw new Error('locationId must be specified.');
        }
        const r = await this.rc.put(this.path(), emergencyLocationInfoRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a personal emergency response location by ID by
     * the current user or admin. Multiple personal emergency response
     * locations can be deleted by single API call.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/emergency-locations/{locationId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: EmergencyFramework
     */
    async delete(queryParams, restRequestConfig) {
        if (this.locationId === null) {
            throw new Error('locationId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1469:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/favorite`;
    }
    /**
     * Returns the list of favorite contacts of the current extension.
     * Favorite contacts include both company contacts (extensions) and personal
     * contacts (address book records).
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/favorite
     * Rate Limit Group: Light
     * App Permission: ReadContacts
     * User Permission: ReadPersonalContacts
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the list of favorite contacts of the current extension.
     * Favorite contacts include both company contacts (extensions) and personal
     * contacts (address book records).**Please note**: Currently personal address
     * book size is limited to 10 000 contacts.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/favorite
     * Rate Limit Group: Medium
     * App Permission: Contacts
     * User Permission: EditPersonalContacts
     */
    async put(favoriteCollection, restRequestConfig) {
        const r = await this.rc.put(this.path(), favoriteCollection, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5248:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Utils_1 = __importDefault(__webpack_require__(7097));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/fax`;
    }
    /**
     * Creates and sends/re-sends a fax message. Re-send can be implemented
     * if sending has failed. Fax attachment size (both single and total) is
     * limited to 50Mb.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/fax
     * Rate Limit Group: Heavy
     * App Permission: Faxes
     * User Permission: OutboundFaxes
     */
    async post(createFaxMessageRequest, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(createFaxMessageRequest);
        const r = await this.rc.post(this.path(), formData, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6246:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/features`;
    }
    /**
     * Returns a list of supported features and information on their
     * availability for the current extension. Specific feature(s) might
     * be checked by providing `featureId` query parameter. Multiple values
     * are supported in the format: `?featureId=Feature1&featureId=Feature2`.
     * To get only available features in order to decrease response size,
     * `availableOnly=true` query param might be specified. In case a feature
     * is available for the current user, `"available": true` is returned in
     * response for the record with the corresponding feature ID. Otherwise,
     * additional attribute `reason` is returned with the appropriate code:
     * - `ServicePlanLimitation` -  a feature is not included in account service plan;
     * - `AccountLimitation` - a feature is turned off for account;
     * - `ExtensionTypeLimitation` - a feature is not applicable for extension type;
     * - `ExtensionLimitation` - a feature is not available for extension, e.g., additional license required;
     * - `InsufficientPermissions` - required permission not granted to the current user (not the one, who is specified in the URL, but the one who's access token is used);
     * - `ConfigurationLimitation` - a feature is turned off for extension, e.g., by account administrator.
     *
     * Also, some features may have additional parameters, e.g., limits, which are returned in `params` attribute as a name-value collection:
     *
     *     {
     *       "id": "HUD",
     *       "available": true,
     *       "params": [
     *         {
     *           "name": "limitMax",
     *           "value": "100"
     *         }
     *       ]
     *     }
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/features
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1511:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, forwardingNumberId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.forwardingNumberId = forwardingNumberId;
    }
    path(withParameter = true) {
        if (withParameter && this.forwardingNumberId !== null) {
            return `${this._parent.path()}/forwarding-number/${this.forwardingNumberId}`;
        }
        return `${this._parent.path()}/forwarding-number`;
    }
    /**
     * Returns the list of extension phone numbers used for call forwarding
     * and call flip. The returned list contains all the extension phone numbers
     * used for call forwarding and call flip.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/forwarding-number
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadUserForwardingFlipNumbers
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Adds a new forwarding number to the forwarding number list.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/forwarding-number
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserForwardingFlipNumbers
     */
    async post(createForwardingNumberRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createForwardingNumberRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes multiple forwarding numbers from the forwarding number list by IDs.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/forwarding-number
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserForwardingFlipNumbers
     */
    async deleteAll(deleteForwardingNumbersRequest, restRequestConfig) {
        const r = await this.rc.delete(this.path(false), deleteForwardingNumbersRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a specific forwarding number.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/forwarding-number/{forwardingNumberId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadUserForwardingFlipNumbers
     */
    async get(restRequestConfig) {
        if (this.forwardingNumberId === null) {
            throw new Error('forwardingNumberId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the existing forwarding number from the forwarding number list.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/forwarding-number/{forwardingNumberId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserForwardingFlipNumbers
     */
    async put(updateForwardingNumberRequest, restRequestConfig) {
        if (this.forwardingNumberId === null) {
            throw new Error('forwardingNumberId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateForwardingNumberRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a forwarding number from the forwarding number list by its ID.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/forwarding-number/{forwardingNumberId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserForwardingFlipNumbers
     */
    async delete(restRequestConfig) {
        if (this.forwardingNumberId === null) {
            throw new Error('forwardingNumberId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3173:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/grant`;
    }
    /**
     * Returns the list of extensions with information on grants
     * given to the current extension regarding them. Currently the list of grants
     * include: picking up a call, monitoring, calling or receiving a call on behalf
     * of somebody, call delegation and calling paging groups.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/grant
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 268:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/content`;
    }
    /**
     * Returns extension-level greeting media contents.
     *
     * **This API must be called via media API entry point, e.g. https://media.ringcentral.com**
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/greeting/{greetingId}/content
     * Rate Limit Group: Heavy
     * App Permission: ReadAccounts
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, {
            ...restRequestConfig,
            responseType: 'arraybuffer',
        });
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1138:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Content_1 = __importDefault(__webpack_require__(268));
const Utils_1 = __importDefault(__webpack_require__(7097));
class Index {
    constructor(_parent, greetingId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.greetingId = greetingId;
    }
    path(withParameter = true) {
        if (withParameter && this.greetingId !== null) {
            return `${this._parent.path()}/greeting/${this.greetingId}`;
        }
        return `${this._parent.path()}/greeting`;
    }
    /**
     * Creates custom greeting for an extension user.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/greeting
     * Rate Limit Group: Heavy
     * App Permission: EditExtensions
     * User Permission: EditUserAnsweringRules
     */
    async post(createCustomUserGreetingRequest, queryParams, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(createCustomUserGreetingRequest);
        const r = await this.rc.post(this.path(false), formData, queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a custom user greeting by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/greeting/{greetingId}
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadUserInfo
     */
    async get(restRequestConfig) {
        if (this.greetingId === null) {
            throw new Error('greetingId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    content() {
        return new Content_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7723:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, attachmentId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.attachmentId = attachmentId;
    }
    path(withParameter = true) {
        if (withParameter && this.attachmentId !== null) {
            return `${this._parent.path()}/content/${this.attachmentId}`;
        }
        return `${this._parent.path()}/content`;
    }
    /**
     * Returns media content of a message attachment.
     * The content is typically an audio file (`audio/mpeg` or `audio/wav`) for voicemails,
     * TIFF or PDF for faxes and image/audio/video for MMS.
     *
     * **This API must be called via media API entry point, e.g. https://media.ringcentral.com**
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/message-store/{messageId}/content/{attachmentId}
     * Rate Limit Group: Medium
     * App Permission: ReadMessages
     */
    async get(queryParams, restRequestConfig) {
        if (this.attachmentId === null) {
            throw new Error('attachmentId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, {
            ...restRequestConfig,
            responseType: 'arraybuffer',
        });
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5813:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Content_1 = __importDefault(__webpack_require__(7723));
class Index {
    constructor(_parent, messageId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.messageId = messageId;
    }
    path(withParameter = true) {
        if (withParameter && this.messageId !== null) {
            return `${this._parent.path()}/message-store/${this.messageId}`;
        }
        return `${this._parent.path()}/message-store`;
    }
    /**
     * Returns a list of messages from an extension mailbox.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/message-store
     * Rate Limit Group: Light
     * App Permission: ReadMessages
     * User Permission: ReadMessages
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes conversation(s) by conversation ID(s). Batch request is
     * supported, max number of IDs passed as query/path parameters is 50. Alternative
     * syntax is supported - user conversations can be deleted by passing multiple
     * IDs in request body as an array of string, max number of conversation IDs
     * passed in request body is 100. In this case asterisk is used in the path instead
     * of IDs
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/message-store
     * Rate Limit Group: Medium
     * App Permission: EditMessages
     * User Permission: EditMessages
     */
    async deleteAll(queryParams, restRequestConfig) {
        const r = await this.rc.delete(this.path(false), {}, queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns an individual message record or multiple records by the given message ID(s).
     * The length of inbound messages is unlimited. Bulk syntax is supported.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/message-store/{messageId}
     * Rate Limit Group: Light
     * App Permission: ReadMessages
     * User Permission: ReadMessages
     */
    async get(restRequestConfig) {
        if (this.messageId === null) {
            throw new Error('messageId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates message(s) by their ID(s). Currently only message read status
     * can be updated through this method.
     *
     * Bulk syntax is supported, max number of IDs passed as query/path
     * parameters is 50. Alternative bulk syntax is also supported - user messages can be updated
     * by passing multiple IDs in request body as an array of string, max number
     * of IDs passed in the body is 1000. In this case asterisk is used in the
     * path instead of IDs.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/message-store/{messageId}
     * Rate Limit Group: Medium
     * App Permission: EditMessages
     * User Permission: EditMessages
     */
    async put(updateMessageRequest, restRequestConfig) {
        if (this.messageId === null) {
            throw new Error('messageId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateMessageRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes message(s) by the given message ID(s). The first call of
     * this method transfers the message to the 'Delete' status. The second call
     * transfers the deleted message to the 'Purged' status. If it is required to
     * make the message 'Purged' immediately (from the first call), then set the
     * query parameter purge to `true`.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/message-store/{messageId}
     * Rate Limit Group: Medium
     * App Permission: EditMessages
     * User Permission: EditMessages
     */
    async delete(deleteMessageBulkRequest, queryParams, restRequestConfig) {
        if (this.messageId === null) {
            throw new Error('messageId must be specified.');
        }
        const r = await this.rc.delete(this.path(), deleteMessageBulkRequest, queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Patches message(s) by ID(s). Currently only message read status update and
     * restoring deleted messages are supported through this method.
     *
     * For changing status of a message send `readStatus` set to either 'Read' or 'Unread' in request.
     * It is possible to restore a message and its attachments (if message status is 'Deleted') by sending
     * `availability` attribute set to 'Alive' in request body. If a message is already in 'Purged' state
     * then its attachments cannot be restored and the message itself is about to be physically deleted.
     *
     * Bulk syntax (both traditional and alternative one) is supported.
     *
     * HTTP Method: patch
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/message-store/{messageId}
     * Rate Limit Group: Medium
     * App Permission: EditMessages
     * User Permission: EditMessages
     */
    async patch(patchMessageRequest, restRequestConfig) {
        if (this.messageId === null) {
            throw new Error('messageId must be specified.');
        }
        const r = await this.rc.patch(this.path(), patchMessageRequest, undefined, restRequestConfig);
        return r.data;
    }
    content(attachmentId = null) {
        return new Content_1.default(this, attachmentId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 611:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/message-sync`;
    }
    /**
     * Synchronizes messages.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/message-sync
     * Rate Limit Group: Light
     * App Permission: ReadMessages
     * User Permission: ReadMessages
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9876:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Utils_1 = __importDefault(__webpack_require__(7097));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/mms`;
    }
    /**
     * Creates and sends a new media message or multiple messages. Sending MMS
     * messages simultaneously to different recipients is limited up to 50
     * requests per minute; relevant for all client applications.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/mms
     * Rate Limit Group: Medium
     * App Permission: SMS
     * User Permission: OutboundSMS
     */
    async post(createMMSMessage, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(createMMSMessage);
        const r = await this.rc.post(this.path(), formData, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8903:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/notification-settings`;
    }
    /**
     * Returns notification settings for the current extension.
     *
     * Knowledge Article: [User Settings - Set Up Message Notifications](https://success.ringcentral.com/articles/RC_Knowledge_Article/9740)
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/notification-settings
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadMessagesNotificationsSettings
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates notification settings for the current extension.
     * Knowledge Article: [User Settings - Set Up Message Notifications](https://success.ringcentral.com/articles/RC_Knowledge_Article/9740)
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/notification-settings
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditMessagesNotificationsSettings
     */
    async put(notificationSettingsUpdateRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), notificationSettingsUpdateRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3122:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/overflow-settings`;
    }
    /**
     * Returns overflow settings for a call queue specified in path.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{callQueueId}/overflow-settings
     * Rate Limit Group: Heavy
     * App Permission: ReadAccounts
     * User Permission: CallQueueToCallQueue
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates overflow settings for a call queue specified in path.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{callQueueId}/overflow-settings
     * Rate Limit Group: Heavy
     * App Permission: EditExtensions
     * User Permission: CallQueueToCallQueue
     */
    async put(callQueueOverflowSettingsRequestResource, restRequestConfig) {
        const r = await this.rc.put(this.path(), callQueueOverflowSettingsRequestResource, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1277:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/phone-number`;
    }
    /**
     * Returns the list of phone numbers that are used by a particular extension,
     * can be filtered by the phone number type. The returned list contains all
     * numbers which are directly mapped to the given extension. Plus the features
     * and company-level numbers that may be used when performing different operations
     * on behalf of this extension.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/phone-number
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadUserPhoneNumbers
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6780:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/presence`;
    }
    /**
     * Returns the presence status of an extension or several extensions by their ID(s). The `presenceStatus` is returned as Offline
     * (the parameters `telephonyStatus`, `message`, `userStatus` and `dndStatus` are not returned at all) for the following extension types:
     * Department/Announcement Only/Take Messages Only (Voicemail)/Fax User/Paging Only Group/Shared Lines Group/IVR Menu/Application Extension/Park Location.
     * If the user requests his/her own presence status, the response contains actual presence status even if the status publication is turned off.
     * [Batch request syntax](https://developers.ringcentral.com/api-reference/Batch-Requests) is supported. For batch requests the number of extensions
     * in one request is limited to 30. If more extensions are included in the request, the error code 400 Bad Request is returned with the logical error
     * code InvalidMultipartRequest and the corresponding message Extension Presence Info multipart request is limited to 30 extensions.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/presence
     * Rate Limit Group: Light
     * App Permission: ReadPresence
     * User Permission: ReadPresenceStatus
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates user-defined extension presence status, status message and DnD status by extension ID. Supported for regular User extensions only. The extension types listed do not support presence status: Department, Announcement Only, Take Messages Only (Voicemail), Fax User, Paging Only Group, Shared Lines Group, IVR Menu, Application Extension.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/presence
     * Rate Limit Group: Medium
     * App Permission: EditPresence
     */
    async put(presenceInfoRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), presenceInfoRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6319:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Utils_1 = __importDefault(__webpack_require__(7097));
class Index {
    constructor(_parent, scaleSize = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.scaleSize = scaleSize;
    }
    path(withParameter = true) {
        if (withParameter && this.scaleSize !== null) {
            return `${this._parent.path()}/profile-image/${this.scaleSize}`;
        }
        return `${this._parent.path()}/profile-image`;
    }
    /**
     * Returns a profile image of an extension.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/profile-image
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, {
            ...restRequestConfig,
            responseType: 'arraybuffer',
        });
        return r.data;
    }
    /**
     * Uploads the extension profile image.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/profile-image
     * Rate Limit Group: Heavy
     * App Permission: EditExtensions
     * User Permission: EditUserInfo
     */
    async post(createUserProfileImageRequest, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(createUserProfileImageRequest);
        const r = await this.rc.post(this.path(false), formData, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the extension profile image.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/profile-image
     * Rate Limit Group: Heavy
     * App Permission: EditExtensions
     * User Permission: EditUserInfo
     */
    async put(updateUserProfileImageRequest, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(updateUserProfileImageRequest);
        const r = await this.rc.put(this.path(false), formData, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes the user profile image.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/profile-image
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserInfo
     */
    async delete(restRequestConfig) {
        const r = await this.rc.delete(this.path(false), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the scaled profile image of an extension.
     *
     * **This API must be called via media API entry point, e.g. https://media.ringcentral.com**
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/profile-image/{scaleSize}
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     */
    async get(queryParams, restRequestConfig) {
        if (this.scaleSize === null) {
            throw new Error('scaleSize must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, {
            ...restRequestConfig,
            responseType: 'arraybuffer',
        });
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7826:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, ringoutId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.ringoutId = ringoutId;
    }
    path(withParameter = true) {
        if (withParameter && this.ringoutId !== null) {
            return `${this._parent.path()}/ring-out/${this.ringoutId}`;
        }
        return `${this._parent.path()}/ring-out`;
    }
    /**
     * Makes a 2-legged RingOut call.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/ring-out
     * Rate Limit Group: Heavy
     * App Permission: RingOut
     */
    async post(makeRingOutRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), makeRingOutRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a status of a 2-legged RingOut call.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/ring-out/{ringoutId}
     * Rate Limit Group: Light
     * App Permission: RingOut
     */
    async get(restRequestConfig) {
        if (this.ringoutId === null) {
            throw new Error('ringoutId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Cancels a 2-legged RingOut call.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/ring-out/{ringoutId}
     * Rate Limit Group: Heavy
     * App Permission: RingOut
     */
    async delete(restRequestConfig) {
        if (this.ringoutId === null) {
            throw new Error('ringoutId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4430:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Utils_1 = __importDefault(__webpack_require__(7097));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/sms`;
    }
    /**
     * Creates and sends a new text message or multiple messages. You can send SMS
     * messages simultaneously to different recipients up to 40 requests per minute;
     * this limitation is relevant for all client applications. Sending and receiving
     * SMS is available for Toll-Free Numbers within the USA. You can send up to
     * 10 attachments in a single MMS message; the size of all attachments linked
     * is limited up to 1500000 bytes.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/sms
     * Rate Limit Group: Medium
     * App Permission: SMS
     * User Permission: OutboundSMS
     */
    async post(createSMSMessage, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(createSMSMessage);
        const r = await this.rc.post(this.path(), formData, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6836:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/unified-presence`;
    }
    /**
     * Returns the unified presence status of the requested user(s). The set of parameters returned by this method differs whether you return the requester's presence or any other user presence.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/unified-presence
     * Rate Limit Group: Medium
     * App Permission: ReadPresence
     * User Permission: ReadPresenceStatus
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the unified presence for the current user specified in path.
     * HTTP Method: patch
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/unified-presence
     * Rate Limit Group: Medium
     * App Permission: EditPresence
     * User Permission: EditPresenceStatus
     */
    async patch(updateUnifiedPresence, restRequestConfig) {
        const r = await this.rc.patch(this.path(), updateUnifiedPresence, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5826:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/video-configuration`;
    }
    /**
     * Returns information about video configuration settings of the current user.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}/video-configuration
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: Meetings
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9352:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const NotificationSettings_1 = __importDefault(__webpack_require__(8903));
const CallQueuePresence_1 = __importDefault(__webpack_require__(2617));
const VideoConfiguration_1 = __importDefault(__webpack_require__(5826));
const EmergencyLocations_1 = __importDefault(__webpack_require__(2858));
const AdministeredSites_1 = __importDefault(__webpack_require__(4350));
const OverflowSettings_1 = __importDefault(__webpack_require__(3122));
const AddressBookSync_1 = __importDefault(__webpack_require__(8765));
const ForwardingNumber_1 = __importDefault(__webpack_require__(1511));
const UnifiedPresence_1 = __importDefault(__webpack_require__(6836));
const AssignableRoles_1 = __importDefault(__webpack_require__(9733));
const CallerBlocking_1 = __importDefault(__webpack_require__(329));
const BusinessHours_1 = __importDefault(__webpack_require__(8422));
const AnsweringRule_1 = __importDefault(__webpack_require__(803));
const AssignedRole_1 = __importDefault(__webpack_require__(5113));
const AuthzProfile_1 = __importDefault(__webpack_require__(3088));
const CompanyPager_1 = __importDefault(__webpack_require__(9331));
const CallLogSync_1 = __importDefault(__webpack_require__(7782));
const MessageStore_1 = __importDefault(__webpack_require__(5813));
const ProfileImage_1 = __importDefault(__webpack_require__(6319));
const PhoneNumber_1 = __importDefault(__webpack_require__(1277));
const ActiveCalls_1 = __importDefault(__webpack_require__(1116));
const MessageSync_1 = __importDefault(__webpack_require__(611));
const Conferencing_1 = __importDefault(__webpack_require__(492));
const AddressBook_1 = __importDefault(__webpack_require__(1114));
const CallQueues_1 = __importDefault(__webpack_require__(8173));
const CallerId_1 = __importDefault(__webpack_require__(5243));
const Features_1 = __importDefault(__webpack_require__(6246));
const Presence_1 = __importDefault(__webpack_require__(6780));
const Favorite_1 = __importDefault(__webpack_require__(1469));
const RingOut_1 = __importDefault(__webpack_require__(7826));
const Greeting_1 = __importDefault(__webpack_require__(1138));
const CallLog_1 = __importDefault(__webpack_require__(9085));
const Device_1 = __importDefault(__webpack_require__(4567));
const Grant_1 = __importDefault(__webpack_require__(3173));
const Mms_1 = __importDefault(__webpack_require__(9876));
const Sms_1 = __importDefault(__webpack_require__(4430));
const Fax_1 = __importDefault(__webpack_require__(5248));
class Index {
    constructor(_parent, extensionId = '~') {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.extensionId = extensionId;
    }
    path(withParameter = true) {
        if (withParameter && this.extensionId !== null) {
            return `${this._parent.path()}/extension/${this.extensionId}`;
        }
        return `${this._parent.path()}/extension`;
    }
    /**
     * Returns the list of extensions created for a particular account.
     * All types of extensions are included in this list.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates an extension.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: AddRemoveUsers
     */
    async post(extensionCreationRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), extensionCreationRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns basic information about a particular extension of an account.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(restRequestConfig) {
        if (this.extensionId === null) {
            throw new Error('extensionId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the user settings.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension/{extensionId}
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: EditUserInfo OR EditUserCredentials
     */
    async put(extensionUpdateRequest, restRequestConfig) {
        if (this.extensionId === null) {
            throw new Error('extensionId must be specified.');
        }
        const r = await this.rc.put(this.path(), extensionUpdateRequest, undefined, restRequestConfig);
        return r.data;
    }
    fax() {
        return new Fax_1.default(this);
    }
    sms() {
        return new Sms_1.default(this);
    }
    mms() {
        return new Mms_1.default(this);
    }
    grant() {
        return new Grant_1.default(this);
    }
    device() {
        return new Device_1.default(this);
    }
    callLog(callRecordId = null) {
        return new CallLog_1.default(this, callRecordId);
    }
    greeting(greetingId = null) {
        return new Greeting_1.default(this, greetingId);
    }
    ringOut(ringoutId = null) {
        return new RingOut_1.default(this, ringoutId);
    }
    favorite() {
        return new Favorite_1.default(this);
    }
    presence() {
        return new Presence_1.default(this);
    }
    features() {
        return new Features_1.default(this);
    }
    callerId() {
        return new CallerId_1.default(this);
    }
    callQueues() {
        return new CallQueues_1.default(this);
    }
    addressBook() {
        return new AddressBook_1.default(this);
    }
    conferencing() {
        return new Conferencing_1.default(this);
    }
    messageSync() {
        return new MessageSync_1.default(this);
    }
    activeCalls() {
        return new ActiveCalls_1.default(this);
    }
    phoneNumber() {
        return new PhoneNumber_1.default(this);
    }
    profileImage(scaleSize = null) {
        return new ProfileImage_1.default(this, scaleSize);
    }
    messageStore(messageId = null) {
        return new MessageStore_1.default(this, messageId);
    }
    callLogSync() {
        return new CallLogSync_1.default(this);
    }
    companyPager() {
        return new CompanyPager_1.default(this);
    }
    authzProfile() {
        return new AuthzProfile_1.default(this);
    }
    assignedRole() {
        return new AssignedRole_1.default(this);
    }
    answeringRule(ruleId = null) {
        return new AnsweringRule_1.default(this, ruleId);
    }
    businessHours() {
        return new BusinessHours_1.default(this);
    }
    callerBlocking() {
        return new CallerBlocking_1.default(this);
    }
    assignableRoles() {
        return new AssignableRoles_1.default(this);
    }
    unifiedPresence() {
        return new UnifiedPresence_1.default(this);
    }
    forwardingNumber(forwardingNumberId = null) {
        return new ForwardingNumber_1.default(this, forwardingNumberId);
    }
    addressBookSync() {
        return new AddressBookSync_1.default(this);
    }
    overflowSettings() {
        return new OverflowSettings_1.default(this);
    }
    administeredSites() {
        return new AdministeredSites_1.default(this);
    }
    emergencyLocations(locationId = null) {
        return new EmergencyLocations_1.default(this, locationId);
    }
    videoConfiguration() {
        return new VideoConfiguration_1.default(this);
    }
    callQueuePresence() {
        return new CallQueuePresence_1.default(this);
    }
    notificationSettings() {
        return new NotificationSettings_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 352:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, taskId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.taskId = taskId;
    }
    path(withParameter = true) {
        if (withParameter && this.taskId !== null) {
            return `${this._parent.path()}/tasks/${this.taskId}`;
        }
        return `${this._parent.path()}/tasks`;
    }
    /**
     * Returns a status of a task to update multiple extensions.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension-bulk-update/tasks/{taskId}
     * Rate Limit Group: Light
     * App Permission: EditExtensions
     * User Permission: EditExtensionInfo
     */
    async get(restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7933:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Tasks_1 = __importDefault(__webpack_require__(352));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/extension-bulk-update`;
    }
    /**
     * Updates multiple extensions at once. Maximum 500 extensions can be updated per request.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/extension-bulk-update
     * Rate Limit Group: Heavy
     * App Permission: EditExtensions
     * User Permission: EditExtensionInfo
     */
    async post(extensionBulkUpdateRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), extensionBulkUpdateRequest, undefined, restRequestConfig);
        return r.data;
    }
    tasks(taskId = null) {
        return new Tasks_1.default(this, taskId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8516:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/forward-all-calls`;
    }
    /**
     * Returns information about *Forward All Company Calls* feature setting.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/forward-all-calls
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyAnsweringRules
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates *Forward All Company Calls* feature setting.
     * HTTP Method: patch
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/forward-all-calls
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyAnsweringRules
     */
    async patch(forwardAllCompanyCallsRequest, restRequestConfig) {
        const r = await this.rc.patch(this.path(), forwardAllCompanyCallsRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5838:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/content`;
    }
    /**
     * Returns account-level greeting media contents.
     *
     * **This API must be called via media API entry point, e.g. https://media.ringcentral.com**
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/greeting/{greetingId}/content
     * Rate Limit Group: Heavy
     * App Permission: ReadAccounts
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, {
            ...restRequestConfig,
            responseType: 'arraybuffer',
        });
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2696:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Content_1 = __importDefault(__webpack_require__(5838));
const Utils_1 = __importDefault(__webpack_require__(7097));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/greeting`;
    }
    /**
     * Creates a custom company greeting.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/greeting
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: ReadUserInfo
     */
    async post(createCompanyGreetingRequest, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(createCompanyGreetingRequest);
        const r = await this.rc.post(this.path(), formData, undefined, restRequestConfig);
        return r.data;
    }
    content() {
        return new Content_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8446:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, ivrMenuId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.ivrMenuId = ivrMenuId;
    }
    path(withParameter = true) {
        if (withParameter && this.ivrMenuId !== null) {
            return `${this._parent.path()}/ivr-menus/${this.ivrMenuId}`;
        }
        return `${this._parent.path()}/ivr-menus`;
    }
    /**
     * Returns a company IVR menus.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-menus
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a company IVR menu.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-menus
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: AutoReceptionist
     */
    async post(iVRMenuInfo, restRequestConfig) {
        const r = await this.rc.post(this.path(false), iVRMenuInfo, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a company IVR menu by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-menus/{ivrMenuId}
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: AutoReceptionist
     */
    async get(restRequestConfig) {
        if (this.ivrMenuId === null) {
            throw new Error('ivrMenuId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a company IVR menu by ID.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-menus/{ivrMenuId}
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: AutoReceptionist
     */
    async put(iVRMenuInfo, restRequestConfig) {
        if (this.ivrMenuId === null) {
            throw new Error('ivrMenuId must be specified.');
        }
        const r = await this.rc.put(this.path(), iVRMenuInfo, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7591:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/content`;
    }
    /**
     * Returns media content of an IVR prompt by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-prompts/{promptId}/content
     * Rate Limit Group: Heavy
     * App Permission: ReadAccounts
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, {
            ...restRequestConfig,
            responseType: 'arraybuffer',
        });
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6617:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Content_1 = __importDefault(__webpack_require__(7591));
const Utils_1 = __importDefault(__webpack_require__(7097));
class Index {
    constructor(_parent, promptId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.promptId = promptId;
    }
    path(withParameter = true) {
        if (withParameter && this.promptId !== null) {
            return `${this._parent.path()}/ivr-prompts/${this.promptId}`;
        }
        return `${this._parent.path()}/ivr-prompts`;
    }
    /**
     * Returns the list of IVR prompts.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-prompts
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyGreetings
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Creates an IVR prompt.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-prompts
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: EditCompanyGreetings
     */
    async post(createIVRPromptRequest, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(createIVRPromptRequest);
        const r = await this.rc.post(this.path(false), formData, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns an IVR prompt by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-prompts/{promptId}
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyGreetings
     */
    async get(restRequestConfig) {
        if (this.promptId === null) {
            throw new Error('promptId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates an IVR prompt by ID
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-prompts/{promptId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyGreetings
     */
    async put(updateIVRPromptRequest, restRequestConfig) {
        if (this.promptId === null) {
            throw new Error('promptId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateIVRPromptRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes an IVR prompt by ID.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/ivr-prompts/{promptId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: EditCompanyGreetings
     */
    async delete(restRequestConfig) {
        if (this.promptId === null) {
            throw new Error('promptId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    content() {
        return new Content_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8867:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/message-store-configuration`;
    }
    /**
     * Returns message store settings.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/message-store-configuration
     * Rate Limit Group: Light
     * App Permission: EditAccounts
     * User Permission: AccountAdministration
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates message store settings.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/message-store-configuration
     * Rate Limit Group: Light
     * App Permission: EditAccounts
     * User Permission: AccountAdministration
     */
    async put(messageStoreConfiguration, restRequestConfig) {
        const r = await this.rc.put(this.path(), messageStoreConfiguration, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4608:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/archive`;
    }
    /**
     * Returns the created report with message data not including attachments.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/message-store-report/{taskId}/archive
     * Rate Limit Group: Heavy
     * App Permission: ReadMessages
     * User Permission: Users
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7385:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Archive_1 = __importDefault(__webpack_require__(4608));
class Index {
    constructor(_parent, taskId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.taskId = taskId;
    }
    path(withParameter = true) {
        if (withParameter && this.taskId !== null) {
            return `${this._parent.path()}/message-store-report/${this.taskId}`;
        }
        return `${this._parent.path()}/message-store-report`;
    }
    /**
     * Creates a task to collect all account messages within the specified
     * time interval. Maximum number of simultaneous tasks per account is 2.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/message-store-report
     * Rate Limit Group: Heavy
     * App Permission: ReadMessages
     * User Permission: Users
     */
    async post(createMessageStoreReportRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createMessageStoreReportRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the current status of a task on report creation.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/message-store-report/{taskId}
     * Rate Limit Group: Heavy
     * App Permission: ReadMessages
     * User Permission: Users
     */
    async get(restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    archive() {
        return new Archive_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4427:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Adds and/or removes paging group users and devices.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/paging-only-groups/{pagingOnlyGroupId}/bulk-assign
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: Groups
     */
    async post(editPagingGroupRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), editPagingGroupRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3621:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/devices`;
    }
    /**
     * Returns a list of paging devices assigned to this group.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/paging-only-groups/{pagingOnlyGroupId}/devices
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyDevices
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1198:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/users`;
    }
    /**
     * Returns a list of users allowed to page this group.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/paging-only-groups/{pagingOnlyGroupId}/users
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadUserInfo
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9737:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAssign_1 = __importDefault(__webpack_require__(4427));
const Devices_1 = __importDefault(__webpack_require__(3621));
const Users_1 = __importDefault(__webpack_require__(1198));
class Index {
    constructor(_parent, pagingOnlyGroupId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.pagingOnlyGroupId = pagingOnlyGroupId;
    }
    path(withParameter = true) {
        if (withParameter && this.pagingOnlyGroupId !== null) {
            return `${this._parent.path()}/paging-only-groups/${this.pagingOnlyGroupId}`;
        }
        return `${this._parent.path()}/paging-only-groups`;
    }
    users() {
        return new Users_1.default(this);
    }
    devices() {
        return new Devices_1.default(this);
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5456:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, phoneNumberId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.phoneNumberId = phoneNumberId;
    }
    path(withParameter = true) {
        if (withParameter && this.phoneNumberId !== null) {
            return `${this._parent.path()}/phone-number/${this.phoneNumberId}`;
        }
        return `${this._parent.path()}/phone-number`;
    }
    /**
     * Returns the list of phone numbers assigned to RingCentral customer
     * account. Both company-level and extension-level numbers are returned.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/phone-number
     * Rate Limit Group: Heavy
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyPhoneNumbers
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns phone number(s) belonging to a certain account or extension by phoneNumberId(s).
     * [Batch request syntax](https://developers.ringcentral.com/api-reference/Batch-Requests) is supported.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/phone-number/{phoneNumberId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyPhoneNumbers
     */
    async get(restRequestConfig) {
        if (this.phoneNumberId === null) {
            throw new Error('phoneNumberId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5426:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/presence`;
    }
    /**
     * Returns presence status of all extensions of an account. Please note: The presenceStatus is returned as Offline (the parameters telephonyStatus, message, userStatus and dndStatus are not returned at all) for the following extension types: Department, Announcement Only, Voicemail (Take Messages Only), Fax User, Paging Only Group, Shared Lines Group, IVR Menu, Application Extension.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/presence
     * Rate Limit Group: Heavy
     * App Permission: ReadPresence
     * User Permission: ReadPresenceStatus
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5272:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/content`;
    }
    /**
     * Returns media content of a call recording (`audio/mpeg` or `audio/wav`)
     *
     * **This API must be called via media API entry point, e.g. https://media.ringcentral.com**
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/recording/{recordingId}/content
     * Rate Limit Group: Heavy
     * App Permission: ReadCallRecording
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, {
            ...restRequestConfig,
            responseType: 'arraybuffer',
        });
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3814:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Content_1 = __importDefault(__webpack_require__(5272));
class Index {
    constructor(_parent, recordingId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.recordingId = recordingId;
    }
    path(withParameter = true) {
        if (withParameter && this.recordingId !== null) {
            return `${this._parent.path()}/recording/${this.recordingId}`;
        }
        return `${this._parent.path()}/recording`;
    }
    /**
     * Returns call recordings by ID(s).
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/recording/{recordingId}
     * Rate Limit Group: Heavy
     * App Permission: ReadCallRecording
     * User Permission: ReadCallRecording
     */
    async get(restRequestConfig) {
        if (this.recordingId === null) {
            throw new Error('recordingId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    content() {
        return new Content_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8990:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/service-info`;
    }
    /**
     * Returns the information about service plan, available features
     * and limitations for a particular RingCentral customer account.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/service-info
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadServicePlanInfo
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1663:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Assigns multiple sites to an account specified in path.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites/{siteId}/bulk-assign
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: Sites
     */
    async post(siteMembersBulkUpdate, restRequestConfig) {
        const r = await this.rc.post(this.path(), siteMembersBulkUpdate, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7905:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/ivr`;
    }
    /**
     * Returns IVR settings for a site specified in path.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites/{siteId}/ivr
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates IVR settings for a site specified in path.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites/{siteId}/ivr
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: Sites
     */
    async put(siteIVRSettingsUpdate, restRequestConfig) {
        const r = await this.rc.put(this.path(), siteIVRSettingsUpdate, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3129:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/members`;
    }
    /**
     * Returns members of a site specified in path.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites/{siteId}/members
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5725:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAssign_1 = __importDefault(__webpack_require__(1663));
const Members_1 = __importDefault(__webpack_require__(3129));
const Ivr_1 = __importDefault(__webpack_require__(7905));
class Index {
    constructor(_parent, siteId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.siteId = siteId;
    }
    path(withParameter = true) {
        if (withParameter && this.siteId !== null) {
            return `${this._parent.path()}/sites/${this.siteId}`;
        }
        return `${this._parent.path()}/sites`;
    }
    /**
     * Returns a list of sites for the specified account.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a site for the specified account.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     */
    async post(createSiteRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createSiteRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a site by ID.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites/{siteId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadExtensions
     */
    async get(restRequestConfig) {
        if (this.siteId === null) {
            throw new Error('siteId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a site specified in path.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites/{siteId}
     * Rate Limit Group: Light
     * App Permission: EditExtensions
     * User Permission: Sites
     */
    async put(siteUpdateRequest, restRequestConfig) {
        if (this.siteId === null) {
            throw new Error('siteId must be specified.');
        }
        const r = await this.rc.put(this.path(), siteUpdateRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a site specified in path.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/sites/{siteId}
     * Rate Limit Group: Light
     * App Permission: EditAccounts
     * User Permission: Sites
     */
    async delete(restRequestConfig) {
        if (this.siteId === null) {
            throw new Error('siteId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    ivr() {
        return new Ivr_1.default(this);
    }
    members() {
        return new Members_1.default(this);
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/call-out`;
    }
    /**
     * Creates a new outbound call out session. Currently this method is supported for Softphone/Hardphone only, since device IDs for WebRTC/Mobile apps cannot be obtained.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/call-out
     * Rate Limit Group: Heavy
     * App Permission: CallControl
     */
    async post(makeCallOutRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), makeCallOutRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6340:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/conference`;
    }
    /**
     * Initiates a conference call session.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/conference
     * Rate Limit Group: Heavy
     * App Permission: CallControl
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6235:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/answer`;
    }
    /**
     * Answers a call on a certain device by passing the corresponding device ID in request body. Supported for call forwarding, call transfer, call flip and call queues.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/answer
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(answerTarget, restRequestConfig) {
        const r = await this.rc.post(this.path(), answerTarget, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7296:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bridge`;
    }
    /**
     * Allows the user to connect multiple call session participants over a conference call bridge. The current active call session ID and party ID of the user within this session should be specified in path; the bridged call session ID and party ID of the user within that session should be specified in request body. Thus the user connects participants of two sessions into one conference call using his/her own party IDs from both sessions.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/bridge
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(bridgeTargetRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), bridgeTargetRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 272:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bring-in`;
    }
    /**
     * Adds a new party to the call session by bringing-in an established SIP call connection. The maximum number of parties to bring-in is 10; only 1 call party can be added per request. Currently the method is supported for sessions of 'Conference' origin only.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/bring-in
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(addPartyRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), addPartyRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2042:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/flip`;
    }
    /**
     * Performs call flip procedure by holding opposite party and calling to the specified target
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/flip
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(callPartyFlip, restRequestConfig) {
        const r = await this.rc.post(this.path(), callPartyFlip, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2590:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/forward`;
    }
    /**
     * Forwards a non-answered incoming call to the specified call party. Applicable for a call session in "Setup" or "Proceeding" state.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/forward
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(forwardTarget, restRequestConfig) {
        const r = await this.rc.post(this.path(), forwardTarget, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6600:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/hold`;
    }
    /**
     * Puts the party to stand-alone mode and starts to play Hold Music according to configuration & state to peers. There is a known limitation for Hold API - hold via REST API doesn't work with hold placed via RingCentral apps or HardPhone. It means that if you muted participant via Call Control API and RingCentral Desktop app, then you need to unhold both endpoints to remove Hold Music and bring media back.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/hold
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(holdCallPartyRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), holdCallPartyRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7343:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/ignore`;
    }
    /**
     * Ignores a call to a call queue agent in `Setup` or `Proceeding` state.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/ignore
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(ignoreRequestBody, restRequestConfig) {
        const r = await this.rc.post(this.path(), ignoreRequestBody, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7393:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/park`;
    }
    /**
     * Parks a call to a virtual location from where it can further be retrieved by any user from any phone of the system. The call session and call party identifiers should be specified in path. Currently the users can park only their own incoming calls. Up to 50 calls can be parked simultaneously. Park location starts with asterisk (*) and ranges 801-899.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/park
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1133:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/pickup`;
    }
    /**
     * Picks up a call parked to the specified park location.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/pickup
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(pickupTarget, restRequestConfig) {
        const r = await this.rc.post(this.path(), pickupTarget, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2917:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, recordingId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.recordingId = recordingId;
    }
    path(withParameter = true) {
        if (withParameter && this.recordingId !== null) {
            return `${this._parent.path()}/recordings/${this.recordingId}`;
        }
        return `${this._parent.path()}/recordings`;
    }
    /**
     * Starts a new call recording for the party
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/recordings
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(false), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Pause/resume recording
     * HTTP Method: patch
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/recordings/{recordingId}
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async patch(callRecordingUpdate, queryParams, restRequestConfig) {
        if (this.recordingId === null) {
            throw new Error('recordingId must be specified.');
        }
        const r = await this.rc.patch(this.path(), callRecordingUpdate, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3058:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/reject`;
    }
    /**
     * Rejects an inbound call in a "Setup" or "Proceeding" state
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/reject
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7827:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/reply`;
    }
    /**
     * Replies with text/pattern without picking up a call.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/reply
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(callPartyReply, restRequestConfig) {
        const r = await this.rc.post(this.path(), callPartyReply, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1477:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/supervise`;
    }
    /**
     * Allows to monitor a call party in 'Listen' mode. Input parameters are extension number of a monitored user and internal identifier of a supervisor's device. Call session and party identifiers should be specified in path. Please note that for this method dual channel audio flow is supported, which means that you need to make one more request for monitoring the second participant of a call. And as a result of each monitoring request the client receives SIP invite with the following header `p-rc-api-monitoring-ids` containing IDs of the monitored party and session. The flow is supported for calls with no more than 2 participants. Currently this method is supported for Softphone/Hardphone only, since device IDs for WebRTC/Mobile apps cannot be obtained.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/supervise
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(partySuperviseRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), partySuperviseRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4394:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/transfer`;
    }
    /**
     * Transfers an answered call to the specified call party. Applicable for a call session in "Answered" or "Hold" state.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/transfer
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(transferTarget, restRequestConfig) {
        const r = await this.rc.post(this.path(), transferTarget, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9079:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/unhold`;
    }
    /**
     * Brings a party back into a call and stops to play Hold Music. There is a known limitation for Hold API - hold via REST API doesn't work with hold placed via RingCentral apps or HardPhone. It means that if you muted participant via Call Control API and RingCentral Desktop app, then you need to unhold both endpoints to remove Hold Music and bring media back.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}/unhold
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8896:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Recordings_1 = __importDefault(__webpack_require__(2917));
const Supervise_1 = __importDefault(__webpack_require__(1477));
const BringIn_1 = __importDefault(__webpack_require__(272));
const Transfer_1 = __importDefault(__webpack_require__(4394));
const Forward_1 = __importDefault(__webpack_require__(2590));
const Pickup_1 = __importDefault(__webpack_require__(1133));
const Answer_1 = __importDefault(__webpack_require__(6235));
const Reject_1 = __importDefault(__webpack_require__(3058));
const Ignore_1 = __importDefault(__webpack_require__(7343));
const Bridge_1 = __importDefault(__webpack_require__(7296));
const Unhold_1 = __importDefault(__webpack_require__(9079));
const Reply_1 = __importDefault(__webpack_require__(7827));
const Hold_1 = __importDefault(__webpack_require__(6600));
const Flip_1 = __importDefault(__webpack_require__(2042));
const Park_1 = __importDefault(__webpack_require__(7393));
class Index {
    constructor(_parent, partyId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.partyId = partyId;
    }
    path(withParameter = true) {
        if (withParameter && this.partyId !== null) {
            return `${this._parent.path()}/parties/${this.partyId}`;
        }
        return `${this._parent.path()}/parties`;
    }
    /**
     * Returns a call party status by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async get(restRequestConfig) {
        if (this.partyId === null) {
            throw new Error('partyId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a party from a call session by ID. A party can be deleted only if supervised or parked. It is possible to delete only one conference participant per request.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async delete(restRequestConfig) {
        if (this.partyId === null) {
            throw new Error('partyId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Modifies a call party by ID. There is a known limitation for Mute scenario - mute via REST API doesn't work with mute placed via RingCentral apps or HardPhone. It means that if you muted participant via Call Control API and RingCentral Desktop app you need to unmute both endpoints to bring the media back.
     * HTTP Method: patch
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/parties/{partyId}
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async patch(partyUpdateRequest, restRequestConfig) {
        if (this.partyId === null) {
            throw new Error('partyId must be specified.');
        }
        const r = await this.rc.patch(this.path(), partyUpdateRequest, undefined, restRequestConfig);
        return r.data;
    }
    park() {
        return new Park_1.default(this);
    }
    flip() {
        return new Flip_1.default(this);
    }
    hold() {
        return new Hold_1.default(this);
    }
    reply() {
        return new Reply_1.default(this);
    }
    unhold() {
        return new Unhold_1.default(this);
    }
    bridge() {
        return new Bridge_1.default(this);
    }
    ignore() {
        return new Ignore_1.default(this);
    }
    reject() {
        return new Reject_1.default(this);
    }
    answer() {
        return new Answer_1.default(this);
    }
    pickup() {
        return new Pickup_1.default(this);
    }
    forward() {
        return new Forward_1.default(this);
    }
    transfer() {
        return new Transfer_1.default(this);
    }
    bringIn() {
        return new BringIn_1.default(this);
    }
    supervise() {
        return new Supervise_1.default(this);
    }
    recordings(recordingId = null) {
        return new Recordings_1.default(this, recordingId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3646:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/supervise`;
    }
    /**
     * Allows to monitor a call session in 'Listen' mode. Input parameters should contain internal identifiers of a monitored user and a supervisor's device. Call session should be specified in path. Please note that this method supports single channel audio flow, which means that audio of both call participants is mixed and delivered to the supervisor in single audio channel. Currently this method is supported for Softphone/Hardphone only, since device IDs for WebRTC/Mobile apps cannot be obtained.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}/supervise
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async post(superviseCallSessionRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), superviseCallSessionRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3715:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Supervise_1 = __importDefault(__webpack_require__(3646));
const Parties_1 = __importDefault(__webpack_require__(8896));
class Index {
    constructor(_parent, telephonySessionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.telephonySessionId = telephonySessionId;
    }
    path(withParameter = true) {
        if (withParameter && this.telephonySessionId !== null) {
            return `${this._parent.path()}/sessions/${this.telephonySessionId}`;
        }
        return `${this._parent.path()}/sessions`;
    }
    /**
     * Returns the status of a call session by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async get(queryParams, restRequestConfig) {
        if (this.telephonySessionId === null) {
            throw new Error('telephonySessionId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Drops a call session.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/telephony/sessions/{telephonySessionId}
     * Rate Limit Group: Light
     * App Permission: CallControl
     */
    async delete(restRequestConfig) {
        if (this.telephonySessionId === null) {
            throw new Error('telephonySessionId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    parties(partyId = null) {
        return new Parties_1.default(this, partyId);
    }
    supervise() {
        return new Supervise_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7625:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Conference_1 = __importDefault(__webpack_require__(6340));
const CallOut_1 = __importDefault(__webpack_require__(6814));
const Sessions_1 = __importDefault(__webpack_require__(3715));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/telephony`;
    }
    sessions(telephonySessionId = null) {
        return new Sessions_1.default(this, telephonySessionId);
    }
    callOut() {
        return new CallOut_1.default(this);
    }
    conference() {
        return new Conference_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1166:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, templateId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.templateId = templateId;
    }
    path(withParameter = true) {
        if (withParameter && this.templateId !== null) {
            return `${this._parent.path()}/templates/${this.templateId}`;
        }
        return `${this._parent.path()}/templates`;
    }
    /**
     * Returns the list of user templates for the current account.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/templates
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the user template by ID.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/templates/{templateId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async get(restRequestConfig) {
        if (this.templateId === null) {
            throw new Error('templateId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8992:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-assign`;
    }
    /**
     * Assigns multiple user roles.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/user-role/{roleId}/bulk-assign
     * Rate Limit Group: Heavy
     * App Permission: RoleManagement
     * User Permission: EditUserRoles
     */
    async post(bulkRoleAssignResource, restRequestConfig) {
        const r = await this.rc.post(this.path(), bulkRoleAssignResource, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5486:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/default`;
    }
    /**
     * Returns the default user role of the current account.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/user-role/default
     * Rate Limit Group: Light
     * App Permission: RoleManagement
     * User Permission: Roles
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the account default user role.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/user-role/default
     * Rate Limit Group: Medium
     * App Permission: RoleManagement
     * User Permission: Roles
     */
    async put(defaultUserRoleRequest, restRequestConfig) {
        const r = await this.rc.put(this.path(), defaultUserRoleRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3308:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAssign_1 = __importDefault(__webpack_require__(8992));
const Default_1 = __importDefault(__webpack_require__(5486));
class Index {
    constructor(_parent, roleId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.roleId = roleId;
    }
    path(withParameter = true) {
        if (withParameter && this.roleId !== null) {
            return `${this._parent.path()}/user-role/${this.roleId}`;
        }
        return `${this._parent.path()}/user-role`;
    }
    /**
     * Returns a list of account user roles.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/user-role
     * Rate Limit Group: Medium
     * App Permission: ReadAccounts
     * User Permission: ReadUserRoles
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a custom user role.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/user-role
     * Rate Limit Group: Medium
     * App Permission: RoleManagement
     * User Permission: EditUserRoles
     */
    async post(roleResource, restRequestConfig) {
        const r = await this.rc.post(this.path(false), roleResource, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a user role assigned to the current account.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/user-role/{roleId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadUserRoles
     */
    async get(queryParams, restRequestConfig) {
        if (this.roleId === null) {
            throw new Error('roleId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a user role assigned to the current account by ID.
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/user-role/{roleId}
     * Rate Limit Group: Medium
     * App Permission: RoleManagement
     * User Permission: EditUserRoles
     */
    async put(roleResource, restRequestConfig) {
        if (this.roleId === null) {
            throw new Error('roleId must be specified.');
        }
        const r = await this.rc.put(this.path(), roleResource, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a custom user role by ID.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/account/{accountId}/user-role/{roleId}
     * Rate Limit Group: Medium
     * App Permission: RoleManagement
     * User Permission: EditUserRoles
     */
    async delete(queryParams, restRequestConfig) {
        if (this.roleId === null) {
            throw new Error('roleId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, queryParams, restRequestConfig);
        return r.data;
    }
    default() {
        return new Default_1.default(this);
    }
    bulkAssign() {
        return new BulkAssign_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1910:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const EmergencyAddressAutoUpdate_1 = __importDefault(__webpack_require__(3658));
const MessageStoreConfiguration_1 = __importDefault(__webpack_require__(8867));
const AddressBookBulkUpload_1 = __importDefault(__webpack_require__(4685));
const CallMonitoringGroups_1 = __importDefault(__webpack_require__(4977));
const ExtensionBulkUpdate_1 = __importDefault(__webpack_require__(7933));
const MessageStoreReport_1 = __importDefault(__webpack_require__(7385));
const EmergencyLocations_1 = __importDefault(__webpack_require__(7684));
const PagingOnlyGroups_1 = __importDefault(__webpack_require__(9737));
const ForwardAllCalls_1 = __importDefault(__webpack_require__(8516));
const BusinessAddress_1 = __importDefault(__webpack_require__(4976));
const CallRecordings_1 = __importDefault(__webpack_require__(7695));
const CallRecording_1 = __importDefault(__webpack_require__(454));
const BusinessHours_1 = __importDefault(__webpack_require__(3864));
const AnsweringRule_1 = __importDefault(__webpack_require__(9529));
const AssignedRole_1 = __importDefault(__webpack_require__(503));
const CallLogSync_1 = __importDefault(__webpack_require__(4136));
const CustomFields_1 = __importDefault(__webpack_require__(337));
const ActiveCalls_1 = __importDefault(__webpack_require__(5166));
const ServiceInfo_1 = __importDefault(__webpack_require__(8990));
const PhoneNumber_1 = __importDefault(__webpack_require__(5456));
const CallQueues_1 = __importDefault(__webpack_require__(7667));
const IvrPrompts_1 = __importDefault(__webpack_require__(6617));
const AuditTrail_1 = __importDefault(__webpack_require__(54));
const UserRole_1 = __importDefault(__webpack_require__(3308));
const IvrMenus_1 = __importDefault(__webpack_require__(8446));
const Templates_1 = __importDefault(__webpack_require__(1166));
const Extension_1 = __importDefault(__webpack_require__(9352));
const Recording_1 = __importDefault(__webpack_require__(3814));
const Telephony_1 = __importDefault(__webpack_require__(7625));
const Directory_1 = __importDefault(__webpack_require__(8514));
const Greeting_1 = __importDefault(__webpack_require__(2696));
const Presence_1 = __importDefault(__webpack_require__(5426));
const CallLog_1 = __importDefault(__webpack_require__(979));
const A2pSms_1 = __importDefault(__webpack_require__(2285));
const Device_1 = __importDefault(__webpack_require__(9141));
const Sites_1 = __importDefault(__webpack_require__(5725));
class Index {
    constructor(_parent, accountId = '~') {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.accountId = accountId;
    }
    path(withParameter = true) {
        if (withParameter && this.accountId !== null) {
            return `${this._parent.path()}/account/${this.accountId}`;
        }
        return `${this._parent.path()}/account`;
    }
    /**
     * Returns basic information about a particular RingCentral customer account.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/account/{accountId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async get(restRequestConfig) {
        if (this.accountId === null) {
            throw new Error('accountId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    sites(siteId = null) {
        return new Sites_1.default(this, siteId);
    }
    device(deviceId = null) {
        return new Device_1.default(this, deviceId);
    }
    a2pSms() {
        return new A2pSms_1.default(this);
    }
    callLog(callRecordId = null) {
        return new CallLog_1.default(this, callRecordId);
    }
    presence() {
        return new Presence_1.default(this);
    }
    greeting() {
        return new Greeting_1.default(this);
    }
    directory() {
        return new Directory_1.default(this);
    }
    telephony() {
        return new Telephony_1.default(this);
    }
    recording(recordingId = null) {
        return new Recording_1.default(this, recordingId);
    }
    extension(extensionId = '~') {
        return new Extension_1.default(this, extensionId);
    }
    templates(templateId = null) {
        return new Templates_1.default(this, templateId);
    }
    ivrMenus(ivrMenuId = null) {
        return new IvrMenus_1.default(this, ivrMenuId);
    }
    userRole(roleId = null) {
        return new UserRole_1.default(this, roleId);
    }
    auditTrail() {
        return new AuditTrail_1.default(this);
    }
    ivrPrompts(promptId = null) {
        return new IvrPrompts_1.default(this, promptId);
    }
    callQueues(groupId = null) {
        return new CallQueues_1.default(this, groupId);
    }
    phoneNumber(phoneNumberId = null) {
        return new PhoneNumber_1.default(this, phoneNumberId);
    }
    serviceInfo() {
        return new ServiceInfo_1.default(this);
    }
    activeCalls() {
        return new ActiveCalls_1.default(this);
    }
    customFields(fieldId = null) {
        return new CustomFields_1.default(this, fieldId);
    }
    callLogSync() {
        return new CallLogSync_1.default(this);
    }
    assignedRole() {
        return new AssignedRole_1.default(this);
    }
    answeringRule(ruleId = null) {
        return new AnsweringRule_1.default(this, ruleId);
    }
    businessHours() {
        return new BusinessHours_1.default(this);
    }
    callRecording() {
        return new CallRecording_1.default(this);
    }
    callRecordings() {
        return new CallRecordings_1.default(this);
    }
    businessAddress() {
        return new BusinessAddress_1.default(this);
    }
    forwardAllCalls() {
        return new ForwardAllCalls_1.default(this);
    }
    pagingOnlyGroups(pagingOnlyGroupId = null) {
        return new PagingOnlyGroups_1.default(this, pagingOnlyGroupId);
    }
    emergencyLocations(locationId = null) {
        return new EmergencyLocations_1.default(this, locationId);
    }
    messageStoreReport(taskId = null) {
        return new MessageStoreReport_1.default(this, taskId);
    }
    extensionBulkUpdate() {
        return new ExtensionBulkUpdate_1.default(this);
    }
    callMonitoringGroups(groupId = null) {
        return new CallMonitoringGroups_1.default(this, groupId);
    }
    addressBookBulkUpload() {
        return new AddressBookBulkUpload_1.default(this);
    }
    messageStoreConfiguration() {
        return new MessageStoreConfiguration_1.default(this);
    }
    emergencyAddressAutoUpdate() {
        return new EmergencyAddressAutoUpdate_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3490:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/sip-provision`;
    }
    /**
     * Creates SIP registration of a device/application (WebPhone, Mobile, Softphone).
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/client-info/sip-provision
     * Rate Limit Group: Heavy
     * App Permission: VoipCalling
     */
    async post(createSipRegistrationRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), createSipRegistrationRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7660:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const SipProvision_1 = __importDefault(__webpack_require__(3490));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/client-info`;
    }
    sipProvision() {
        return new SipProvision_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8681:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, contractedCountryId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.contractedCountryId = contractedCountryId;
    }
    path(withParameter = true) {
        if (withParameter && this.contractedCountryId !== null) {
            return `${this._parent.path()}/contracted-country/${this.contractedCountryId}`;
        }
        return `${this._parent.path()}/contracted-country`;
    }
    /**
     * Returns the list of contracted countries for the given brand.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/brand/{brandId}/contracted-country
     * Rate Limit Group: Light
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the list of domestic countries for account contracted country and brand.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/brand/{brandId}/contracted-country/{contractedCountryId}
     * Rate Limit Group: Light
     */
    async get(queryParams, restRequestConfig) {
        if (this.contractedCountryId === null) {
            throw new Error('contractedCountryId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5445:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ContractedCountry_1 = __importDefault(__webpack_require__(8681));
class Index {
    constructor(_parent, brandId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.brandId = brandId;
    }
    path(withParameter = true) {
        if (withParameter && this.brandId !== null) {
            return `${this._parent.path()}/brand/${this.brandId}`;
        }
        return `${this._parent.path()}/brand`;
    }
    contractedCountry(contractedCountryId = null) {
        return new ContractedCountry_1.default(this, contractedCountryId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2526:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, countryId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.countryId = countryId;
    }
    path(withParameter = true) {
        if (withParameter && this.countryId !== null) {
            return `${this._parent.path()}/country/${this.countryId}`;
        }
        return `${this._parent.path()}/country`;
    }
    /**
     * Returns all countries available for calling.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/country
     * Rate Limit Group: Light
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns information on a specific country.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/country/{countryId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.countryId === null) {
            throw new Error('countryId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 697:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/fax-cover-page`;
    }
    /**
     * Returns fax cover pages available for the current extension.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/fax-cover-page
     * Rate Limit Group: Light
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5411:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, greetingId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.greetingId = greetingId;
    }
    path(withParameter = true) {
        if (withParameter && this.greetingId !== null) {
            return `${this._parent.path()}/greeting/${this.greetingId}`;
        }
        return `${this._parent.path()}/greeting`;
    }
    /**
     * Returns the list of predefined standard greetings. Custom greetings
     * recorded by user are not returned in response to this request. See Get Extension
     * Custom Greetings.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/greeting
     * Rate Limit Group: Medium
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a standard greeting by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/greeting/{greetingId}
     * Rate Limit Group: Medium
     */
    async get(restRequestConfig) {
        if (this.greetingId === null) {
            throw new Error('greetingId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4998:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, languageId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.languageId = languageId;
    }
    path(withParameter = true) {
        if (withParameter && this.languageId !== null) {
            return `${this._parent.path()}/language/${this.languageId}`;
        }
        return `${this._parent.path()}/language`;
    }
    /**
     * Returns information about the supported languages.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/language
     * Rate Limit Group: Light
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a language by ID.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/language/{languageId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.languageId === null) {
            throw new Error('languageId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9731:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/location`;
    }
    /**
     * Returns all available locations for a certain state.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/location
     * Rate Limit Group: Light
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3291:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, permissionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.permissionId = permissionId;
    }
    path(withParameter = true) {
        if (withParameter && this.permissionId !== null) {
            return `${this._parent.path()}/permission/${this.permissionId}`;
        }
        return `${this._parent.path()}/permission`;
    }
    /**
     * Returns a list of extension user permissions.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/permission
     * Rate Limit Group: Light
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a user permission by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/permission/{permissionId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.permissionId === null) {
            throw new Error('permissionId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3559:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, permissionCategoryId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.permissionCategoryId = permissionCategoryId;
    }
    path(withParameter = true) {
        if (withParameter && this.permissionCategoryId !== null) {
            return `${this._parent.path()}/permission-category/${this.permissionCategoryId}`;
        }
        return `${this._parent.path()}/permission-category`;
    }
    /**
     * Returns a list of permission categories.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/permission-category
     * Rate Limit Group: Light
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a permission category by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/permission-category/{permissionCategoryId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.permissionCategoryId === null) {
            throw new Error('permissionCategoryId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4757:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, stateId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.stateId = stateId;
    }
    path(withParameter = true) {
        if (withParameter && this.stateId !== null) {
            return `${this._parent.path()}/state/${this.stateId}`;
        }
        return `${this._parent.path()}/state`;
    }
    /**
     * Returns all states of a certain country.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/state
     * Rate Limit Group: Light
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns information on a specific state by ID.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/state/{stateId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.stateId === null) {
            throw new Error('stateId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6287:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, timezoneId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.timezoneId = timezoneId;
    }
    path(withParameter = true) {
        if (withParameter && this.timezoneId !== null) {
            return `${this._parent.path()}/timezone/${this.timezoneId}`;
        }
        return `${this._parent.path()}/timezone`;
    }
    /**
     * Returns all available timezones.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/timezone
     * Rate Limit Group: Light
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns information on a certain timezone.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/timezone/{timezoneId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.timezoneId === null) {
            throw new Error('timezoneId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7491:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, roleId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.roleId = roleId;
    }
    path(withParameter = true) {
        if (withParameter && this.roleId !== null) {
            return `${this._parent.path()}/user-role/${this.roleId}`;
        }
        return `${this._parent.path()}/user-role`;
    }
    /**
     * Returns a list of standard user roles.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/user-role
     * Rate Limit Group: Light
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a standard user role by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/dictionary/user-role/{roleId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.roleId === null) {
            throw new Error('roleId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4899:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const PermissionCategory_1 = __importDefault(__webpack_require__(3559));
const FaxCoverPage_1 = __importDefault(__webpack_require__(697));
const Permission_1 = __importDefault(__webpack_require__(3291));
const UserRole_1 = __importDefault(__webpack_require__(7491));
const Location_1 = __importDefault(__webpack_require__(9731));
const Timezone_1 = __importDefault(__webpack_require__(6287));
const Greeting_1 = __importDefault(__webpack_require__(5411));
const Language_1 = __importDefault(__webpack_require__(4998));
const Country_1 = __importDefault(__webpack_require__(2526));
const State_1 = __importDefault(__webpack_require__(4757));
const Brand_1 = __importDefault(__webpack_require__(5445));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/dictionary`;
    }
    brand(brandId = null) {
        return new Brand_1.default(this, brandId);
    }
    state(stateId = null) {
        return new State_1.default(this, stateId);
    }
    country(countryId = null) {
        return new Country_1.default(this, countryId);
    }
    language(languageId = null) {
        return new Language_1.default(this, languageId);
    }
    greeting(greetingId = null) {
        return new Greeting_1.default(this, greetingId);
    }
    timezone(timezoneId = null) {
        return new Timezone_1.default(this, timezoneId);
    }
    location() {
        return new Location_1.default(this);
    }
    userRole(roleId = null) {
        return new UserRole_1.default(this, roleId);
    }
    permission(permissionId = null) {
        return new Permission_1.default(this, permissionId);
    }
    faxCoverPage() {
        return new FaxCoverPage_1.default(this);
    }
    permissionCategory(permissionCategoryId = null) {
        return new PermissionCategory_1.default(this, permissionCategoryId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 885:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/parse`;
    }
    /**
     * Returns one or more parsed and/or formatted phone numbers that are passed as strings.
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/number-parser/parse
     * Rate Limit Group: Light
     */
    async post(parsePhoneNumberRequest, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), parsePhoneNumberRequest, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7313:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Parse_1 = __importDefault(__webpack_require__(885));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/number-parser`;
    }
    parse() {
        return new Parse_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4642:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/authorize`;
    }
    /**
     * Performs OAuth 2.0 authorization (GET version)
     * HTTP Method: get
     * Endpoint: /restapi/oauth/authorize
     * Rate Limit Group: Auth
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Performs OAuth 2.0 authorization (POST version)
     * HTTP Method: post
     * Endpoint: /restapi/oauth/authorize
     * Rate Limit Group: Auth
     */
    async post(authorizeRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), authorizeRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9348:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/introspect`;
    }
    /**
     * Determines state and metadata for a given token (access token, refresh token
     * or authorization code)
     *
     * Depending on client application type
     * requests to this endpoint may require authentication with HTTP Basic scheme
     * using registered client ID and client secret as login and password, correspondingly.
     *
     * HTTP Method: post
     * Endpoint: /restapi/oauth/introspect
     * Rate Limit Group: Auth
     * App Permission: Interoperability
     */
    async post(introspectTokenRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), introspectTokenRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6889:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/revoke`;
    }
    /**
     * Revokes all active access/refresh tokens and invalidates the OAuth session basing on token provided.
     * `token` parameter may be passed in query string or body and may represent access or refresh token.
     *
     * Depending on client application type
     * requests to this endpoint may require authentication with HTTP Basic scheme
     * using registered client ID and client secret as login and password, correspondingly.
     *
     * HTTP Method: post
     * Endpoint: /restapi/oauth/revoke
     * Rate Limit Group: Auth
     */
    async post(revokeTokenRequest, queryParams, restRequestConfig) {
        const r = await this.rc.post(this.path(), revokeTokenRequest, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8429:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/session-info`;
    }
    /**
     * Returns information about current OAuth session
     *
     * HTTP Method: get
     * Endpoint: /restapi/oauth/session-info
     * Rate Limit Group: Auth
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3944:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/token`;
    }
    /**
     * Returns access (and potentially refresh) tokens for making API requests.
     *
     * Depending on client application type
     * requests to this endpoint may require authentication with HTTP Basic scheme
     * using registered client ID and client secret as login and password, correspondingly.
     *
     * HTTP Method: post
     * Endpoint: /restapi/oauth/token
     * Rate Limit Group: Auth
     */
    async post(getTokenRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), getTokenRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3338:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const SessionInfo_1 = __importDefault(__webpack_require__(8429));
const Introspect_1 = __importDefault(__webpack_require__(9348));
const Authorize_1 = __importDefault(__webpack_require__(4642));
const Revoke_1 = __importDefault(__webpack_require__(6889));
const Token_1 = __importDefault(__webpack_require__(3944));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/oauth`;
    }
    token() {
        return new Token_1.default(this);
    }
    revoke() {
        return new Revoke_1.default(this);
    }
    authorize() {
        return new Authorize_1.default(this);
    }
    introspect() {
        return new Introspect_1.default(this);
    }
    sessionInfo() {
        return new SessionInfo_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9936:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/renew`;
    }
    /**
     * Renews the existing subscription (this request comes with empty body).
     *
     * Please note that `WebSocket` subscriptions are renewed automatically while websocket session is alive.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/subscription/{subscriptionId}/renew
     * Rate Limit Group: Light
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2806:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Renew_1 = __importDefault(__webpack_require__(9936));
class Index {
    constructor(_parent, subscriptionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.subscriptionId = subscriptionId;
    }
    path(withParameter = true) {
        if (withParameter && this.subscriptionId !== null) {
            return `${this._parent.path()}/subscription/${this.subscriptionId}`;
        }
        return `${this._parent.path()}/subscription`;
    }
    /**
     * Returns a list of subscriptions created by the user for the current authorized client application.
     *
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/subscription
     * Rate Limit Group: Light
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * This API allows client applications to register a new subscription so that it
     * can be notified of events when they occur on the platform.
     *
     * A subscription relates to a set of events that a client application would like
     * to be informed of and the delivery channel by which they will be notified of
     * those events. How subscriptions are established depends upon the notification
     * channel the client application would like to use to receive the event
     * notification. For example, to create a webhook a developer would create a
     * subscription via a REST API call, while specifying a list of events or "event
     * filters" to be notified of, a transport type of `WebHook`, and the address or
     * URL to which they would like the webhook delivered.
     *
     * However, developers wishing to subscribe to a set of events via a WebSocket
     * channel, would first connect to the WebSocket gateway, and then issue their
     * subscription request over the WebSocket itself, as opposed to making a REST
     * API call to this endpoint.
     *
     * While the protocol for establishing a subscription may vary depending upon
     * the delivery channel for that subscription, the schemas used for representing
     * a subscription are the same across all delivery modes.
     *
     * Subscriptions are currently limited to 20 subscriptions per user/extension (for particular application).
     *
     * RingCentral currently supports the following delivery modes for event subscriptions:
     *
     * * [WebHook](https://developers.ringcentral.com/guide/notifications/webhooks/quick-start) - to receive event notifications as an HTTP POST to a given URL
     * * [WebSocket](https://developers.ringcentral.com/guide/notifications/websockets/quick-start) - to receive real-time events over a persistent WebSocket connection
     * * [PubNub](https://developers.ringcentral.com/guide/notifications/push-notifications/quick-start) (deprecated) - to receive a push notification sent directly to a client application
     *
     * Developers should be aware that the PubNub delivery mode is currently
     * deprecated and will be removed in 2024. Developers are encouraged to
     * [migrate their client applications to use WebSockets](https://developers.ringcentral.com/guide/notifications/websockets/migration/)
     * instead.
     *
     * HTTP Method: post
     * Endpoint: /restapi/{apiVersion}/subscription
     * Rate Limit Group: Medium
     */
    async post(createSubscriptionRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createSubscriptionRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the existing subscription by ID.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}/subscription/{subscriptionId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.subscriptionId === null) {
            throw new Error('subscriptionId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the existing subscription. The client application can extend or narrow
     * the list of events for which it receives notifications within the current subscription.
     * If event filters are specified, calling this method modifies them for the
     * existing subscription. The method also allows one to set an expiration time for the
     * subscription itself.
     *
     * If parameters other than `events` and `expiresIn` are specified in the request they will be ignored.
     * If the request body is empty then the specified subscription will be renewed without any
     * event filter modifications and using the default expiration time.
     *
     * If the request is sent with empty body, it just renews a subscription
     * (so it is an equivalent of the `POST /restapi/v1.0/subscription/{subscriptionId}/renew`).
     *
     * Please note that `WebSocket` subscriptions cannot be updated via HTTP interface.
     *
     * HTTP Method: put
     * Endpoint: /restapi/{apiVersion}/subscription/{subscriptionId}
     * Rate Limit Group: Medium
     */
    async put(updateSubscriptionRequest, restRequestConfig) {
        if (this.subscriptionId === null) {
            throw new Error('subscriptionId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateSubscriptionRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Cancels the existing subscription.
     * HTTP Method: delete
     * Endpoint: /restapi/{apiVersion}/subscription/{subscriptionId}
     * Rate Limit Group: Medium
     */
    async delete(restRequestConfig) {
        if (this.subscriptionId === null) {
            throw new Error('subscriptionId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    renew() {
        return new Renew_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2977:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/users`;
    }
    /**
     * Creates multiple user extensions with BYOD (customer provided) devices.
     * If "extensionNumber" is not specified, the next available extension number will be assigned.
     *
     * HTTP Method: post
     * Endpoint: /restapi/v2/accounts/{accountId}/batch-provisioning/users
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     */
    async post(batchProvisionUsersRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), batchProvisionUsersRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7274:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Users_1 = __importDefault(__webpack_require__(2977));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/batch-provisioning`;
    }
    users() {
        return new Users_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5789:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/device-inventory`;
    }
    /**
     * Adds an existing phone (customer provided device - BYOD) as an unassigned device to the account inventory.
     * HTTP Method: post
     * Endpoint: /restapi/v2/accounts/{accountId}/device-inventory
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     */
    async post(addDeviceToInventoryRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), addDeviceToInventoryRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes an existing unassigned (without digital line or phone number) device or multiple devices
     * from the account inventory. It is possible to delete up to 10 devices per request.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/v2/accounts/{accountId}/device-inventory
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     */
    async delete(deleteDeviceFromInventoryRequest, restRequestConfig) {
        const r = await this.rc.delete(this.path(), deleteDeviceFromInventoryRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7372:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/bulk-add`;
    }
    /**
     * Adds multiple BYOD (customer provided) devices to an account.
     * HTTP Method: post
     * Endpoint: /restapi/v2/accounts/{accountId}/devices/bulk-add
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: AddRemoveDevices
     */
    async post(bulkAddDevicesRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), bulkAddDevicesRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3528:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAdd_1 = __importDefault(__webpack_require__(7372));
class Index {
    constructor(_parent, deviceId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.deviceId = deviceId;
    }
    path(withParameter = true) {
        if (withParameter && this.deviceId !== null) {
            return `${this._parent.path()}/devices/${this.deviceId}`;
        }
        return `${this._parent.path()}/devices`;
    }
    /**
     * Disassociates a phone line (DL & Device) from an extension:
     *
     *  - if the value of `keepAssetsInInventory` is `true`,
     * the given device is moved to unassigned devices and the number is moved to the number inventory;
     *  - if the value of `keepAssetsInInventory` is `false`, the given device and number is removed from the account;
     *  - if the parameter `keepAssetsInInventory` is not set (empty body), default value `true` is set.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/v2/accounts/{accountId}/devices/{deviceId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditAccountDevices
     */
    async delete(removeLineRequest, restRequestConfig) {
        if (this.deviceId === null) {
            throw new Error('deviceId must be specified.');
        }
        const r = await this.rc.delete(this.path(), removeLineRequest, undefined, restRequestConfig);
        return r.data;
    }
    bulkAdd() {
        return new BulkAdd_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9792:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/replace`;
    }
    /**
     * Replaces the user device with another device, which is assigned to an extension
     * or is stored in the inventory of the same account.
     * Currently, the following device types can be swapped - `HardPhone` and `OtherPhone`.
     *
     * Please note:
     *
     *  - This method allows replacing a device itself, while a phone number,
     *    a digital Line and an emergency address associated with this device remain unchanged
     *    and will still work together in a chain with the replacement device.
     *  - If a target device is from the inventory, then a source device will be moved
     *    to the inventory, and a target device will be assigned to the current extension.
     *  - If a target device is currently assigned to another extension,
     *    then the devices will be just swapped.
     *
     * HTTP Method: post
     * Endpoint: /restapi/v2/accounts/{accountId}/extensions/{extensionId}/devices/{deviceId}/replace
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditUserDevices
     */
    async post(swapDeviceRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), swapDeviceRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7379:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Replace_1 = __importDefault(__webpack_require__(9792));
class Index {
    constructor(_parent, deviceId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.deviceId = deviceId;
    }
    path(withParameter = true) {
        if (withParameter && this.deviceId !== null) {
            return `${this._parent.path()}/devices/${this.deviceId}`;
        }
        return `${this._parent.path()}/devices`;
    }
    replace() {
        return new Replace_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4063:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Devices_1 = __importDefault(__webpack_require__(7379));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/extensions`;
    }
    /**
     * Deletes user extension(s) and either keeps or destroys the assets - numbers and devices.
     * Multiple extensions can be deleted with a single API call.
     *
     * **Please note:** This API cannot be tested on Sandbox.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/v2/accounts/{accountId}/extensions
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: Users
     */
    async delete(bulkDeleteUsersRequest, restRequestConfig) {
        const r = await this.rc.delete(this.path(), bulkDeleteUsersRequest, undefined, restRequestConfig);
        return r.data;
    }
    devices(deviceId = null) {
        return new Devices_1.default(this, deviceId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7643:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, taskId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.taskId = taskId;
    }
    path(withParameter = true) {
        if (withParameter && this.taskId !== null) {
            return `${this._parent.path()}/bulk-add/${this.taskId}`;
        }
        return `${this._parent.path()}/bulk-add`;
    }
    /**
     * Adds phone numbers to the account Inventory as unassigned. Currently, we support the following values: `Inventory`,
     * `InventoryPartnerBusinessMobileNumber` and `PartnerBusinessMobileNumber`. Later we may support some other values like `ForwardedNumber`, etc.
     *
     * HTTP Method: post
     * Endpoint: /restapi/v2/accounts/{accountId}/phone-numbers/bulk-add
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: EditCompanyPhoneNumbers
     */
    async post(addPhoneNumbersRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), addPhoneNumbersRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the result of asynchronous operation which adds phone numbers to the account Inventory.
     *
     * HTTP Method: get
     * Endpoint: /restapi/v2/accounts/{accountId}/phone-numbers/bulk-add/{taskId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     * User Permission: EditCompanyPhoneNumbers
     */
    async get(restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6744:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/replace`;
    }
    /**
     * Replaces (swaps) phone numbers from Inventory with the main, company, direct or company fax numbers.
     * This method is used to replace temporary numbers when the porting process is complete.
     *
     * HTTP Method: post
     * Endpoint: /restapi/v2/accounts/{accountId}/phone-numbers/{phoneNumberId}/replace
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyPhoneNumbers
     */
    async post(replacePhoneNumberRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), replacePhoneNumberRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8971:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BulkAdd_1 = __importDefault(__webpack_require__(7643));
const Replace_1 = __importDefault(__webpack_require__(6744));
class Index {
    constructor(_parent, phoneNumberId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.phoneNumberId = phoneNumberId;
    }
    path(withParameter = true) {
        if (withParameter && this.phoneNumberId !== null) {
            return `${this._parent.path()}/phone-numbers/${this.phoneNumberId}`;
        }
        return `${this._parent.path()}/phone-numbers`;
    }
    /**
     * Returns the list of phone numbers assigned to RingCentral customer
     * account. Both company-level and extension-level numbers are returned.
     * Conferencing numbers, hot desk and ELIN numbers are not returned.
     *
     * HTTP Method: get
     * Endpoint: /restapi/v2/accounts/{accountId}/phone-numbers
     * Rate Limit Group: Heavy
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyPhoneNumbers
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * This method can only delete numbers that meet one of the following requirements:
     *   - numbers that have `"usageType": "Inventory"`
     *   - `"Forwarded"` numbers
     *   - `"Forwarded Company"` numbers
     *
     * In other words, this method will not delete numbers which are in use on the account - extension direct numbers,
     * main number, etc. It is possible to indicate phone numbers to be deleted using their IDs or exact string values
     * in e.164 format. However, the same lookup method (by ID or by value) must be used for all numbers within the same API call.
     *
     * HTTP Method: delete
     * Endpoint: /restapi/v2/accounts/{accountId}/phone-numbers
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyPhoneNumbers
     */
    async delete(deletePhoneNumbersRequest, restRequestConfig) {
        const r = await this.rc.delete(this.path(false), deletePhoneNumbersRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Assigns or reassigns a phone number as a company or extension number.
     *
     * Assign scenarios supported:
     * - from Inventory to a company number;
     * - from Inventory to an extension number.
     *
     * Reassign scenarios supported:
     * - from an extension to another extension;
     * - from an extension to a company number;
     * - from a company number to an extension.
     *
     * HTTP Method: patch
     * Endpoint: /restapi/v2/accounts/{accountId}/phone-numbers/{phoneNumberId}
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: EditCompanyPhoneNumbers
     */
    async patch(assignPhoneNumberRequest, restRequestConfig) {
        if (this.phoneNumberId === null) {
            throw new Error('phoneNumberId must be specified.');
        }
        const r = await this.rc.patch(this.path(), assignPhoneNumberRequest, undefined, restRequestConfig);
        return r.data;
    }
    replace() {
        return new Replace_1.default(this);
    }
    bulkAdd(taskId = null) {
        return new BulkAdd_1.default(this, taskId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8053:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/send-activation-email`;
    }
    /**
     * Sends/resends activation email to the system user of unconfirmed account.
     * HTTP Method: post
     * Endpoint: /restapi/v2/accounts/{accountId}/send-activation-email
     * Rate Limit Group: Medium
     * App Permission: EditAccounts
     * User Permission: AccountAdministration
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9251:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/send-welcome-email`;
    }
    /**
     * Sends/resends welcome email to the system user of confirmed account
     * HTTP Method: post
     * Endpoint: /restapi/v2/accounts/{accountId}/send-welcome-email
     * Rate Limit Group: Medium
     * App Permission: EditExtensions
     * User Permission: Users
     */
    async post(sendWelcomeEmailV2Request, restRequestConfig) {
        const r = await this.rc.post(this.path(), sendWelcomeEmailV2Request, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9336:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const SendActivationEmail_1 = __importDefault(__webpack_require__(8053));
const SendWelcomeEmail_1 = __importDefault(__webpack_require__(9251));
const BatchProvisioning_1 = __importDefault(__webpack_require__(7274));
const DeviceInventory_1 = __importDefault(__webpack_require__(5789));
const PhoneNumbers_1 = __importDefault(__webpack_require__(8971));
const Extensions_1 = __importDefault(__webpack_require__(4063));
const Devices_1 = __importDefault(__webpack_require__(3528));
class Index {
    constructor(_parent, accountId = '~') {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.accountId = accountId;
    }
    path(withParameter = true) {
        if (withParameter && this.accountId !== null) {
            return `${this._parent.path()}/accounts/${this.accountId}`;
        }
        return `${this._parent.path()}/accounts`;
    }
    /**
     * Returns basic information about particular RingCentral account
     * HTTP Method: get
     * Endpoint: /restapi/v2/accounts/{accountId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     * User Permission: ReadCompanyInfo
     */
    async get(restRequestConfig) {
        if (this.accountId === null) {
            throw new Error('accountId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    devices(deviceId = null) {
        return new Devices_1.default(this, deviceId);
    }
    extensions() {
        return new Extensions_1.default(this);
    }
    phoneNumbers(phoneNumberId = null) {
        return new PhoneNumbers_1.default(this, phoneNumberId);
    }
    deviceInventory() {
        return new DeviceInventory_1.default(this);
    }
    batchProvisioning() {
        return new BatchProvisioning_1.default(this);
    }
    sendWelcomeEmail() {
        return new SendWelcomeEmail_1.default(this);
    }
    sendActivationEmail() {
        return new SendActivationEmail_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4087:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Accounts_1 = __importDefault(__webpack_require__(9336));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v2`;
    }
    accounts(accountId = '~') {
        return new Accounts_1.default(this, accountId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2446:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const NumberParser_1 = __importDefault(__webpack_require__(7313));
const Subscription_1 = __importDefault(__webpack_require__(2806));
const ClientInfo_1 = __importDefault(__webpack_require__(7660));
const Dictionary_1 = __importDefault(__webpack_require__(4899));
const Account_1 = __importDefault(__webpack_require__(1910));
const Oauth_1 = __importDefault(__webpack_require__(3338));
const V2_1 = __importDefault(__webpack_require__(4087));
class Index {
    constructor(rc, apiVersion = 'v1.0') {
        this.rc = rc;
        this.apiVersion = apiVersion;
    }
    path(withParameter = true) {
        if (withParameter && this.apiVersion !== null) {
            return `/restapi/${this.apiVersion}`;
        }
        return '/restapi';
    }
    /**
     * Returns current API version(s) and server info.
     * HTTP Method: get
     * Endpoint: /restapi
     * Rate Limit Group: NoThrottling
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns current API version info by apiVersion.
     * HTTP Method: get
     * Endpoint: /restapi/{apiVersion}
     * Rate Limit Group: NoThrottling
     */
    async get(restRequestConfig) {
        if (this.apiVersion === null) {
            throw new Error('apiVersion must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    v2() {
        return new V2_1.default(this);
    }
    oauth() {
        return new Oauth_1.default(this);
    }
    account(accountId = '~') {
        return new Account_1.default(this, accountId);
    }
    dictionary() {
        return new Dictionary_1.default(this);
    }
    clientInfo() {
        return new ClientInfo_1.default(this);
    }
    subscription(subscriptionId = null) {
        return new Subscription_1.default(this, subscriptionId);
    }
    numberParser() {
        return new NumberParser_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 678:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, type = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.type = type;
    }
    path(withParameter = true) {
        if (withParameter && this.type !== null) {
            return `${this._parent.path()}/ResourceTypes/${this.type}`;
        }
        return `${this._parent.path()}/ResourceTypes`;
    }
    /**
     * Returns the list of supported SCIM resource types
     * HTTP Method: get
     * Endpoint: /scim/{version}/ResourceTypes
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns resource type by ID
     * HTTP Method: get
     * Endpoint: /scim/{version}/ResourceTypes/{type}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async get(restRequestConfig) {
        if (this.type === null) {
            throw new Error('type must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4803:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, uri = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.uri = uri;
    }
    path(withParameter = true) {
        if (withParameter && this.uri !== null) {
            return `${this._parent.path()}/Schemas/${this.uri}`;
        }
        return `${this._parent.path()}/Schemas`;
    }
    /**
     * Returns the list of schemas
     * HTTP Method: get
     * Endpoint: /scim/{version}/Schemas
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns SCIM schema
     * HTTP Method: get
     * Endpoint: /scim/{version}/Schemas/{uri}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async get(restRequestConfig) {
        if (this.uri === null) {
            throw new Error('uri must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9287:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/ServiceProviderConfig`;
    }
    /**
     * Returns SCIM service provider configuration
     * HTTP Method: get
     * Endpoint: /scim/{version}/ServiceProviderConfig
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 695:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/.search`;
    }
    /**
     * Returns the list of users satisfying search criteria
     * HTTP Method: post
     * Endpoint: /scim/{version}/Users/dotSearch
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async post(scimSearchRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), scimSearchRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 431:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const DotSearch_1 = __importDefault(__webpack_require__(695));
class Index {
    constructor(_parent, scimUserId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.scimUserId = scimUserId;
    }
    path(withParameter = true) {
        if (withParameter && this.scimUserId !== null) {
            return `${this._parent.path()}/Users/${this.scimUserId}`;
        }
        return `${this._parent.path()}/Users`;
    }
    /**
     * Returns the list of users satisfying search criteria
     * HTTP Method: get
     * Endpoint: /scim/{version}/Users
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new user
     * HTTP Method: post
     * Endpoint: /scim/{version}/Users
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     */
    async post(scimUser, restRequestConfig) {
        const r = await this.rc.post(this.path(false), scimUser, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a user by ID
     * HTTP Method: get
     * Endpoint: /scim/{version}/Users/{scimUserId}
     * Rate Limit Group: Light
     * App Permission: ReadAccounts
     */
    async get(restRequestConfig) {
        if (this.scimUserId === null) {
            throw new Error('scimUserId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a user
     * HTTP Method: put
     * Endpoint: /scim/{version}/Users/{scimUserId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     */
    async put(scimUser, restRequestConfig) {
        if (this.scimUserId === null) {
            throw new Error('scimUserId must be specified.');
        }
        const r = await this.rc.put(this.path(), scimUser, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a user
     * HTTP Method: delete
     * Endpoint: /scim/{version}/Users/{scimUserId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     */
    async delete(restRequestConfig) {
        if (this.scimUserId === null) {
            throw new Error('scimUserId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a user (partial update)
     * HTTP Method: patch
     * Endpoint: /scim/{version}/Users/{scimUserId}
     * Rate Limit Group: Heavy
     * App Permission: EditAccounts
     */
    async patch(scimUserPatch, restRequestConfig) {
        if (this.scimUserId === null) {
            throw new Error('scimUserId must be specified.');
        }
        const r = await this.rc.patch(this.path(), scimUserPatch, undefined, restRequestConfig);
        return r.data;
    }
    dotSearch() {
        return new DotSearch_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2568:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ServiceProviderConfig_1 = __importDefault(__webpack_require__(9287));
const ResourceTypes_1 = __importDefault(__webpack_require__(678));
const Schemas_1 = __importDefault(__webpack_require__(4803));
const Users_1 = __importDefault(__webpack_require__(431));
class Index {
    constructor(rc, version = 'v2') {
        this.rc = rc;
        this.version = version;
    }
    path(withParameter = true) {
        if (withParameter && this.version !== null) {
            return `/scim/${this.version}`;
        }
        return '/scim';
    }
    users(scimUserId = null) {
        return new Users_1.default(this, scimUserId);
    }
    schemas(uri = null) {
        return new Schemas_1.default(this, uri);
    }
    resourceTypes(type = null) {
        return new ResourceTypes_1.default(this, type);
    }
    serviceProviderConfig() {
        return new ServiceProviderConfig_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8347:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, cardId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.cardId = cardId;
    }
    path(withParameter = true) {
        if (withParameter && this.cardId !== null) {
            return `${this._parent.path()}/adaptive-cards/${this.cardId}`;
        }
        return `${this._parent.path()}/adaptive-cards`;
    }
    /**
     * Returns adaptive card(s) with given id(s).
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/adaptive-cards/{cardId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.cardId === null) {
            throw new Error('cardId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates an adaptive card.
     * HTTP Method: put
     * Endpoint: /team-messaging/v1/adaptive-cards/{cardId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async put(adaptiveCardRequest, restRequestConfig) {
        if (this.cardId === null) {
            throw new Error('cardId must be specified.');
        }
        const r = await this.rc.put(this.path(), adaptiveCardRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes an adaptive card by ID.
     * HTTP Method: delete
     * Endpoint: /team-messaging/v1/adaptive-cards/{cardId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async delete(restRequestConfig) {
        if (this.cardId === null) {
            throw new Error('cardId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4935:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/adaptive-cards`;
    }
    /**
     * Creates a new adaptive card in the chat specified in path.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/chats/{chatId}/adaptive-cards
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(adaptiveCardRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), adaptiveCardRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3234:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/favorite`;
    }
    /**
     * Adds the specified chat to the users's list of favorite chats.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/chats/{chatId}/favorite
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8219:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/notes`;
    }
    /**
     * Returns the list of chat notes.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/chats/{chatId}/notes
     * Rate Limit Group: Heavy
     * App Permission: TeamMessaging
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new note in the specified chat.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/chats/{chatId}/notes
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMCreateNoteRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), tMCreateNoteRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8853:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, postId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.postId = postId;
    }
    path(withParameter = true) {
        if (withParameter && this.postId !== null) {
            return `${this._parent.path()}/posts/${this.postId}`;
        }
        return `${this._parent.path()}/posts`;
    }
    /**
     * Returns a list of posts from the specified chat.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/chats/{chatId}/posts
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a post in the chat specified in path. Any mention can be added within the `text` attribute of the request body in .md format - `![:Type](id)`, where `type` is one of (Person, Team, File, Note, Task, Event, Link, Card) and `id` is a unique identifier of the mentioned object of the specified type. Attachments of the following types (File, Card, Event, Note) can also be added to a post by passing type and ID of attachment(s) in request body.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/chats/{chatId}/posts
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMCreatePostRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), tMCreatePostRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns information about the specified post.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/chats/{chatId}/posts/{postId}
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.postId === null) {
            throw new Error('postId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes the specified post from the chat.
     * HTTP Method: delete
     * Endpoint: /team-messaging/v1/chats/{chatId}/posts/{postId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async delete(restRequestConfig) {
        if (this.postId === null) {
            throw new Error('postId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a specific post within a chat.
     * HTTP Method: patch
     * Endpoint: /team-messaging/v1/chats/{chatId}/posts/{postId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async patch(tMUpdatePostRequest, restRequestConfig) {
        if (this.postId === null) {
            throw new Error('postId must be specified.');
        }
        const r = await this.rc.patch(this.path(), tMUpdatePostRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6028:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/tasks`;
    }
    /**
     * Returns the list of tasks of the specified chat.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/chats/{chatId}/tasks
     * Rate Limit Group: Heavy
     * App Permission: TeamMessaging
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a task in the specified chat.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/chats/{chatId}/tasks
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMCreateTaskRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), tMCreateTaskRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5510:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/unfavorite`;
    }
    /**
     * Removes the specified chat from the users's list of favorite chats.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/chats/{chatId}/unfavorite
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3065:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AdaptiveCards_1 = __importDefault(__webpack_require__(4935));
const Unfavorite_1 = __importDefault(__webpack_require__(5510));
const Favorite_1 = __importDefault(__webpack_require__(3234));
const Notes_1 = __importDefault(__webpack_require__(8219));
const Tasks_1 = __importDefault(__webpack_require__(6028));
const Posts_1 = __importDefault(__webpack_require__(8853));
class Index {
    constructor(_parent, chatId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.chatId = chatId;
    }
    path(withParameter = true) {
        if (withParameter && this.chatId !== null) {
            return `${this._parent.path()}/chats/${this.chatId}`;
        }
        return `${this._parent.path()}/chats`;
    }
    /**
     * Returns the list of chats where the user is a member and also public teams that can be joined.
     *
     * All records in response are sorted by creation time of a chat in ascending order.
     *
     * **Chat types**
     *
     * There are multiple types of chats, including:
     *
     * * **Personal** - each user is given a dedicated "personal chat" in which they are the only member.
     * * **Direct** - a chat between two individuals.
     * * **Group** - a chat between three or more named individuals. A "group" chat has no name.
     * * **Team** - a chat related to a specific topic. Members can come and go freely from this chat type.
     * * **Everyone** - a special chat containing every individual in a company.
     *
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/chats
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns information about a chat by ID.
     *
     * **Note** 'Chat' is a general name for all types of threads including *Personal* (user's own me-chat), *Direct* (one on one chat), *Group* (chat of 3-15 participants without specific name), *Team* (chat of 2 and more participants, with a specific name), *Everyone* (company chat including all employees, with a specific name)."
     *
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/chats/{chatId}
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.chatId === null) {
            throw new Error('chatId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    posts(postId = null) {
        return new Posts_1.default(this, postId);
    }
    tasks() {
        return new Tasks_1.default(this);
    }
    notes() {
        return new Notes_1.default(this);
    }
    favorite() {
        return new Favorite_1.default(this);
    }
    unfavorite() {
        return new Unfavorite_1.default(this);
    }
    adaptiveCards() {
        return new AdaptiveCards_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7553:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, companyId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.companyId = companyId;
    }
    path(withParameter = true) {
        if (withParameter && this.companyId !== null) {
            return `${this._parent.path()}/companies/${this.companyId}`;
        }
        return `${this._parent.path()}/companies`;
    }
    /**
     * Returns information about one or more companies by their IDs.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/companies/{companyId}
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.companyId === null) {
            throw new Error('companyId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 694:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, chatId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.chatId = chatId;
    }
    path(withParameter = true) {
        if (withParameter && this.chatId !== null) {
            return `${this._parent.path()}/conversations/${this.chatId}`;
        }
        return `${this._parent.path()}/conversations`;
    }
    /**
     * Returns the list of conversations where the user is a member. All records in response are sorted by creation time of a conversation in ascending order. Conversation is a chat of the *Group* type.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/conversations
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new conversation or opens the existing one. If the conversation already exists, then its ID will be returned in response. A conversation is an adhoc discussion between a particular set of users, not featuring any specific name or description; it is a chat of 'Group' type. If you add a person to the existing conversation (group), it creates a whole new conversation.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/conversations
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(createConversationRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createConversationRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns information about the specified conversation, including the list of conversation participants. A conversation is an adhoc discussion between a particular set of users, not featuring any specific name or description; it is a chat of 'Group' type. If you add a person to the existing conversation, it creates a whole new conversation.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/conversations/{chatId}
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.chatId === null) {
            throw new Error('chatId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3764:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, taskId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.taskId = taskId;
    }
    path(withParameter = true) {
        if (withParameter && this.taskId !== null) {
            return `${this._parent.path()}/data-export/${this.taskId}`;
        }
        return `${this._parent.path()}/data-export`;
    }
    /**
     * Returns the list of Glip data export tasks.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/data-export
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     * User Permission: Glip
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a task for Glip data export and returns a link at which the exported data will be available in future once the task is implemented. The exported data can be downloaded by calling Get Data Export Task method with the specified task ID. Simultaneously no more than 2 tasks per company can be created.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/data-export
     * Rate Limit Group: Heavy
     * App Permission: TeamMessaging
     * User Permission: Glip
     */
    async post(createDataExportTaskRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createDataExportTaskRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the links for downloading Glip data exported within the specified task. If the export task is still in progress, then only the task status will be returned. If the data is ready for downloading, then the list of URLs will be returned.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/data-export/{taskId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     * User Permission: Glip
     */
    async get(restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7476:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, eventId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.eventId = eventId;
    }
    path(withParameter = true) {
        if (withParameter && this.eventId !== null) {
            return `${this._parent.path()}/events/${this.eventId}`;
        }
        return `${this._parent.path()}/events`;
    }
    /**
     * Returns all calendar events created by the current user.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/events
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new calendar event.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/events
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMCreateEventRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), tMCreateEventRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the specified calendar event(s) by ID(s).
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/events/{eventId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.eventId === null) {
            throw new Error('eventId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the specified calendar event.
     * HTTP Method: put
     * Endpoint: /team-messaging/v1/events/{eventId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async put(tMCreateEventRequest, restRequestConfig) {
        if (this.eventId === null) {
            throw new Error('eventId must be specified.');
        }
        const r = await this.rc.put(this.path(), tMCreateEventRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes the specified calendar event.
     * HTTP Method: delete
     * Endpoint: /team-messaging/v1/events/{eventId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async delete(restRequestConfig) {
        if (this.eventId === null) {
            throw new Error('eventId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2275:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/everyone`;
    }
    /**
     * Returns information about "Everyone" chat (a company level chat which includes all employees).
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/everyone
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates "Everyone" chat information.
     * HTTP Method: patch
     * Endpoint: /team-messaging/v1/everyone
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async patch(updateEveryoneTeamRequest, restRequestConfig) {
        const r = await this.rc.patch(this.path(), updateEveryoneTeamRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5095:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/favorites`;
    }
    /**
     * Returns a list of the current user's favorite chats.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/favorites
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7761:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Utils_1 = __importDefault(__webpack_require__(7097));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/files`;
    }
    /**
     * Posts a file.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/files
     * Rate Limit Group: Heavy
     * App Permission: TeamMessaging
     */
    async post(createGlipFileNewRequest, queryParams, restRequestConfig) {
        const formData = await Utils_1.default.getFormData(createGlipFileNewRequest);
        const r = await this.rc.post(this.path(), formData, queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8026:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/events`;
    }
    /**
     * Returns a list of calendar events available for the current user within the specified group. Users can only see their personal tasks and public tasks.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/groups/{groupId}/events
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new calendar event within the specified group.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/groups/{groupId}/events
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMCreateEventRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), tMCreateEventRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1933:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/webhooks`;
    }
    /**
     * Returns webhooks which are available for the current user by group ID.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/groups/{groupId}/webhooks
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new webhook.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/groups/{groupId}/webhooks
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8042:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Webhooks_1 = __importDefault(__webpack_require__(1933));
const Events_1 = __importDefault(__webpack_require__(8026));
class Index {
    constructor(_parent, groupId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.groupId = groupId;
    }
    path(withParameter = true) {
        if (withParameter && this.groupId !== null) {
            return `${this._parent.path()}/groups/${this.groupId}`;
        }
        return `${this._parent.path()}/groups`;
    }
    events() {
        return new Events_1.default(this);
    }
    webhooks() {
        return new Webhooks_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8207:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/lock`;
    }
    /**
     * Locks a note providing the user with the unique write access for 5 hours.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/notes/{noteId}/lock
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4395:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/publish`;
    }
    /**
     * Publishes a note making it visible to other users.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/notes/{noteId}/publish
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 896:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/unlock`;
    }
    /**
     * Unlocks a note letting other users edit this note. Once the note is locked (by another user) it cannot be unlocked during 5 hours since the lock datetime.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/notes/{noteId}/unlock
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2247:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Publish_1 = __importDefault(__webpack_require__(4395));
const Unlock_1 = __importDefault(__webpack_require__(896));
const Lock_1 = __importDefault(__webpack_require__(8207));
class Index {
    constructor(_parent, noteId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.noteId = noteId;
    }
    path(withParameter = true) {
        if (withParameter && this.noteId !== null) {
            return `${this._parent.path()}/notes/${this.noteId}`;
        }
        return `${this._parent.path()}/notes`;
    }
    /**
     * Returns the specified note(s). It is possible to fetch up to 50 notes per request.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/notes/{noteId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.noteId === null) {
            throw new Error('noteId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes the specified note.
     * HTTP Method: delete
     * Endpoint: /team-messaging/v1/notes/{noteId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async delete(restRequestConfig) {
        if (this.noteId === null) {
            throw new Error('noteId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Edits a note. Notes can be edited by any user if posted to a chat. the user belongs to.
     * HTTP Method: patch
     * Endpoint: /team-messaging/v1/notes/{noteId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async patch(tMCreateNoteRequest, queryParams, restRequestConfig) {
        if (this.noteId === null) {
            throw new Error('noteId must be specified.');
        }
        const r = await this.rc.patch(this.path(), tMCreateNoteRequest, queryParams, restRequestConfig);
        return r.data;
    }
    lock() {
        return new Lock_1.default(this);
    }
    unlock() {
        return new Unlock_1.default(this);
    }
    publish() {
        return new Publish_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5440:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, personId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.personId = personId;
    }
    path(withParameter = true) {
        if (withParameter && this.personId !== null) {
            return `${this._parent.path()}/persons/${this.personId}`;
        }
        return `${this._parent.path()}/persons`;
    }
    /**
     * Returns a user or multiple users by their ID(s). Batch request is supported.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/persons/{personId}
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.personId === null) {
            throw new Error('personId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 521:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/chats`;
    }
    /**
     * Returns recent chats where the user is a member. All records in response are sorted by the `lastModifiedTime` in descending order (the latest changed chat is displayed first on page)
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/recent/chats
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4189:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Chats_1 = __importDefault(__webpack_require__(521));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/recent`;
    }
    chats() {
        return new Chats_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 670:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/complete`;
    }
    /**
     * Completes a task in the specified chat.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/tasks/{taskId}/complete
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMCompleteTaskRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), tMCompleteTaskRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8176:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Complete_1 = __importDefault(__webpack_require__(670));
class Index {
    constructor(_parent, taskId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.taskId = taskId;
    }
    path(withParameter = true) {
        if (withParameter && this.taskId !== null) {
            return `${this._parent.path()}/tasks/${this.taskId}`;
        }
        return `${this._parent.path()}/tasks`;
    }
    /**
     * Returns information about the specified task(s) by ID(s).
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/tasks/{taskId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes the specified task.
     * HTTP Method: delete
     * Endpoint: /team-messaging/v1/tasks/{taskId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async delete(restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the specified task by ID.
     * HTTP Method: patch
     * Endpoint: /team-messaging/v1/tasks/{taskId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async patch(tMUpdateTaskRequest, restRequestConfig) {
        if (this.taskId === null) {
            throw new Error('taskId must be specified.');
        }
        const r = await this.rc.patch(this.path(), tMUpdateTaskRequest, undefined, restRequestConfig);
        return r.data;
    }
    complete() {
        return new Complete_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4200:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/add`;
    }
    /**
     * Adds members to the specified team.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/teams/{chatId}/add
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMAddTeamMembersRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), tMAddTeamMembersRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4617:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/archive`;
    }
    /**
     * Changes the status of the specified team to 'Archived'.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/teams/{chatId}/archive
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4357:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/join`;
    }
    /**
     * Adds the current user to the specified team.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/teams/{chatId}/join
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 748:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/leave`;
    }
    /**
     * Removes the current user from the specified team.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/teams/{chatId}/leave
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5713:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/remove`;
    }
    /**
     * Removes members from the specified team.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/teams/{chatId}/remove
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMRemoveTeamMembersRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(), tMRemoveTeamMembersRequest, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 892:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/unarchive`;
    }
    /**
     * Changes the status of the specified team to 'Active'.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/teams/{chatId}/unarchive
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9076:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Unarchive_1 = __importDefault(__webpack_require__(892));
const Archive_1 = __importDefault(__webpack_require__(4617));
const Remove_1 = __importDefault(__webpack_require__(5713));
const Leave_1 = __importDefault(__webpack_require__(748));
const Join_1 = __importDefault(__webpack_require__(4357));
const Add_1 = __importDefault(__webpack_require__(4200));
class Index {
    constructor(_parent, chatId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.chatId = chatId;
    }
    path(withParameter = true) {
        if (withParameter && this.chatId !== null) {
            return `${this._parent.path()}/teams/${this.chatId}`;
        }
        return `${this._parent.path()}/teams`;
    }
    /**
     * Returns the list of teams where the user is a member (both archived and active) combined with a list of public teams that can be joined by the current user. All records in response are sorted by creation time of a chat in ascending order. A team is a chat between 2 and more (unlimited number) participants assigned with specific name.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/teams
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a team, and adds a list of people to the team.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/teams
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(tMCreateTeamRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), tMCreateTeamRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns information about the specified team.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/teams/{chatId}
     * Rate Limit Group: Light
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.chatId === null) {
            throw new Error('chatId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes the specified team.
     * HTTP Method: delete
     * Endpoint: /team-messaging/v1/teams/{chatId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async delete(restRequestConfig) {
        if (this.chatId === null) {
            throw new Error('chatId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the name and description of the specified team.
     * HTTP Method: patch
     * Endpoint: /team-messaging/v1/teams/{chatId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async patch(tMUpdateTeamRequest, restRequestConfig) {
        if (this.chatId === null) {
            throw new Error('chatId must be specified.');
        }
        const r = await this.rc.patch(this.path(), tMUpdateTeamRequest, undefined, restRequestConfig);
        return r.data;
    }
    add() {
        return new Add_1.default(this);
    }
    join() {
        return new Join_1.default(this);
    }
    leave() {
        return new Leave_1.default(this);
    }
    remove() {
        return new Remove_1.default(this);
    }
    archive() {
        return new Archive_1.default(this);
    }
    unarchive() {
        return new Unarchive_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2716:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/activate`;
    }
    /**
     * Activates a webhook by ID.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/webhooks/{webhookId}/activate
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3491:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/suspend`;
    }
    /**
     * Suspends a webhook by ID.
     * HTTP Method: post
     * Endpoint: /team-messaging/v1/webhooks/{webhookId}/suspend
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8020:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Activate_1 = __importDefault(__webpack_require__(2716));
const Suspend_1 = __importDefault(__webpack_require__(3491));
class Index {
    constructor(_parent, webhookId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.webhookId = webhookId;
    }
    path(withParameter = true) {
        if (withParameter && this.webhookId !== null) {
            return `${this._parent.path()}/webhooks/${this.webhookId}`;
        }
        return `${this._parent.path()}/webhooks`;
    }
    /**
     * Returns the list of all webhooks associated with the current account.
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/webhooks
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns webhooks(s) with the specified id(s).
     * HTTP Method: get
     * Endpoint: /team-messaging/v1/webhooks/{webhookId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async get(restRequestConfig) {
        if (this.webhookId === null) {
            throw new Error('webhookId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a webhook by ID.
     * HTTP Method: delete
     * Endpoint: /team-messaging/v1/webhooks/{webhookId}
     * Rate Limit Group: Medium
     * App Permission: TeamMessaging
     */
    async delete(restRequestConfig) {
        if (this.webhookId === null) {
            throw new Error('webhookId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    suspend() {
        return new Suspend_1.default(this);
    }
    activate() {
        return new Activate_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 669:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AdaptiveCards_1 = __importDefault(__webpack_require__(8347));
const Conversations_1 = __importDefault(__webpack_require__(694));
const DataExport_1 = __importDefault(__webpack_require__(3764));
const Favorites_1 = __importDefault(__webpack_require__(5095));
const Companies_1 = __importDefault(__webpack_require__(7553));
const Everyone_1 = __importDefault(__webpack_require__(2275));
const Webhooks_1 = __importDefault(__webpack_require__(8020));
const Persons_1 = __importDefault(__webpack_require__(5440));
const Events_1 = __importDefault(__webpack_require__(7476));
const Recent_1 = __importDefault(__webpack_require__(4189));
const Groups_1 = __importDefault(__webpack_require__(8042));
const Files_1 = __importDefault(__webpack_require__(7761));
const Notes_1 = __importDefault(__webpack_require__(2247));
const Teams_1 = __importDefault(__webpack_require__(9076));
const Chats_1 = __importDefault(__webpack_require__(3065));
const Tasks_1 = __importDefault(__webpack_require__(8176));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    tasks(taskId = null) {
        return new Tasks_1.default(this, taskId);
    }
    chats(chatId = null) {
        return new Chats_1.default(this, chatId);
    }
    teams(chatId = null) {
        return new Teams_1.default(this, chatId);
    }
    notes(noteId = null) {
        return new Notes_1.default(this, noteId);
    }
    files() {
        return new Files_1.default(this);
    }
    groups(groupId = null) {
        return new Groups_1.default(this, groupId);
    }
    recent() {
        return new Recent_1.default(this);
    }
    events(eventId = null) {
        return new Events_1.default(this, eventId);
    }
    persons(personId = null) {
        return new Persons_1.default(this, personId);
    }
    webhooks(webhookId = null) {
        return new Webhooks_1.default(this, webhookId);
    }
    everyone() {
        return new Everyone_1.default(this);
    }
    companies(companyId = null) {
        return new Companies_1.default(this, companyId);
    }
    favorites() {
        return new Favorites_1.default(this);
    }
    dataExport(taskId = null) {
        return new DataExport_1.default(this, taskId);
    }
    conversations(chatId = null) {
        return new Conversations_1.default(this, chatId);
    }
    adaptiveCards(cardId = null) {
        return new AdaptiveCards_1.default(this, cardId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9071:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(669));
class Index {
    constructor(rc) {
        this.rc = rc;
    }
    path() {
        return '/team-messaging';
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3407:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/sessions`;
    }
    /**
     * Returns the list of Webinar Sessions hosted by all company users or particular user(s) sorted by
     * 'scheduledStartTime' or 'creationTime' (if 'scheduledStartTime' is not set) in the ascending ordered.
     * The user must have "WebinarSettings" permission granted otherwise the API returns HTTP 403.
     *
     * HTTP Method: get
     * Endpoint: /webinar/configuration/v1/company/sessions
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3389:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Sessions_1 = __importDefault(__webpack_require__(3407));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/company`;
    }
    sessions() {
        return new Sessions_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8175:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/sessions`;
    }
    /**
     * Returns the list of Webinar Sessions hosted by a current authorized user sorted by
     * 'scheduledStartTime' or 'creationTime' (if 'scheduledStartTime' is not set) in the ascending order
     *
     * HTTP Method: get
     * Endpoint: /webinar/configuration/v1/sessions
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4021:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, inviteeId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.inviteeId = inviteeId;
    }
    path(withParameter = true) {
        if (withParameter && this.inviteeId !== null) {
            return `${this._parent.path()}/invitees/${this.inviteeId}`;
        }
        return `${this._parent.path()}/invitees`;
    }
    /**
     * Returns the list of Invitees (co-hosts and panelists in phase 1
     * and also invited attendees in subsequent phases) of a given Webinar Session.
     * An implicit record created for a Webinar 'Host' is always returned.
     *
     * HTTP Method: get
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions/{sessionId}/invitees
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Adds, updates and deletes Webinar Session invitees in bulk (co-hosts and panelists in phase 1
     * and also invited attendees in subsequent phases).
     * The payload may contain multiple added, updated or deleted invitees.
     * For each added record 'role' and either 'firstName'/'lastName'/'email' (for non-authenticated users)
     * or 'linkedUser.*' (for authenticated users) must be specified, but not both.
     * For updated invitees 'id'  and 'role' must be specified, 'linkedUser' change is not supported.
     * For deleted invitees only there ids should be specified.
     * The response contains added/updated records (full) and deleted records (ids only).
     *
     * Deleting an invitee for a Session in 'Active' or 'Finished' status is prohibited.
     *
     * HTTP Method: patch
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions/{sessionId}/invitees
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async patch(bulkUpdateInviteesRequest, restRequestConfig) {
        const r = await this.rc.patch(this.path(false), bulkUpdateInviteesRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a Session Invitee information by ID
     * HTTP Method: get
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions/{sessionId}/invitees/{inviteeId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.inviteeId === null) {
            throw new Error('inviteeId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a Session Invitee. 'role' is required (it can be changed from 'Panelist' to 'CoHost' or vise versa).
     * It is disallowed to update 'linkedUser': it should be done by deleting then adding an invitee.
     * For non-authenticated users 'firstName'/'lastName'/'email' can be specified, but not both.
     * Implicit record created for a Webinar 'Host' cannot be modified.
     * Also it is disallowed to change any other role to 'Host'.
     *
     * HTTP Method: put
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions/{sessionId}/invitees/{inviteeId}
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async put(updateInviteeRequest, restRequestConfig) {
        if (this.inviteeId === null) {
            throw new Error('inviteeId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateInviteeRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a Session Invitee. Implicit record created for a Webinar 'Host' cannot be deleted.
     * Deleting an invitee for a Session in 'Active' or 'Finished' status is prohibited (HTTP 403).
     *
     * HTTP Method: delete
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions/{sessionId}/invitees/{inviteeId}
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async delete(restRequestConfig) {
        if (this.inviteeId === null) {
            throw new Error('inviteeId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4491:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Invitees_1 = __importDefault(__webpack_require__(4021));
class Index {
    constructor(_parent, sessionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.sessionId = sessionId;
    }
    path(withParameter = true) {
        if (withParameter && this.sessionId !== null) {
            return `${this._parent.path()}/sessions/${this.sessionId}`;
        }
        return `${this._parent.path()}/sessions`;
    }
    /**
     * Creates a new Session for a given Webinar
     * HTTP Method: post
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async post(wcsSessionWithLocaleCodeModel, restRequestConfig) {
        const r = await this.rc.post(this.path(false), wcsSessionWithLocaleCodeModel, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a Webinar Session by ID.
     * HTTP Method: get
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions/{sessionId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.sessionId === null) {
            throw new Error('sessionId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a Webinar Session. All child objects (Invitees) will be also deleted.
     * It is disallowed to delete a Session which is in 'Active' or 'Finished' state
     *
     * HTTP Method: delete
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions/{sessionId}
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async delete(restRequestConfig) {
        if (this.sessionId === null) {
            throw new Error('sessionId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a Webinar Session. The payload may contain certain attributes from the Session resource
     * (it is a partial update). Changing the 'status' field usually invokes certain workflow actions.
     * Updating a Session in 'Active' or 'Finished' status is prohibited.
     * Some status transitions (for example, to 'Active" or 'Finished') may be prohibited.
     *
     * HTTP Method: patch
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}/sessions/{sessionId}
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async patch(wcsSessionWithLocaleCodeModel, restRequestConfig) {
        if (this.sessionId === null) {
            throw new Error('sessionId must be specified.');
        }
        const r = await this.rc.patch(this.path(), wcsSessionWithLocaleCodeModel, undefined, restRequestConfig);
        return r.data;
    }
    invitees(inviteeId = null) {
        return new Invitees_1.default(this, inviteeId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5425:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Sessions_1 = __importDefault(__webpack_require__(4491));
class Index {
    constructor(_parent, webinarId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.webinarId = webinarId;
    }
    path(withParameter = true) {
        if (withParameter && this.webinarId !== null) {
            return `${this._parent.path()}/webinars/${this.webinarId}`;
        }
        return `${this._parent.path()}/webinars`;
    }
    /**
     * Returns the list of Webinars hosted by a current authorized user sorted by 'scheduledStartTime' or 'creationTime' in the ascending order.
     *
     * HTTP Method: get
     * Endpoint: /webinar/configuration/v1/webinars
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new webinar.
     *
     * If "host" parameter is NOT passed then the current authorized user will become a Host.
     * If "host" parameter is passed then the caller must be a company administrator and have "WebinarSettings" permission.
     * "host.linkedUser.accountId" must be the same as authorized user's account ID.
     *
     * The webinar settings which are not mandated at account level or are unlocked can be
     * specified. All other settings are defaulted according to account policy.
     *
     * HTTP Method: post
     * Endpoint: /webinar/configuration/v1/webinars
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async post(webinarCreationRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), webinarCreationRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a Webinar information by ID.
     * Some webinar settings are returned basing on webinar-level overrides, other - from default settings defined at account level.
     *
     * HTTP Method: get
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.webinarId === null) {
            throw new Error('webinarId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a Webinar by ID. All child objects (Sessions, Invitees) will be also deleted.
     * It is disallowed to delete a Webinar which has at least one Session in 'Active' or 'Finished' state.
     *
     * HTTP Method: delete
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async delete(restRequestConfig) {
        if (this.webinarId === null) {
            throw new Error('webinarId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a Webinar. The payload may contain just changed fields of a Webinar resource (it is a partial update):
     * - host cannot be changed and host user information cannot be updated;
     * - only the settings which are not mandated at account level or are unlocked can be
     * changed;
     * - in order to reset a webinar password it should be passed as an empty string;
     * - "registrationStatus" cannot be changed.
     *
     * HTTP Method: patch
     * Endpoint: /webinar/configuration/v1/webinars/{webinarId}
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async patch(webinarBaseModel, restRequestConfig) {
        if (this.webinarId === null) {
            throw new Error('webinarId must be specified.');
        }
        const r = await this.rc.patch(this.path(), webinarBaseModel, undefined, restRequestConfig);
        return r.data;
    }
    sessions(sessionId = null) {
        return new Sessions_1.default(this, sessionId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 701:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Sessions_1 = __importDefault(__webpack_require__(8175));
const Webinars_1 = __importDefault(__webpack_require__(5425));
const Company_1 = __importDefault(__webpack_require__(3389));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    company() {
        return new Company_1.default(this);
    }
    webinars(webinarId = null) {
        return new Webinars_1.default(this, webinarId);
    }
    sessions() {
        return new Sessions_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1823:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(701));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/configuration`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6052:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, recordingId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.recordingId = recordingId;
    }
    path(withParameter = true) {
        if (withParameter && this.recordingId !== null) {
            return `${this._parent.path()}/recordings/${this.recordingId}`;
        }
        return `${this._parent.path()}/recordings`;
    }
    /**
     * Returns the list of webinar recordings (Administrator's interface).
     * The user must have "WebinarSettings" permission granted otherwise the API returns HTTP 403.
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/company/recordings
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the webinar recording by ID (Administrator's interface).
     *
     * The user must have "WebinarSettings" permission granted otherwise the API returns HTTP 403.
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/company/recordings/{recordingId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.recordingId === null) {
            throw new Error('recordingId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2449:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/sessions`;
    }
    /**
     * Returns the list of historical Webinar Sessions hosted by particular user(s) or all company users
     * sorted by 'endTime' in the descending order. Depending on a session status 'endTime' can
     * represent actual end time or scheduled end time.
     * The user must have "WebinarSettings" permission granted otherwise the API returns HTTP 403.
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/company/sessions
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5463:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Recordings_1 = __importDefault(__webpack_require__(6052));
const Sessions_1 = __importDefault(__webpack_require__(2449));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/company`;
    }
    sessions() {
        return new Sessions_1.default(this);
    }
    recordings(recordingId = null) {
        return new Recordings_1.default(this, recordingId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3709:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/download`;
    }
    /**
     * Returns the webinar recording download link (both Webinar host's and admin interface).
     *
     * If called by a webinar host, the API returns error (403) if recording downloading is prohibited by company settings.
     * The admin user who has "WebinarSettings" permission should be able to download recording regardless of current company settings.
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/recordings/{recordingId}/download
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6380:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Download_1 = __importDefault(__webpack_require__(3709));
class Index {
    constructor(_parent, recordingId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.recordingId = recordingId;
    }
    path(withParameter = true) {
        if (withParameter && this.recordingId !== null) {
            return `${this._parent.path()}/recordings/${this.recordingId}`;
        }
        return `${this._parent.path()}/recordings`;
    }
    /**
     * Returns the list of webinar recordings for a given webinar host user
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/recordings
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the webinar recording by ID (Webinar host's interface).
     * This API also returns sharing link if sharing is enabled.
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/recordings/{recordingId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.recordingId === null) {
            throw new Error('recordingId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    download() {
        return new Download_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2809:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/sessions`;
    }
    /**
     * Returns the list of historical Webinar Sessions hosted by a current authorized user
     * sorted by 'endTime' in the descending order. Depending on a session status 'endTime' can
     * represent actual end time or scheduled end time.
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/sessions
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7351:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, inviteeId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.inviteeId = inviteeId;
    }
    path(withParameter = true) {
        if (withParameter && this.inviteeId !== null) {
            return `${this._parent.path()}/invitees/${this.inviteeId}`;
        }
        return `${this._parent.path()}/invitees`;
    }
    /**
     * Returns the list of Invitees (co-hosts and panelists) of a given Webinar Session (host interface).
     * An implicit record created for a Webinar 'Host' is always returned.
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/webinars/{webinarId}/sessions/{sessionId}/invitees
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a historical session invitee information by ID (host interface).
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/webinars/{webinarId}/sessions/{sessionId}/invitees/{inviteeId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.inviteeId === null) {
            throw new Error('inviteeId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5647:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/self`;
    }
    /**
     * Returns the participant information specific to a webinar session. Accessible by any authenticated participant.
     * For a non-authenticated participant, API returns error.
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/webinars/{webinarId}/sessions/{sessionId}/participants/self
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2020:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Self_1 = __importDefault(__webpack_require__(5647));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/participants`;
    }
    /**
     * Returns the list of participants of a given Webinar Session (host interface).
     *
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/webinars/{webinarId}/sessions/{sessionId}/participants
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    self() {
        return new Self_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3697:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Participants_1 = __importDefault(__webpack_require__(2020));
const Invitees_1 = __importDefault(__webpack_require__(7351));
class Index {
    constructor(_parent, sessionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.sessionId = sessionId;
    }
    path(withParameter = true) {
        if (withParameter && this.sessionId !== null) {
            return `${this._parent.path()}/sessions/${this.sessionId}`;
        }
        return `${this._parent.path()}/sessions`;
    }
    /**
     * Returns a historical webinar Session by ID. Access allowed to participants with original role as Host or CoHost.
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/webinars/{webinarId}/sessions/{sessionId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.sessionId === null) {
            throw new Error('sessionId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    invitees(inviteeId = null) {
        return new Invitees_1.default(this, inviteeId);
    }
    participants() {
        return new Participants_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5575:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Sessions_1 = __importDefault(__webpack_require__(3697));
class Index {
    constructor(_parent, webinarId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.webinarId = webinarId;
    }
    path(withParameter = true) {
        if (withParameter && this.webinarId !== null) {
            return `${this._parent.path()}/webinars/${this.webinarId}`;
        }
        return `${this._parent.path()}/webinars`;
    }
    /**
     * Returns a historical webinar information by ID (host interface)
     * HTTP Method: get
     * Endpoint: /webinar/history/v1/webinars/{webinarId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.webinarId === null) {
            throw new Error('webinarId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    sessions(sessionId = null) {
        return new Sessions_1.default(this, sessionId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7151:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Recordings_1 = __importDefault(__webpack_require__(6380));
const Sessions_1 = __importDefault(__webpack_require__(2809));
const Webinars_1 = __importDefault(__webpack_require__(5575));
const Company_1 = __importDefault(__webpack_require__(5463));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    company() {
        return new Company_1.default(this);
    }
    webinars(webinarId = null) {
        return new Webinars_1.default(this, webinarId);
    }
    sessions() {
        return new Sessions_1.default(this);
    }
    recordings(recordingId = null) {
        return new Recordings_1.default(this, recordingId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 341:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(7151));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/history`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1504:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path()}/renew`;
    }
    /**
     * Renews the existing webinar subscription.
     * HTTP Method: post
     * Endpoint: /webinar/notifications/v1/subscriptions/{subscriptionId}/renew
     * Rate Limit Group: Light
     */
    async post(restRequestConfig) {
        const r = await this.rc.post(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5398:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Renew_1 = __importDefault(__webpack_require__(1504));
class Index {
    constructor(_parent, subscriptionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.subscriptionId = subscriptionId;
    }
    path(withParameter = true) {
        if (withParameter && this.subscriptionId !== null) {
            return `${this._parent.path()}/subscriptions/${this.subscriptionId}`;
        }
        return `${this._parent.path()}/subscriptions`;
    }
    /**
     * Returns a list of webinar subscriptions created by the user for the current authorized client application.
     * HTTP Method: get
     * Endpoint: /webinar/notifications/v1/subscriptions
     * Rate Limit Group: Light
     */
    async list(restRequestConfig) {
        const r = await this.rc.get(this.path(false), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new webinar subscription for the current authorized user / client application.
     * HTTP Method: post
     * Endpoint: /webinar/notifications/v1/subscriptions
     * Rate Limit Group: Medium
     */
    async post(createWebhookSubscriptionRequest, restRequestConfig) {
        const r = await this.rc.post(this.path(false), createWebhookSubscriptionRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns the webinar subscription by ID
     * HTTP Method: get
     * Endpoint: /webinar/notifications/v1/subscriptions/{subscriptionId}
     * Rate Limit Group: Light
     */
    async get(restRequestConfig) {
        if (this.subscriptionId === null) {
            throw new Error('subscriptionId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates the existing subscription. The client application can extend/narrow
     * the list of events for which it receives notifications within this subscription.
     * If event filters are specified, calling this method modifies them for the
     * existing subscription. The method also allows to set the subscription expiration time.
     * If other than `events` and `expiresIn` parameters are passed in the request they will be ignored.
     * If the request body is empty then the specified subscription will be just renewed without any
     * event filter modifications and with default expiration time.
     *
     * HTTP Method: put
     * Endpoint: /webinar/notifications/v1/subscriptions/{subscriptionId}
     * Rate Limit Group: Medium
     */
    async put(updateSubscriptionRequest, restRequestConfig) {
        if (this.subscriptionId === null) {
            throw new Error('subscriptionId must be specified.');
        }
        const r = await this.rc.put(this.path(), updateSubscriptionRequest, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Cancels the existing webinar subscription.
     * HTTP Method: delete
     * Endpoint: /webinar/notifications/v1/subscriptions/{subscriptionId}
     * Rate Limit Group: Medium
     */
    async delete(restRequestConfig) {
        if (this.subscriptionId === null) {
            throw new Error('subscriptionId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
    renew() {
        return new Renew_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8727:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Subscriptions_1 = __importDefault(__webpack_require__(5398));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    subscriptions(subscriptionId = null) {
        return new Subscriptions_1.default(this, subscriptionId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 797:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(8727));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/notifications`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9699:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Index {
    constructor(_parent, registrantId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.registrantId = registrantId;
    }
    path(withParameter = true) {
        if (withParameter && this.registrantId !== null) {
            return `${this._parent.path()}/registrants/${this.registrantId}`;
        }
        return `${this._parent.path()}/registrants`;
    }
    /**
     * Returns the list of Registrants ordered by "id" ascending.
     *
     * A caller must be an authorized user: either a host of the webinar or an IT Admin:
     * a user from host's account with "WebinarSettings" permission.
     *
     * HTTP Method: get
     * Endpoint: /webinar/registration/v1/sessions/{sessionId}/registrants
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async list(queryParams, restRequestConfig) {
        const r = await this.rc.get(this.path(false), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Creates a new Registrant for a given session.
     *
     * Registration MUST be open for the session for this call to succeed (otherwise it should return HTTP 403).
     *
     * A caller must be an authorized user: either a host of the webinar or an IT Admin:
     * a user from host's account with "WebinarSettings" permission.
     *
     * HTTP Method: post
     * Endpoint: /webinar/registration/v1/sessions/{sessionId}/registrants
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async post(registrantBaseModelWithQuestionnaire, restRequestConfig) {
        const r = await this.rc.post(this.path(false), registrantBaseModelWithQuestionnaire, undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Returns a Registrant by ID.
     *
     * A caller must be an authorized user: either a host of the webinar or an IT Admin:
     * a user from host's account with "WebinarSettings" permission.
     *
     * HTTP Method: get
     * Endpoint: /webinar/registration/v1/sessions/{sessionId}/registrants/{registrantId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(queryParams, restRequestConfig) {
        if (this.registrantId === null) {
            throw new Error('registrantId must be specified.');
        }
        const r = await this.rc.get(this.path(), queryParams, restRequestConfig);
        return r.data;
    }
    /**
     * Deletes a Registrant by ID.
     *
     * Session must not be in finished state (otherwise it should return HTTP 403).
     *
     * A caller must be an authorized user: either a host of the webinar or an IT Admin:
     * a user from host's account with "WebinarSettings" permission.
     *
     * HTTP Method: delete
     * Endpoint: /webinar/registration/v1/sessions/{sessionId}/registrants/{registrantId}
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async delete(restRequestConfig) {
        if (this.registrantId === null) {
            throw new Error('registrantId must be specified.');
        }
        const r = await this.rc.delete(this.path(), {}, undefined, restRequestConfig);
        return r.data;
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Registrants_1 = __importDefault(__webpack_require__(9699));
class Index {
    constructor(_parent, sessionId = null) {
        this._parent = _parent;
        this.rc = _parent.rc;
        this.sessionId = sessionId;
    }
    path(withParameter = true) {
        if (withParameter && this.sessionId !== null) {
            return `${this._parent.path()}/sessions/${this.sessionId}`;
        }
        return `${this._parent.path()}/sessions`;
    }
    /**
     * Returns a registration Session information by ID.
     *
     * A caller must be an authorized user: either a host of the webinar or an IT Admin:
     * a user from host's account with "WebinarSettings" permission.
     *
     * HTTP Method: get
     * Endpoint: /webinar/registration/v1/sessions/{sessionId}
     * Rate Limit Group: Heavy
     * App Permission: ReadWebinars
     */
    async get(restRequestConfig) {
        if (this.sessionId === null) {
            throw new Error('sessionId must be specified.');
        }
        const r = await this.rc.get(this.path(), undefined, restRequestConfig);
        return r.data;
    }
    /**
     * Updates a Session by ID.
     *
     * This is a PARTIAL update (PATCH), client may call it providing only attributes which are to be changed.
     *
     * A caller must be an authorized user: either a host of the webinar or an IT Admin:
     * a user from host's account with "WebinarSettings" permission.
     *
     * If a session record with given ID doesn't exist on Registration Service side the API should return HTTP 404.
     *
     * HTTP Method: patch
     * Endpoint: /webinar/registration/v1/sessions/{sessionId}
     * Rate Limit Group: Heavy
     * App Permission: EditWebinars
     */
    async patch(regSessionModel, restRequestConfig) {
        if (this.sessionId === null) {
            throw new Error('sessionId must be specified.');
        }
        const r = await this.rc.patch(this.path(), regSessionModel, undefined, restRequestConfig);
        return r.data;
    }
    registrants(registrantId = null) {
        return new Registrants_1.default(this, registrantId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9230:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Sessions_1 = __importDefault(__webpack_require__(2));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/v1`;
    }
    sessions(sessionId = null) {
        return new Sessions_1.default(this, sessionId);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1666:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const V1_1 = __importDefault(__webpack_require__(9230));
class Index {
    constructor(_parent) {
        this._parent = _parent;
        this.rc = _parent.rc;
    }
    path() {
        return `${this._parent.path(false)}/registration`;
    }
    v1() {
        return new V1_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6354:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Configuration_1 = __importDefault(__webpack_require__(1823));
const Notifications_1 = __importDefault(__webpack_require__(797));
const Registration_1 = __importDefault(__webpack_require__(1666));
const History_1 = __importDefault(__webpack_require__(341));
class Index {
    constructor(rc) {
        this.rc = rc;
    }
    path() {
        return '/webinar';
    }
    history() {
        return new History_1.default(this);
    }
    registration() {
        return new Registration_1.default(this);
    }
    notifications() {
        return new Notifications_1.default(this);
    }
    configuration() {
        return new Configuration_1.default(this);
    }
}
exports["default"] = Index;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2916:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const SdkExtension_1 = __importDefault(__webpack_require__(8059));
const RestException_1 = __importDefault(__webpack_require__(7087));
class RcSdkExtension extends SdkExtension_1.default {
    constructor(options) {
        super();
        this.options = options;
    }
    async install(rc) {
        Object.defineProperty(rc, 'token', {
            get: async () => this.options.rcSdk.platform().auth().data(),
        });
        const request = rc.request.bind(rc);
        rc.request = async (method, endpoint, content, queryParams, config) => {
            if (!this.enabled) {
                return request(method, endpoint, content, queryParams, config);
            }
            const r = await this.options.rcSdk.send({
                method,
                url: endpoint,
                body: content,
                query: queryParams,
                headers: config === null || config === void 0 ? void 0 : config.headers,
            });
            const response = {
                data: await r.json(),
                status: r.status,
                statusText: r.statusText,
                headers: r.headers,
                config: {
                    method,
                    baseURL: r.url.split(endpoint)[0],
                    url: endpoint,
                    data: content,
                    params: queryParams,
                },
            };
            if (r.ok) {
                return response;
            }
            throw new RestException_1.default(response);
        };
    }
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
    async revoke() { }
}
exports["default"] = RcSdkExtension;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 161:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class ClosedException extends Error {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : 'WebSocket has been closed');
    }
}
exports["default"] = ClosedException;
//# sourceMappingURL=ClosedException.js.map

/***/ }),

/***/ 8645:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __importDefault(__webpack_require__(7508));
class ConnectionException extends Error {
    constructor(wsgEvent) {
        const [, wsgError] = utils_1.default.splitWsgData(wsgEvent.data);
        super(JSON.stringify(wsgError, null, 2));
        this.wsgEvent = wsgEvent;
        this.wsgError = wsgError;
    }
}
exports["default"] = ConnectionException;
//# sourceMappingURL=ConnectionException.js.map

/***/ }),

/***/ 9754:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class TimeoutException extends Error {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : 'Failed to receive expected WebSocket message in time.');
    }
}
exports["default"] = TimeoutException;
//# sourceMappingURL=TimeoutException.js.map

/***/ }),

/***/ 1241:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Events = void 0;
const SdkExtension_1 = __importDefault(__webpack_require__(8059));
const isomorphic_ws_1 = __importDefault(__webpack_require__(2501));
const hyperid_1 = __importDefault(__webpack_require__(8811));
const events_1 = __webpack_require__(6827);
const wait_for_async_1 = __importDefault(__webpack_require__(8335));
const RestException_1 = __importDefault(__webpack_require__(7087));
const rest_1 = __webpack_require__(6311);
const subscription_1 = __importDefault(__webpack_require__(3788));
const ConnectionException_1 = __importDefault(__webpack_require__(8645));
const utils_1 = __importDefault(__webpack_require__(7508));
const CONNECTING = 0;
const OPEN = 1;
const uuid = (0, hyperid_1.default)();
var Events;
(function (Events) {
    Events["autoRecoverSuccess"] = "autoRecoverSuccess";
    Events["autoRecoverFailed"] = "autoRecoverFailed";
    Events["autoRecoverError"] = "autoRecoverError";
    Events["newWebSocketObject"] = "newWebSocketObject";
    Events["newWsc"] = "newWsc";
    Events["connectionReady"] = "connectionReady";
})(Events || (exports.Events = Events = {}));
class WebSocketExtension extends SdkExtension_1.default {
    constructor(options = {}) {
        var _a, _b, _c, _d, _e;
        var _f, _g, _h, _j, _k;
        super();
        this.eventEmitter = new events_1.EventEmitter();
        this.wsTokenExpiresAt = 0;
        this.request = rest_1.request; // request method was moved to another file to keep this file short
        this.options = options;
        (_a = (_f = this.options).restOverWebSocket) !== null && _a !== void 0 ? _a : (_f.restOverWebSocket = false);
        (_b = (_g = this.options).debugMode) !== null && _b !== void 0 ? _b : (_g.debugMode = false);
        (_c = (_h = this.options).autoRecover) !== null && _c !== void 0 ? _c : (_h.autoRecover = {
            enabled: true,
        });
        (_d = (_j = this.options.autoRecover).checkInterval) !== null && _d !== void 0 ? _d : (_j.checkInterval = (retriesAttempted) => {
            const interval = 2000 + 2000 * retriesAttempted;
            return Math.min(8000, interval);
        });
        (_e = (_k = this.options.autoRecover).pingServerInterval) !== null && _e !== void 0 ? _e : (_k.pingServerInterval = 60000);
    }
    disable() {
        super.disable();
        if (this.subscription) {
            this.subscription.enabled = false;
        }
    }
    async install(rc) {
        this.rc = rc;
        if (this.options.restOverWebSocket) {
            const request = rc.request.bind(rc);
            rc.request = async (method, endpoint, content, queryParams, config) => {
                var _a, _b, _c;
                if (!this.enabled || !this.options.restOverWebSocket) {
                    return request(method, endpoint, content, queryParams, config);
                }
                if (
                // the following cannot be done with WebSocket
                ((_c = (_b = (_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a.getContentType) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.includes('multipart/form-data')) ||
                    (config === null || config === void 0 ? void 0 : config.responseType) === 'arraybuffer' ||
                    endpoint.startsWith('/restapi/oauth/') // token, revoke, wstoken
                ) {
                    return request(method, endpoint, content, queryParams, config);
                }
                return this.request(method, endpoint, content, queryParams, config);
            };
        }
        // should recover if this.options.wscToken
        let connectMethod = this.connect.bind(this);
        if (this.options.wscToken) {
            this.wsc = {
                token: this.options.wscToken,
                sequence: 0,
            };
            connectMethod = this.recover.bind(this);
        }
        if (!this.options.autoRecover.enabled) {
            await connectMethod();
            return;
        }
        // code after is for auto recover
        try {
            await connectMethod();
        }
        catch (e) {
            if (e instanceof RestException_1.default) {
                throw e; // such as InsufficientPermissions
            }
            if (this.options.debugMode) {
                console.debug('Initial connect failed:', e);
            }
        }
        let retriesAttempted = 0;
        let checking = false;
        const check = async () => {
            var _a, _b, _c;
            if (!this.enabled) {
                return;
            }
            if (((_a = this.options.autoRecover) === null || _a === void 0 ? void 0 : _a.enabled) !== true) {
                return;
            }
            if (checking) {
                return;
            }
            checking = true;
            if (((_b = this.ws) === null || _b === void 0 ? void 0 : _b.readyState) !== OPEN && ((_c = this.ws) === null || _c === void 0 ? void 0 : _c.readyState) !== CONNECTING) {
                clearInterval(this.intervalHandle);
                try {
                    await this.recover();
                    retriesAttempted = 0;
                    if (this.options.debugMode) {
                        console.debug(`Auto recover done, recoveryState: ${this.connectionDetails.recoveryState}`);
                    }
                    this.eventEmitter.emit(this.connectionDetails.recoveryState === 'Successful'
                        ? Events.autoRecoverSuccess
                        : Events.autoRecoverFailed, this.ws);
                }
                catch (e) {
                    if (e instanceof RestException_1.default) {
                        throw e; // such as InsufficientPermissions
                    }
                    retriesAttempted += 1;
                    if (this.options.debugMode) {
                        console.debug('Auto recover error:', e);
                    }
                    this.eventEmitter.emit(Events.autoRecoverError, e);
                }
                this.intervalHandle = setInterval(check, this.options.autoRecover.checkInterval(retriesAttempted));
            }
            checking = false;
        };
        this.intervalHandle = setInterval(check, this.options.autoRecover.checkInterval(retriesAttempted));
        // browser only code start
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('offline', () => {
                var _a;
                if (this.pingServerHandle) {
                    clearTimeout(this.pingServerHandle);
                }
                (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
            });
            window.addEventListener('online', () => {
                check();
            });
        }
        // browser only code end
    }
    async recover() {
        if (this._recoverPromise) {
            return this._recoverPromise;
        }
        this._recoverPromise = this._recover();
        try {
            await this._recoverPromise;
        }
        finally {
            this._recoverPromise = undefined;
        }
        return undefined;
    }
    async _recover() {
        var _a, _b;
        if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === OPEN || ((_b = this.ws) === null || _b === void 0 ? void 0 : _b.readyState) === CONNECTING) {
            return;
        }
        if (!this.wsc || !this.wsc.token) {
            await this.connect(false); // connect to WSG but do not recover
            return;
        }
        if (this.recoverTimestamp === undefined) {
            this.recoverTimestamp = Date.now();
        }
        if (this.connectionDetails !== undefined &&
            Date.now() - this.recoverTimestamp > this.connectionDetails.recoveryTimeout * 1000) {
            if (this.options.debugMode) {
                console.debug('connect to WSG but do not recover');
            }
            await this.connect(false); // connect to WSG but do not recover
        }
        else {
            if (this.options.debugMode) {
                console.debug('connect to WSG and recover');
            }
            await this.connect(true); // connect to WSG and recover
        }
        this.recoverTimestamp = undefined;
        this.enable();
    }
    async pingServer() {
        var _a, _b;
        if (((_a = this.options.autoRecover) === null || _a === void 0 ? void 0 : _a.enabled) !== true) {
            return;
        }
        if (((_b = this.ws) === null || _b === void 0 ? void 0 : _b.readyState) !== OPEN) {
            return;
        }
        try {
            await this.ws.send(JSON.stringify([
                {
                    type: 'Heartbeat',
                    messageId: uuid(),
                },
            ]));
        }
        catch (e) {
            this.ws.close(); // Explicitly mark WS as closed
        }
    }
    async connect(recoverSession) {
        if (this._connectPromise) {
            return this._connectPromise;
        }
        this._connectPromise = this._connect(recoverSession);
        try {
            await this._connectPromise;
        }
        finally {
            this._connectPromise = undefined;
        }
        return undefined;
    }
    async _connect(recoverSession = false) {
        var _a;
        if (!this.wsToken || Date.now() > this.wsTokenExpiresAt) {
            const r = await this.rc.post('/restapi/oauth/wstoken');
            this.wsToken = r.data;
            // `expires_in` default value is 600 seconds. That's why we `* 0.8`
            this.wsTokenExpiresAt = Date.now() + this.wsToken.expires_in * 0.8 * 1000;
        }
        let wsUri = `${this.wsToken.uri}?access_token=${this.wsToken.ws_access_token}`;
        if (recoverSession && this.wsc) {
            wsUri += `&wsc=${this.wsc.token}`;
        }
        this.ws = new isomorphic_ws_1.default(wsUri);
        this.eventEmitter.emit(Events.newWebSocketObject, this.ws);
        // override send method to wait for connecting
        const send = this.ws.send.bind(this.ws);
        this.ws.send = async (s) => {
            if (this.ws.readyState === CONNECTING) {
                await (0, wait_for_async_1.default)({
                    interval: 100,
                    condition: () => this.ws.readyState !== CONNECTING,
                });
            }
            await send(s);
        };
        if ((_a = this.options.autoRecover) === null || _a === void 0 ? void 0 : _a.enabled) {
            this.ws.addEventListener('message', () => {
                if (this.pingServerHandle) {
                    clearTimeout(this.pingServerHandle);
                }
                this.pingServerHandle = setTimeout(() => this.pingServer(), this.options.autoRecover.pingServerInterval);
            });
        }
        // debug mode to print all WebSocket traffic
        if (this.options.debugMode) {
            utils_1.default.debugWebSocket(this.ws);
        }
        // listen for new wsc data
        this.ws.addEventListener('message', (mEvent) => {
            const event = mEvent;
            const [meta, body] = utils_1.default.splitWsgData(event.data);
            if (meta.wsc &&
                (!this.wsc ||
                    (meta.type === 'ConnectionDetails' && body.recoveryState) ||
                    this.wsc.sequence < meta.wsc.sequence)) {
                this.wsc = meta.wsc;
                this.eventEmitter.emit(Events.newWsc, this.wsc);
            }
        });
        // get initial ConnectionDetails data
        const [meta, body, event] = await utils_1.default.waitForWebSocketMessage(this.ws, (meta) => meta.type === 'ConnectionDetails' || meta.type === 'Error');
        if (meta.type === 'Error') {
            throw new ConnectionException_1.default(event);
        }
        this.connectionDetails = body;
        // fired when ws connection is ready for creating subscription
        this.eventEmitter.emit(Events.connectionReady, this.ws);
        // recover the subscription, if it exists and enabled
        if (this.subscription && this.subscription.enabled) {
            // because we have a new ws object
            this.subscription.setupWsEventListener();
            if (!recoverSession || this.connectionDetails.recoveryState === 'Failed') {
                // create new subscription if don't recover existing one
                await this.subscription.subscribe();
            }
        }
    }
    // keepInterval means we do not clear the interval
    async revoke(keepInterval = false) {
        var _a, _b;
        await ((_a = this.subscription) === null || _a === void 0 ? void 0 : _a.revoke());
        this.subscription = undefined;
        if (!keepInterval && this.intervalHandle) {
            clearInterval(this.intervalHandle);
        }
        if (this.pingServerHandle) {
            clearTimeout(this.pingServerHandle);
        }
        (_b = this.ws) === null || _b === void 0 ? void 0 : _b.close();
        this.wsc = undefined;
        this.wsToken = undefined;
        this.wsTokenExpiresAt = 0;
        this.disable();
    }
    async subscribe(eventFilters, callback, cache = undefined) {
        const subscription = new subscription_1.default(this, eventFilters, callback);
        if (cache === undefined || cache === null) {
            await subscription.subscribe();
        }
        else {
            subscription.subscriptionInfo = cache;
            await subscription.refresh();
        }
        this.subscription = subscription;
        return subscription;
    }
}
exports["default"] = WebSocketExtension;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6311:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.request = void 0;
const RestException_1 = __importDefault(__webpack_require__(7087));
const hyperid_1 = __importDefault(__webpack_require__(8811));
const http_status_codes_1 = __webpack_require__(7383);
const utils_1 = __importDefault(__webpack_require__(7508));
const version = '0.16';
const uuid = (0, hyperid_1.default)();
// eslint-disable-next-line max-params
async function request(method, endpoint, content, queryParams, config) {
    var _a;
    const newConfig = {
        method,
        baseURL: (_a = this.wsToken) === null || _a === void 0 ? void 0 : _a.uri,
        url: endpoint,
        data: content,
        params: queryParams,
        ...config,
    };
    newConfig.headers = {
        ...newConfig.headers,
        'X-User-Agent': `${this.rc.rest.appName}/${this.rc.rest.appVersion} ringcentral-extensible/ws/${version}`,
    };
    const messageId = uuid();
    const requestBody = [
        {
            type: 'ClientRequest',
            messageId,
            method: newConfig.method,
            path: newConfig.url,
            headers: newConfig.headers,
            query: newConfig.params,
        },
    ];
    if (newConfig.data) {
        requestBody.push(newConfig.data);
    }
    await this.ws.send(JSON.stringify(requestBody));
    const [meta, body] = await utils_1.default.waitForWebSocketMessage(this.ws, (_meta) => _meta.messageId === messageId);
    const response = {
        data: body,
        status: meta.status,
        statusText: (0, http_status_codes_1.getReasonPhrase)(meta.status),
        headers: meta.headers,
        config: newConfig,
    };
    if (meta.type === 'ClientRequest' && meta.status >= 200 && meta.status < 300) {
        return response;
    }
    throw new RestException_1.default(response);
}
exports.request = request;
//# sourceMappingURL=rest.js.map

/***/ }),

/***/ 3788:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __importDefault(__webpack_require__(7508));
class Subscription {
    constructor(wse, eventFilters, callback) {
        this.enabled = true;
        this.wse = wse;
        this.eventFilters = eventFilters;
        this.eventListener = (mEvent) => {
            const event = mEvent;
            const [meta, body] = utils_1.default.splitWsgData(event.data);
            if (this.enabled && meta.type === 'ServerNotification' && body.subscriptionId === this.subscriptionInfo.id) {
                callback(body);
            }
        };
        this.setupWsEventListener();
    }
    setupWsEventListener() {
        this.wse.ws.addEventListener('message', this.eventListener);
    }
    get requestBody() {
        return {
            deliveryMode: { transportType: 'WebSocket' }, // because WebSocket is not in spec
            eventFilters: this.eventFilters,
        };
    }
    async subscribe() {
        this.subscriptionInfo = (await this.wse.request('POST', '/restapi/v1.0/subscription', this.requestBody)).data;
    }
    async refresh() {
        if (!this.subscriptionInfo) {
            return;
        }
        try {
            this.subscriptionInfo = (await this.wse.request('PUT', `/restapi/v1.0/subscription/${this.subscriptionInfo.id}`, this.requestBody)).data;
        }
        catch (e) {
            const re = e;
            if (re.response && re.response.status === 404) {
                // subscription expired
                await this.subscribe();
            }
        }
    }
    async revoke() {
        if (!this.subscriptionInfo) {
            return;
        }
        try {
            await this.wse.request('DELETE', `/restapi/v1.0/subscription/${this.subscriptionInfo.id}`);
        }
        catch (e) {
            const re = e;
            if (re.response && re.response.status === 404) {
                // ignore
                if (this.wse.options.debugMode) {
                    console.debug(`Subscription ${this.subscriptionInfo.id} doesn't exist on server side`);
                }
            }
            else if (re.response && re.response.status === 401) {
                // ignore
                if (this.wse.options.debugMode) {
                    console.debug('Token invalid when trying to revoke subscription');
                }
            }
            else {
                throw e;
            }
        }
        this.remove();
    }
    remove() {
        if (this.timeout) {
            __webpack_require__.g.clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.enabled = false;
        this.subscriptionInfo = undefined;
        if (this.wse.ws) {
            this.wse.ws.removeEventListener('message', this.eventListener);
        }
        this.wse.subscription = undefined;
    }
}
exports["default"] = Subscription;
//# sourceMappingURL=subscription.js.map

/***/ }),

/***/ 7508:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ClosedException_1 = __importDefault(__webpack_require__(161));
const TimeoutException_1 = __importDefault(__webpack_require__(9754));
class Utils {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static splitWsgData(wsgData) {
        if (wsgData.includes(',--Boundary')) {
            const index = wsgData.indexOf(',--Boundary');
            return [JSON.parse(wsgData.substring(1, index)), wsgData.substring(index + 1, wsgData.length - 1)];
        }
        return JSON.parse(wsgData);
    }
    static debugWebSocket(_ws) {
        const ws = _ws;
        const send = ws.send.bind(ws);
        ws.send = async (str) => {
            await send(str);
            console.debug(`*** WebSocket outgoing message: ***
${JSON.stringify(JSON.parse(str), null, 2)}
******`);
        };
        ws.addEventListener('message', (mEvent) => {
            const event = mEvent;
            console.debug(`*** WebSocket incoming message: ***
${JSON.stringify(JSON.parse(event.data), null, 2)}
******`);
        });
        ws.addEventListener('open', (event) => {
            console.debug('WebSocket open event:', event);
        });
        ws.addEventListener('error', (event) => {
            console.debug('WebSocket error event:', event);
        });
        ws.addEventListener('close', (event) => {
            console.debug('WebSocket close event:', event);
        });
    }
    static waitForWebSocketMessage(ws, matchCondition, timeout = 60000) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Promise((resolve, reject) => {
            const checkHandle = setInterval(() => {
                if (ws.readyState === ws.CLOSED) {
                    clearInterval(checkHandle);
                    reject(new ClosedException_1.default());
                }
            }, 1000);
            const timeoutHandle = setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                ws.removeEventListener('message', handler);
                clearInterval(checkHandle);
                reject(new TimeoutException_1.default());
            }, timeout);
            const handler = (mEvent) => {
                const event = mEvent;
                const [meta, body] = Utils.splitWsgData(event.data);
                if (matchCondition(meta)) {
                    ws.removeEventListener('message', handler);
                    clearInterval(checkHandle);
                    clearTimeout(timeoutHandle);
                    resolve([meta, body, event]);
                }
            };
            ws.addEventListener('message', handler);
        });
    }
}
exports["default"] = Utils;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 7322:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 8891:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(7322)
var ieee754 = __webpack_require__(8239)
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        Buffer.from(buf).copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()


/***/ }),

/***/ 9343:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(8897);

var callBind = __webpack_require__(8179);

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ 8179:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(4499);
var GetIntrinsic = __webpack_require__(8897);
var setFunctionLength = __webpack_require__(8973);

var $TypeError = __webpack_require__(1711);
var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $defineProperty = __webpack_require__(7539);
var $max = GetIntrinsic('%Math.max%');

module.exports = function callBind(originalFunction) {
	if (typeof originalFunction !== 'function') {
		throw new $TypeError('a function is required');
	}
	var func = $reflectApply(bind, $call, arguments);
	return setFunctionLength(
		func,
		1 + $max(0, originalFunction.length - (arguments.length - 1)),
		true
	);
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ 9381:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $defineProperty = __webpack_require__(7539);

var $SyntaxError = __webpack_require__(6296);
var $TypeError = __webpack_require__(1711);

var gopd = __webpack_require__(1399);

/** @type {import('.')} */
module.exports = function defineDataProperty(
	obj,
	property,
	value
) {
	if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
		throw new $TypeError('`obj` must be an object or a function`');
	}
	if (typeof property !== 'string' && typeof property !== 'symbol') {
		throw new $TypeError('`property` must be a string or a symbol`');
	}
	if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
		throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
		throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
		throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
		throw new $TypeError('`loose`, if provided, must be a boolean');
	}

	var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
	var nonWritable = arguments.length > 4 ? arguments[4] : null;
	var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
	var loose = arguments.length > 6 ? arguments[6] : false;

	/* @type {false | TypedPropertyDescriptor<unknown>} */
	var desc = !!gopd && gopd(obj, property);

	if ($defineProperty) {
		$defineProperty(obj, property, {
			configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
			enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
			value: value,
			writable: nonWritable === null && desc ? desc.writable : !nonWritable
		});
	} else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
		// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
		obj[property] = value; // eslint-disable-line no-param-reassign
	} else {
		throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
	}
};


/***/ }),

/***/ 7539:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(8897);

/** @type {import('.')} */
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true) || false;
if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = false;
	}
}

module.exports = $defineProperty;


/***/ }),

/***/ 3841:
/***/ ((module) => {

"use strict";


/** @type {import('./eval')} */
module.exports = EvalError;


/***/ }),

/***/ 219:
/***/ ((module) => {

"use strict";


/** @type {import('.')} */
module.exports = Error;


/***/ }),

/***/ 6190:
/***/ ((module) => {

"use strict";


/** @type {import('./range')} */
module.exports = RangeError;


/***/ }),

/***/ 3950:
/***/ ((module) => {

"use strict";


/** @type {import('./ref')} */
module.exports = ReferenceError;


/***/ }),

/***/ 6296:
/***/ ((module) => {

"use strict";


/** @type {import('./syntax')} */
module.exports = SyntaxError;


/***/ }),

/***/ 1711:
/***/ ((module) => {

"use strict";


/** @type {import('./type')} */
module.exports = TypeError;


/***/ }),

/***/ 3221:
/***/ ((module) => {

"use strict";


/** @type {import('./uri')} */
module.exports = URIError;


/***/ }),

/***/ 6827:
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ 5845:
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ 4499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(5845);

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ 8897:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $Error = __webpack_require__(219);
var $EvalError = __webpack_require__(3841);
var $RangeError = __webpack_require__(6190);
var $ReferenceError = __webpack_require__(3950);
var $SyntaxError = __webpack_require__(6296);
var $TypeError = __webpack_require__(1711);
var $URIError = __webpack_require__(3221);

var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(4923)();
var hasProto = __webpack_require__(9372)();

var getProto = Object.getPrototypeOf || (
	hasProto
		? function (x) { return x.__proto__; } // eslint-disable-line no-proto
		: null
);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	__proto__: null,
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': $Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': $EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': $RangeError,
	'%ReferenceError%': $ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': $URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	__proto__: null,
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(4499);
var hasOwn = __webpack_require__(4313);
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ 1399:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(8897);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;


/***/ }),

/***/ 6900:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $defineProperty = __webpack_require__(7539);

var hasPropertyDescriptors = function hasPropertyDescriptors() {
	return !!$defineProperty;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
	// node v0.6 has a bug where array lengths can be Set but not Defined
	if (!$defineProperty) {
		return null;
	}
	try {
		return $defineProperty([], 'length', { value: 1 }).length !== 1;
	} catch (e) {
		// In Firefox 4-22, defining length on an array throws an exception.
		return true;
	}
};

module.exports = hasPropertyDescriptors;


/***/ }),

/***/ 9372:
/***/ ((module) => {

"use strict";


var test = {
	__proto__: null,
	foo: {}
};

var $Object = Object;

/** @type {import('.')} */
module.exports = function hasProto() {
	// @ts-expect-error: TS errors on an inherited property for some reason
	return { __proto__: test }.foo === test.foo
		&& !(test instanceof $Object);
};


/***/ }),

/***/ 4923:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(4361);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ 4361:
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ 4313:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __webpack_require__(4499);

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);


/***/ }),

/***/ 7383:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ACCEPTED: () => (/* reexport */ ACCEPTED),
  BAD_GATEWAY: () => (/* reexport */ BAD_GATEWAY),
  BAD_REQUEST: () => (/* reexport */ BAD_REQUEST),
  CONFLICT: () => (/* reexport */ CONFLICT),
  CONTINUE: () => (/* reexport */ CONTINUE),
  CREATED: () => (/* reexport */ CREATED),
  EXPECTATION_FAILED: () => (/* reexport */ EXPECTATION_FAILED),
  FAILED_DEPENDENCY: () => (/* reexport */ FAILED_DEPENDENCY),
  FORBIDDEN: () => (/* reexport */ FORBIDDEN),
  GATEWAY_TIMEOUT: () => (/* reexport */ GATEWAY_TIMEOUT),
  GONE: () => (/* reexport */ GONE),
  HTTP_VERSION_NOT_SUPPORTED: () => (/* reexport */ HTTP_VERSION_NOT_SUPPORTED),
  IM_A_TEAPOT: () => (/* reexport */ IM_A_TEAPOT),
  INSUFFICIENT_SPACE_ON_RESOURCE: () => (/* reexport */ INSUFFICIENT_SPACE_ON_RESOURCE),
  INSUFFICIENT_STORAGE: () => (/* reexport */ INSUFFICIENT_STORAGE),
  INTERNAL_SERVER_ERROR: () => (/* reexport */ INTERNAL_SERVER_ERROR),
  LENGTH_REQUIRED: () => (/* reexport */ LENGTH_REQUIRED),
  LOCKED: () => (/* reexport */ LOCKED),
  METHOD_FAILURE: () => (/* reexport */ METHOD_FAILURE),
  METHOD_NOT_ALLOWED: () => (/* reexport */ METHOD_NOT_ALLOWED),
  MOVED_PERMANENTLY: () => (/* reexport */ MOVED_PERMANENTLY),
  MOVED_TEMPORARILY: () => (/* reexport */ MOVED_TEMPORARILY),
  MULTIPLE_CHOICES: () => (/* reexport */ MULTIPLE_CHOICES),
  MULTI_STATUS: () => (/* reexport */ MULTI_STATUS),
  NETWORK_AUTHENTICATION_REQUIRED: () => (/* reexport */ NETWORK_AUTHENTICATION_REQUIRED),
  NON_AUTHORITATIVE_INFORMATION: () => (/* reexport */ NON_AUTHORITATIVE_INFORMATION),
  NOT_ACCEPTABLE: () => (/* reexport */ NOT_ACCEPTABLE),
  NOT_FOUND: () => (/* reexport */ NOT_FOUND),
  NOT_IMPLEMENTED: () => (/* reexport */ NOT_IMPLEMENTED),
  NOT_MODIFIED: () => (/* reexport */ NOT_MODIFIED),
  NO_CONTENT: () => (/* reexport */ NO_CONTENT),
  OK: () => (/* reexport */ OK),
  PARTIAL_CONTENT: () => (/* reexport */ PARTIAL_CONTENT),
  PAYMENT_REQUIRED: () => (/* reexport */ PAYMENT_REQUIRED),
  PERMANENT_REDIRECT: () => (/* reexport */ PERMANENT_REDIRECT),
  PRECONDITION_FAILED: () => (/* reexport */ PRECONDITION_FAILED),
  PRECONDITION_REQUIRED: () => (/* reexport */ PRECONDITION_REQUIRED),
  PROCESSING: () => (/* reexport */ PROCESSING),
  PROXY_AUTHENTICATION_REQUIRED: () => (/* reexport */ PROXY_AUTHENTICATION_REQUIRED),
  REQUESTED_RANGE_NOT_SATISFIABLE: () => (/* reexport */ REQUESTED_RANGE_NOT_SATISFIABLE),
  REQUEST_HEADER_FIELDS_TOO_LARGE: () => (/* reexport */ REQUEST_HEADER_FIELDS_TOO_LARGE),
  REQUEST_TIMEOUT: () => (/* reexport */ REQUEST_TIMEOUT),
  REQUEST_TOO_LONG: () => (/* reexport */ REQUEST_TOO_LONG),
  REQUEST_URI_TOO_LONG: () => (/* reexport */ REQUEST_URI_TOO_LONG),
  RESET_CONTENT: () => (/* reexport */ RESET_CONTENT),
  ReasonPhrases: () => (/* reexport */ ReasonPhrases),
  SEE_OTHER: () => (/* reexport */ SEE_OTHER),
  SERVICE_UNAVAILABLE: () => (/* reexport */ SERVICE_UNAVAILABLE),
  SWITCHING_PROTOCOLS: () => (/* reexport */ SWITCHING_PROTOCOLS),
  StatusCodes: () => (/* reexport */ StatusCodes),
  TEMPORARY_REDIRECT: () => (/* reexport */ TEMPORARY_REDIRECT),
  TOO_MANY_REQUESTS: () => (/* reexport */ TOO_MANY_REQUESTS),
  UNAUTHORIZED: () => (/* reexport */ UNAUTHORIZED),
  UNPROCESSABLE_ENTITY: () => (/* reexport */ UNPROCESSABLE_ENTITY),
  UNSUPPORTED_MEDIA_TYPE: () => (/* reexport */ UNSUPPORTED_MEDIA_TYPE),
  USE_PROXY: () => (/* reexport */ USE_PROXY),
  "default": () => (/* binding */ es),
  getReasonPhrase: () => (/* reexport */ getReasonPhrase),
  getStatusCode: () => (/* reexport */ getStatusCode),
  getStatusText: () => (/* reexport */ getStatusText)
});

;// CONCATENATED MODULE: ../node_modules/http-status-codes/build/es/legacy.js
// Exporting constants directly to maintain compatability with v1
// These are deprecated. Please don't add any new codes here.
/**
 * @deprecated Please use StatusCodes.ACCEPTED
 *
 * */
var ACCEPTED = 202;
/**
 * @deprecated Please use StatusCodes.BAD_GATEWAY
 *
 * */
var BAD_GATEWAY = 502;
/**
 * @deprecated Please use StatusCodes.BAD_REQUEST
 *
 * */
var BAD_REQUEST = 400;
/**
 * @deprecated Please use StatusCodes.CONFLICT
 *
 * */
var CONFLICT = 409;
/**
 * @deprecated Please use StatusCodes.CONTINUE
 *
 * */
var CONTINUE = 100;
/**
 * @deprecated Please use StatusCodes.CREATED
 *
 * */
var CREATED = 201;
/**
 * @deprecated Please use StatusCodes.EXPECTATION_FAILED
 *
 * */
var EXPECTATION_FAILED = 417;
/**
 * @deprecated Please use StatusCodes.FAILED_DEPENDENCY
 *
 * */
var FAILED_DEPENDENCY = 424;
/**
 * @deprecated Please use StatusCodes.FORBIDDEN
 *
 * */
var FORBIDDEN = 403;
/**
 * @deprecated Please use StatusCodes.GATEWAY_TIMEOUT
 *
 * */
var GATEWAY_TIMEOUT = 504;
/**
 * @deprecated Please use StatusCodes.GONE
 *
 * */
var GONE = 410;
/**
 * @deprecated Please use StatusCodes.HTTP_VERSION_NOT_SUPPORTED
 *
 * */
var HTTP_VERSION_NOT_SUPPORTED = 505;
/**
 * @deprecated Please use StatusCodes.IM_A_TEAPOT
 *
 * */
var IM_A_TEAPOT = 418;
/**
 * @deprecated Please use StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE
 *
 * */
var INSUFFICIENT_SPACE_ON_RESOURCE = 419;
/**
 * @deprecated Please use StatusCodes.INSUFFICIENT_STORAGE
 *
 * */
var INSUFFICIENT_STORAGE = 507;
/**
 * @deprecated Please use StatusCodes.INTERNAL_SERVER_ERROR
 *
 * */
var INTERNAL_SERVER_ERROR = 500;
/**
 * @deprecated Please use StatusCodes.LENGTH_REQUIRED
 *
 * */
var LENGTH_REQUIRED = 411;
/**
 * @deprecated Please use StatusCodes.LOCKED
 *
 * */
var LOCKED = 423;
/**
 * @deprecated Please use StatusCodes.METHOD_FAILURE
 *
 * */
var METHOD_FAILURE = 420;
/**
 * @deprecated Please use StatusCodes.METHOD_NOT_ALLOWED
 *
 * */
var METHOD_NOT_ALLOWED = 405;
/**
 * @deprecated Please use StatusCodes.MOVED_PERMANENTLY
 *
 * */
var MOVED_PERMANENTLY = 301;
/**
 * @deprecated Please use StatusCodes.MOVED_TEMPORARILY
 *
 * */
var MOVED_TEMPORARILY = 302;
/**
 * @deprecated Please use StatusCodes.MULTI_STATUS
 *
 * */
var MULTI_STATUS = 207;
/**
 * @deprecated Please use StatusCodes.MULTIPLE_CHOICES
 *
 * */
var MULTIPLE_CHOICES = 300;
/**
 * @deprecated Please use StatusCodes.NETWORK_AUTHENTICATION_REQUIRED
 *
 * */
var NETWORK_AUTHENTICATION_REQUIRED = 511;
/**
 * @deprecated Please use StatusCodes.NO_CONTENT
 *
 * */
var NO_CONTENT = 204;
/**
 * @deprecated Please use StatusCodes.NON_AUTHORITATIVE_INFORMATION
 *
 * */
var NON_AUTHORITATIVE_INFORMATION = 203;
/**
 * @deprecated Please use StatusCodes.NOT_ACCEPTABLE
 *
 * */
var NOT_ACCEPTABLE = 406;
/**
 * @deprecated Please use StatusCodes.NOT_FOUND
 *
 * */
var NOT_FOUND = 404;
/**
 * @deprecated Please use StatusCodes.NOT_IMPLEMENTED
 *
 * */
var NOT_IMPLEMENTED = 501;
/**
 * @deprecated Please use StatusCodes.NOT_MODIFIED
 *
 * */
var NOT_MODIFIED = 304;
/**
 * @deprecated Please use StatusCodes.OK
 *
 * */
var OK = 200;
/**
 * @deprecated Please use StatusCodes.PARTIAL_CONTENT
 *
 * */
var PARTIAL_CONTENT = 206;
/**
 * @deprecated Please use StatusCodes.PAYMENT_REQUIRED
 *
 * */
var PAYMENT_REQUIRED = 402;
/**
 * @deprecated Please use StatusCodes.PERMANENT_REDIRECT
 *
 * */
var PERMANENT_REDIRECT = 308;
/**
 * @deprecated Please use StatusCodes.PRECONDITION_FAILED
 *
 * */
var PRECONDITION_FAILED = 412;
/**
 * @deprecated Please use StatusCodes.PRECONDITION_REQUIRED
 *
 * */
var PRECONDITION_REQUIRED = 428;
/**
 * @deprecated Please use StatusCodes.PROCESSING
 *
 * */
var PROCESSING = 102;
/**
 * @deprecated Please use StatusCodes.PROXY_AUTHENTICATION_REQUIRED
 *
 * */
var PROXY_AUTHENTICATION_REQUIRED = 407;
/**
 * @deprecated Please use StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE
 *
 * */
var REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
/**
 * @deprecated Please use StatusCodes.REQUEST_TIMEOUT
 *
 * */
var REQUEST_TIMEOUT = 408;
/**
 * @deprecated Please use StatusCodes.REQUEST_TOO_LONG
 *
 * */
var REQUEST_TOO_LONG = 413;
/**
 * @deprecated Please use StatusCodes.REQUEST_URI_TOO_LONG
 *
 * */
var REQUEST_URI_TOO_LONG = 414;
/**
 * @deprecated Please use StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE
 *
 * */
var REQUESTED_RANGE_NOT_SATISFIABLE = 416;
/**
 * @deprecated Please use StatusCodes.RESET_CONTENT
 *
 * */
var RESET_CONTENT = 205;
/**
 * @deprecated Please use StatusCodes.SEE_OTHER
 *
 * */
var SEE_OTHER = 303;
/**
 * @deprecated Please use StatusCodes.SERVICE_UNAVAILABLE
 *
 * */
var SERVICE_UNAVAILABLE = 503;
/**
 * @deprecated Please use StatusCodes.SWITCHING_PROTOCOLS
 *
 * */
var SWITCHING_PROTOCOLS = 101;
/**
 * @deprecated Please use StatusCodes.TEMPORARY_REDIRECT
 *
 * */
var TEMPORARY_REDIRECT = 307;
/**
 * @deprecated Please use StatusCodes.TOO_MANY_REQUESTS
 *
 * */
var TOO_MANY_REQUESTS = 429;
/**
 * @deprecated Please use StatusCodes.UNAUTHORIZED
 *
 * */
var UNAUTHORIZED = 401;
/**
 * @deprecated Please use StatusCodes.UNPROCESSABLE_ENTITY
 *
 * */
var UNPROCESSABLE_ENTITY = 422;
/**
 * @deprecated Please use StatusCodes.UNSUPPORTED_MEDIA_TYPE
 *
 * */
var UNSUPPORTED_MEDIA_TYPE = 415;
/**
 * @deprecated Please use StatusCodes.USE_PROXY
 *
 * */
var USE_PROXY = 305;
/* harmony default export */ const legacy = ({
    ACCEPTED: ACCEPTED,
    BAD_GATEWAY: BAD_GATEWAY,
    BAD_REQUEST: BAD_REQUEST,
    CONFLICT: CONFLICT,
    CONTINUE: CONTINUE,
    CREATED: CREATED,
    EXPECTATION_FAILED: EXPECTATION_FAILED,
    FORBIDDEN: FORBIDDEN,
    GATEWAY_TIMEOUT: GATEWAY_TIMEOUT,
    GONE: GONE,
    HTTP_VERSION_NOT_SUPPORTED: HTTP_VERSION_NOT_SUPPORTED,
    IM_A_TEAPOT: IM_A_TEAPOT,
    INSUFFICIENT_SPACE_ON_RESOURCE: INSUFFICIENT_SPACE_ON_RESOURCE,
    INSUFFICIENT_STORAGE: INSUFFICIENT_STORAGE,
    INTERNAL_SERVER_ERROR: INTERNAL_SERVER_ERROR,
    LENGTH_REQUIRED: LENGTH_REQUIRED,
    LOCKED: LOCKED,
    METHOD_FAILURE: METHOD_FAILURE,
    METHOD_NOT_ALLOWED: METHOD_NOT_ALLOWED,
    MOVED_PERMANENTLY: MOVED_PERMANENTLY,
    MOVED_TEMPORARILY: MOVED_TEMPORARILY,
    MULTI_STATUS: MULTI_STATUS,
    MULTIPLE_CHOICES: MULTIPLE_CHOICES,
    NETWORK_AUTHENTICATION_REQUIRED: NETWORK_AUTHENTICATION_REQUIRED,
    NO_CONTENT: NO_CONTENT,
    NON_AUTHORITATIVE_INFORMATION: NON_AUTHORITATIVE_INFORMATION,
    NOT_ACCEPTABLE: NOT_ACCEPTABLE,
    NOT_FOUND: NOT_FOUND,
    NOT_IMPLEMENTED: NOT_IMPLEMENTED,
    NOT_MODIFIED: NOT_MODIFIED,
    OK: OK,
    PARTIAL_CONTENT: PARTIAL_CONTENT,
    PAYMENT_REQUIRED: PAYMENT_REQUIRED,
    PERMANENT_REDIRECT: PERMANENT_REDIRECT,
    PRECONDITION_FAILED: PRECONDITION_FAILED,
    PRECONDITION_REQUIRED: PRECONDITION_REQUIRED,
    PROCESSING: PROCESSING,
    PROXY_AUTHENTICATION_REQUIRED: PROXY_AUTHENTICATION_REQUIRED,
    REQUEST_HEADER_FIELDS_TOO_LARGE: REQUEST_HEADER_FIELDS_TOO_LARGE,
    REQUEST_TIMEOUT: REQUEST_TIMEOUT,
    REQUEST_TOO_LONG: REQUEST_TOO_LONG,
    REQUEST_URI_TOO_LONG: REQUEST_URI_TOO_LONG,
    REQUESTED_RANGE_NOT_SATISFIABLE: REQUESTED_RANGE_NOT_SATISFIABLE,
    RESET_CONTENT: RESET_CONTENT,
    SEE_OTHER: SEE_OTHER,
    SERVICE_UNAVAILABLE: SERVICE_UNAVAILABLE,
    SWITCHING_PROTOCOLS: SWITCHING_PROTOCOLS,
    TEMPORARY_REDIRECT: TEMPORARY_REDIRECT,
    TOO_MANY_REQUESTS: TOO_MANY_REQUESTS,
    UNAUTHORIZED: UNAUTHORIZED,
    UNPROCESSABLE_ENTITY: UNPROCESSABLE_ENTITY,
    UNSUPPORTED_MEDIA_TYPE: UNSUPPORTED_MEDIA_TYPE,
    USE_PROXY: USE_PROXY,
});

;// CONCATENATED MODULE: ../node_modules/http-status-codes/build/es/utils.js
// Generated file. Do not edit
var statusCodeToReasonPhrase = {
    "202": "Accepted",
    "502": "Bad Gateway",
    "400": "Bad Request",
    "409": "Conflict",
    "100": "Continue",
    "201": "Created",
    "417": "Expectation Failed",
    "424": "Failed Dependency",
    "403": "Forbidden",
    "504": "Gateway Timeout",
    "410": "Gone",
    "505": "HTTP Version Not Supported",
    "418": "I'm a teapot",
    "419": "Insufficient Space on Resource",
    "507": "Insufficient Storage",
    "500": "Internal Server Error",
    "411": "Length Required",
    "423": "Locked",
    "420": "Method Failure",
    "405": "Method Not Allowed",
    "301": "Moved Permanently",
    "302": "Moved Temporarily",
    "207": "Multi-Status",
    "300": "Multiple Choices",
    "511": "Network Authentication Required",
    "204": "No Content",
    "203": "Non Authoritative Information",
    "406": "Not Acceptable",
    "404": "Not Found",
    "501": "Not Implemented",
    "304": "Not Modified",
    "200": "OK",
    "206": "Partial Content",
    "402": "Payment Required",
    "308": "Permanent Redirect",
    "412": "Precondition Failed",
    "428": "Precondition Required",
    "102": "Processing",
    "103": "Early Hints",
    "426": "Upgrade Required",
    "407": "Proxy Authentication Required",
    "431": "Request Header Fields Too Large",
    "408": "Request Timeout",
    "413": "Request Entity Too Large",
    "414": "Request-URI Too Long",
    "416": "Requested Range Not Satisfiable",
    "205": "Reset Content",
    "303": "See Other",
    "503": "Service Unavailable",
    "101": "Switching Protocols",
    "307": "Temporary Redirect",
    "429": "Too Many Requests",
    "401": "Unauthorized",
    "451": "Unavailable For Legal Reasons",
    "422": "Unprocessable Entity",
    "415": "Unsupported Media Type",
    "305": "Use Proxy",
    "421": "Misdirected Request"
};
var reasonPhraseToStatusCode = {
    "Accepted": 202,
    "Bad Gateway": 502,
    "Bad Request": 400,
    "Conflict": 409,
    "Continue": 100,
    "Created": 201,
    "Expectation Failed": 417,
    "Failed Dependency": 424,
    "Forbidden": 403,
    "Gateway Timeout": 504,
    "Gone": 410,
    "HTTP Version Not Supported": 505,
    "I'm a teapot": 418,
    "Insufficient Space on Resource": 419,
    "Insufficient Storage": 507,
    "Internal Server Error": 500,
    "Length Required": 411,
    "Locked": 423,
    "Method Failure": 420,
    "Method Not Allowed": 405,
    "Moved Permanently": 301,
    "Moved Temporarily": 302,
    "Multi-Status": 207,
    "Multiple Choices": 300,
    "Network Authentication Required": 511,
    "No Content": 204,
    "Non Authoritative Information": 203,
    "Not Acceptable": 406,
    "Not Found": 404,
    "Not Implemented": 501,
    "Not Modified": 304,
    "OK": 200,
    "Partial Content": 206,
    "Payment Required": 402,
    "Permanent Redirect": 308,
    "Precondition Failed": 412,
    "Precondition Required": 428,
    "Processing": 102,
    "Early Hints": 103,
    "Upgrade Required": 426,
    "Proxy Authentication Required": 407,
    "Request Header Fields Too Large": 431,
    "Request Timeout": 408,
    "Request Entity Too Large": 413,
    "Request-URI Too Long": 414,
    "Requested Range Not Satisfiable": 416,
    "Reset Content": 205,
    "See Other": 303,
    "Service Unavailable": 503,
    "Switching Protocols": 101,
    "Temporary Redirect": 307,
    "Too Many Requests": 429,
    "Unauthorized": 401,
    "Unavailable For Legal Reasons": 451,
    "Unprocessable Entity": 422,
    "Unsupported Media Type": 415,
    "Use Proxy": 305,
    "Misdirected Request": 421
};

;// CONCATENATED MODULE: ../node_modules/http-status-codes/build/es/utils-functions.js

/**
 * Returns the reason phrase for the given status code.
 * If the given status code does not exist, an error is thrown.
 *
 * @param {number|string} statusCode The HTTP status code
 * @returns {string} The associated reason phrase (e.g. "Bad Request", "OK")
 * */
function getReasonPhrase(statusCode) {
    var result = statusCodeToReasonPhrase[statusCode.toString()];
    if (!result) {
        throw new Error("Status code does not exist: " + statusCode);
    }
    return result;
}
/**
 * Returns the status code for the given reason phrase.
 * If the given reason phrase does not exist, undefined is returned.
 *
 * @param {string} reasonPhrase The HTTP reason phrase (e.g. "Bad Request", "OK")
 * @returns {string} The associated status code
 * */
function getStatusCode(reasonPhrase) {
    var result = reasonPhraseToStatusCode[reasonPhrase];
    if (!result) {
        throw new Error("Reason phrase does not exist: " + reasonPhrase);
    }
    return result;
}
/**
 * @deprecated
 *
 * Returns the reason phrase for the given status code.
 * If the given status code does not exist, undefined is returned.
 *
 * Deprecated in favor of getReasonPhrase
 *
 * @param {number|string} statusCode The HTTP status code
 * @returns {string|undefined} The associated reason phrase (e.g. "Bad Request", "OK")
 * */
var getStatusText = getReasonPhrase;

;// CONCATENATED MODULE: ../node_modules/http-status-codes/build/es/status-codes.js
// Generated file. Do not edit
var StatusCodes;
(function (StatusCodes) {
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
     *
     * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     */
    StatusCodes[StatusCodes["CONTINUE"] = 100] = "CONTINUE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
     *
     * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     */
    StatusCodes[StatusCodes["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
     *
     * This code indicates that the server has received and is processing the request, but no response is available yet.
     */
    StatusCodes[StatusCodes["PROCESSING"] = 102] = "PROCESSING";
    /**
     * Official Documentation @ https://www.rfc-editor.org/rfc/rfc8297#page-3
     *
     * This code indicates to the client that the server is likely to send a final response with the header fields included in the informational response.
     */
    StatusCodes[StatusCodes["EARLY_HINTS"] = 103] = "EARLY_HINTS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
     *
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     */
    StatusCodes[StatusCodes["OK"] = 200] = "OK";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
     *
     * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     */
    StatusCodes[StatusCodes["CREATED"] = 201] = "CREATED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
     *
     * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     */
    StatusCodes[StatusCodes["ACCEPTED"] = 202] = "ACCEPTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
     *
     * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
     */
    StatusCodes[StatusCodes["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
     *
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     */
    StatusCodes[StatusCodes["NO_CONTENT"] = 204] = "NO_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
     *
     * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     */
    StatusCodes[StatusCodes["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
     *
     * This response code is used because of range header sent by the client to separate download into multiple streams.
     */
    StatusCodes[StatusCodes["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
     *
     * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
     */
    StatusCodes[StatusCodes["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
     *
     * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     */
    StatusCodes[StatusCodes["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
     *
     * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     */
    StatusCodes[StatusCodes["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
     *
     * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    StatusCodes[StatusCodes["MOVED_TEMPORARILY"] = 302] = "MOVED_TEMPORARILY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
     *
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     */
    StatusCodes[StatusCodes["SEE_OTHER"] = 303] = "SEE_OTHER";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
     *
     * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     */
    StatusCodes[StatusCodes["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
     *
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     */
    StatusCodes[StatusCodes["USE_PROXY"] = 305] = "USE_PROXY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
     *
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    StatusCodes[StatusCodes["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
     *
     * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    StatusCodes[StatusCodes["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
     *
     * This response means that server could not understand the request due to invalid syntax.
     */
    StatusCodes[StatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
     *
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    StatusCodes[StatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
     *
     * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     */
    StatusCodes[StatusCodes["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
     *
     * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     */
    StatusCodes[StatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
     *
     * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
     */
    StatusCodes[StatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
     *
     * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     */
    StatusCodes[StatusCodes["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
     *
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     */
    StatusCodes[StatusCodes["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
     *
     * This is similar to 401 but authentication is needed to be done by a proxy.
     */
    StatusCodes[StatusCodes["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
     *
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    StatusCodes[StatusCodes["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
     *
     * This response is sent when a request conflicts with the current state of the server.
     */
    StatusCodes[StatusCodes["CONFLICT"] = 409] = "CONFLICT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
     *
     * This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    StatusCodes[StatusCodes["GONE"] = 410] = "GONE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
     *
     * The server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    StatusCodes[StatusCodes["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
     *
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    StatusCodes[StatusCodes["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
     *
     * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
     */
    StatusCodes[StatusCodes["REQUEST_TOO_LONG"] = 413] = "REQUEST_TOO_LONG";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
     *
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    StatusCodes[StatusCodes["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
     *
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    StatusCodes[StatusCodes["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
     *
     * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
     */
    StatusCodes[StatusCodes["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
     *
     * This response code means the expectation indicated by the Expect request header field can't be met by the server.
     */
    StatusCodes[StatusCodes["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
     *
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     */
    StatusCodes[StatusCodes["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The 507 (Insufficient Storage) status code means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. This condition is considered to be temporary. If the request which received this status code was the result of a user action, the request MUST NOT be repeated until it is requested by a separate user action.
     */
    StatusCodes[StatusCodes["INSUFFICIENT_SPACE_ON_RESOURCE"] = 419] = "INSUFFICIENT_SPACE_ON_RESOURCE";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/rfcdiff?difftype=--hwdiff&url2=draft-ietf-webdav-protocol-06.txt
     *
     * A deprecated response used by the Spring Framework when a method has failed.
     */
    StatusCodes[StatusCodes["METHOD_FAILURE"] = 420] = "METHOD_FAILURE";
    /**
     * Official Documentation @ https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.2
     *
     * Defined in the specification of HTTP/2 to indicate that a server is not able to produce a response for the combination of scheme and authority that are included in the request URI.
     */
    StatusCodes[StatusCodes["MISDIRECTED_REQUEST"] = 421] = "MISDIRECTED_REQUEST";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
     *
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    StatusCodes[StatusCodes["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
     *
     * The resource that is being accessed is locked.
     */
    StatusCodes[StatusCodes["LOCKED"] = 423] = "LOCKED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
     *
     * The request failed due to failure of a previous request.
     */
    StatusCodes[StatusCodes["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    /**
     * Official Documentation @ https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.15
     *
     * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
     */
    StatusCodes[StatusCodes["UPGRADE_REQUIRED"] = 426] = "UPGRADE_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
     *
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    StatusCodes[StatusCodes["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
     *
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    StatusCodes[StatusCodes["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
     *
     * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
     */
    StatusCodes[StatusCodes["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7725
     *
     * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    StatusCodes[StatusCodes["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
     *
     * The server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    StatusCodes[StatusCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
     *
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    StatusCodes[StatusCodes["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
     *
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    StatusCodes[StatusCodes["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
     *
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    StatusCodes[StatusCodes["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
     *
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    StatusCodes[StatusCodes["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
     *
     * The HTTP version used in the request is not supported by the server.
     */
    StatusCodes[StatusCodes["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    StatusCodes[StatusCodes["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
     *
     * The 511 status code indicates that the client needs to authenticate to gain network access.
     */
    StatusCodes[StatusCodes["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
})(StatusCodes || (StatusCodes = {}));

;// CONCATENATED MODULE: ../node_modules/http-status-codes/build/es/reason-phrases.js
// Generated file. Do not edit
var ReasonPhrases;
(function (ReasonPhrases) {
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
     *
     * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     */
    ReasonPhrases["ACCEPTED"] = "Accepted";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
     *
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    ReasonPhrases["BAD_GATEWAY"] = "Bad Gateway";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
     *
     * This response means that server could not understand the request due to invalid syntax.
     */
    ReasonPhrases["BAD_REQUEST"] = "Bad Request";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
     *
     * This response is sent when a request conflicts with the current state of the server.
     */
    ReasonPhrases["CONFLICT"] = "Conflict";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
     *
     * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     */
    ReasonPhrases["CONTINUE"] = "Continue";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
     *
     * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     */
    ReasonPhrases["CREATED"] = "Created";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
     *
     * This response code means the expectation indicated by the Expect request header field can't be met by the server.
     */
    ReasonPhrases["EXPECTATION_FAILED"] = "Expectation Failed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
     *
     * The request failed due to failure of a previous request.
     */
    ReasonPhrases["FAILED_DEPENDENCY"] = "Failed Dependency";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
     *
     * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     */
    ReasonPhrases["FORBIDDEN"] = "Forbidden";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
     *
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    ReasonPhrases["GATEWAY_TIMEOUT"] = "Gateway Timeout";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
     *
     * This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    ReasonPhrases["GONE"] = "Gone";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
     *
     * The HTTP version used in the request is not supported by the server.
     */
    ReasonPhrases["HTTP_VERSION_NOT_SUPPORTED"] = "HTTP Version Not Supported";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
     *
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     */
    ReasonPhrases["IM_A_TEAPOT"] = "I'm a teapot";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The 507 (Insufficient Storage) status code means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. This condition is considered to be temporary. If the request which received this status code was the result of a user action, the request MUST NOT be repeated until it is requested by a separate user action.
     */
    ReasonPhrases["INSUFFICIENT_SPACE_ON_RESOURCE"] = "Insufficient Space on Resource";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    ReasonPhrases["INSUFFICIENT_STORAGE"] = "Insufficient Storage";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
     *
     * The server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    ReasonPhrases["INTERNAL_SERVER_ERROR"] = "Internal Server Error";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
     *
     * The server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    ReasonPhrases["LENGTH_REQUIRED"] = "Length Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
     *
     * The resource that is being accessed is locked.
     */
    ReasonPhrases["LOCKED"] = "Locked";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/rfcdiff?difftype=--hwdiff&url2=draft-ietf-webdav-protocol-06.txt
     *
     * A deprecated response used by the Spring Framework when a method has failed.
     */
    ReasonPhrases["METHOD_FAILURE"] = "Method Failure";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
     *
     * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     */
    ReasonPhrases["METHOD_NOT_ALLOWED"] = "Method Not Allowed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
     *
     * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     */
    ReasonPhrases["MOVED_PERMANENTLY"] = "Moved Permanently";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
     *
     * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    ReasonPhrases["MOVED_TEMPORARILY"] = "Moved Temporarily";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
     *
     * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
     */
    ReasonPhrases["MULTI_STATUS"] = "Multi-Status";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
     *
     * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     */
    ReasonPhrases["MULTIPLE_CHOICES"] = "Multiple Choices";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
     *
     * The 511 status code indicates that the client needs to authenticate to gain network access.
     */
    ReasonPhrases["NETWORK_AUTHENTICATION_REQUIRED"] = "Network Authentication Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
     *
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     */
    ReasonPhrases["NO_CONTENT"] = "No Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
     *
     * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
     */
    ReasonPhrases["NON_AUTHORITATIVE_INFORMATION"] = "Non Authoritative Information";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
     *
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     */
    ReasonPhrases["NOT_ACCEPTABLE"] = "Not Acceptable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
     *
     * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
     */
    ReasonPhrases["NOT_FOUND"] = "Not Found";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
     *
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    ReasonPhrases["NOT_IMPLEMENTED"] = "Not Implemented";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
     *
     * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     */
    ReasonPhrases["NOT_MODIFIED"] = "Not Modified";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
     *
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     */
    ReasonPhrases["OK"] = "OK";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
     *
     * This response code is used because of range header sent by the client to separate download into multiple streams.
     */
    ReasonPhrases["PARTIAL_CONTENT"] = "Partial Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
     *
     * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     */
    ReasonPhrases["PAYMENT_REQUIRED"] = "Payment Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
     *
     * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    ReasonPhrases["PERMANENT_REDIRECT"] = "Permanent Redirect";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
     *
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    ReasonPhrases["PRECONDITION_FAILED"] = "Precondition Failed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
     *
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    ReasonPhrases["PRECONDITION_REQUIRED"] = "Precondition Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
     *
     * This code indicates that the server has received and is processing the request, but no response is available yet.
     */
    ReasonPhrases["PROCESSING"] = "Processing";
    /**
     * Official Documentation @ https://www.rfc-editor.org/rfc/rfc8297#page-3
     *
     * This code indicates to the client that the server is likely to send a final response with the header fields included in the informational response.
     */
    ReasonPhrases["EARLY_HINTS"] = "Early Hints";
    /**
     * Official Documentation @ https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.15
     *
     * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
     */
    ReasonPhrases["UPGRADE_REQUIRED"] = "Upgrade Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
     *
     * This is similar to 401 but authentication is needed to be done by a proxy.
     */
    ReasonPhrases["PROXY_AUTHENTICATION_REQUIRED"] = "Proxy Authentication Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
     *
     * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
     */
    ReasonPhrases["REQUEST_HEADER_FIELDS_TOO_LARGE"] = "Request Header Fields Too Large";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
     *
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    ReasonPhrases["REQUEST_TIMEOUT"] = "Request Timeout";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
     *
     * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
     */
    ReasonPhrases["REQUEST_TOO_LONG"] = "Request Entity Too Large";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
     *
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    ReasonPhrases["REQUEST_URI_TOO_LONG"] = "Request-URI Too Long";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
     *
     * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
     */
    ReasonPhrases["REQUESTED_RANGE_NOT_SATISFIABLE"] = "Requested Range Not Satisfiable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
     *
     * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     */
    ReasonPhrases["RESET_CONTENT"] = "Reset Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
     *
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     */
    ReasonPhrases["SEE_OTHER"] = "See Other";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
     *
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    ReasonPhrases["SERVICE_UNAVAILABLE"] = "Service Unavailable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
     *
     * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     */
    ReasonPhrases["SWITCHING_PROTOCOLS"] = "Switching Protocols";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
     *
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    ReasonPhrases["TEMPORARY_REDIRECT"] = "Temporary Redirect";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
     *
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    ReasonPhrases["TOO_MANY_REQUESTS"] = "Too Many Requests";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
     *
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    ReasonPhrases["UNAUTHORIZED"] = "Unauthorized";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7725
     *
     * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    ReasonPhrases["UNAVAILABLE_FOR_LEGAL_REASONS"] = "Unavailable For Legal Reasons";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
     *
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    ReasonPhrases["UNPROCESSABLE_ENTITY"] = "Unprocessable Entity";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
     *
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    ReasonPhrases["UNSUPPORTED_MEDIA_TYPE"] = "Unsupported Media Type";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
     *
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     */
    ReasonPhrases["USE_PROXY"] = "Use Proxy";
    /**
     * Official Documentation @ https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.2
     *
     * Defined in the specification of HTTP/2 to indicate that a server is not able to produce a response for the combination of scheme and authority that are included in the request URI.
     */
    ReasonPhrases["MISDIRECTED_REQUEST"] = "Misdirected Request";
})(ReasonPhrases || (ReasonPhrases = {}));

;// CONCATENATED MODULE: ../node_modules/http-status-codes/build/es/index.js
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};






/* harmony default export */ const es = (__assign(__assign({}, legacy), { getStatusCode: getStatusCode,
    getStatusText: getStatusText }));


/***/ }),

/***/ 8811:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const uuidv4 = __webpack_require__(1276)
const parser = __webpack_require__(4091)
const maxInt = Math.pow(2, 31) - 1
const Buffer = loadBuffer()
function loadBuffer () {
  const b = __webpack_require__(8891)
  // use third party module if no buffer module
  return b && b.Buffer
    ? b.Buffer
    : (__webpack_require__(8891).Buffer)
}
const base64Padding = Buffer.from('==', 'base64')

function hyperid (opts) {
  let fixedLength = false
  let urlSafe = false
  if (typeof opts === 'boolean') {
    fixedLength = opts
  } else {
    opts = opts || {}
    urlSafe = !!opts.urlSafe
    fixedLength = !!opts.fixedLength
  }

  generate.uuid = uuidv4()
  generate.decode = decode

  let id = baseId(generate.uuid, urlSafe)
  let count = Math.floor(opts.startFrom || 0)

  if (isNaN(count) || !(maxInt > count && count >= 0)) {
    throw new Error([
      `when passed, opts.startFrom must be a number between 0 and ${maxInt}.`,
      'Only the integer part matters.',
      `- got: ${opts.startFrom}`
    ].join('\n'))
  }

  return generate

  function generate () {
    let result
    if (count === maxInt) {
      generate.uuid = uuidv4()
      id = baseId(generate.uuid, urlSafe) // rebase
      count = 0
    }
    if (fixedLength) {
      result = id + `0000000000${count}`.slice(-10)
    } else {
      result = id + count
    }
    count = (count + 1) | 0
    return result
  }
}

function baseId (id, urlSafe) {
  const base64Id = Buffer.concat([Buffer.from(parser.parse(id)), base64Padding]).toString('base64')
  if (urlSafe) {
    return base64Id.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '-')
  }
  return base64Id.replace(/=+$/, '/')
}

function decode (id, opts) {
  opts = opts || {}
  const urlSafe = !!opts.urlSafe

  if (urlSafe) {
    id = id.replace(/-([^-]*)$/, '/' + '$1')
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  }

  if (id.length < 22) {
    return null
  }
  const lastSlashIndex = id.lastIndexOf('/')
  if (lastSlashIndex === -1) {
    return null
  }
  const uuidPart = id.substring(0, lastSlashIndex)
  const countPart = Number(id.substring(lastSlashIndex + 1))
  if (!uuidPart || isNaN(countPart)) {
    return null
  }

  const result = {
    uuid: parser.unparse(Buffer.from(uuidPart + '==', 'base64')),
    count: countPart
  }

  return result
}

module.exports = hyperid
module.exports.decode = decode


/***/ }),

/***/ 1276:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// TODO use WebCrypto uuid() if it is available
const { v4: uuidv4 } = __webpack_require__(6367)
module.exports = uuidv4


/***/ }),

/***/ 8239:
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 2501:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

var ws = null

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket
} else if (typeof __webpack_require__.g !== 'undefined') {
  ws = __webpack_require__.g.WebSocket || __webpack_require__.g.MozWebSocket
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket
} else if (typeof self !== 'undefined') {
  ws = self.WebSocket || self.MozWebSocket
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ws);


/***/ }),

/***/ 8527:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = __webpack_require__(3966);
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
    /* eslint-env browser */
    if (typeof window !== 'undefined' && obj === window) {
        return '{ [object Window] }';
    }
    if (obj === __webpack_require__.g) {
        return '{ [object globalThis] }';
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}


/***/ }),

/***/ 769:
/***/ ((module) => {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};


/***/ }),

/***/ 8985:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var stringify = __webpack_require__(1088);
var parse = __webpack_require__(2286);
var formats = __webpack_require__(769);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ 2286:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(5364);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowEmptyArrays: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decodeDotInKeys: true,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    duplicates: 'combine',
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = { __proto__: null };

    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        var existing = has.call(obj, key);
        if (existing && options.duplicates === 'combine') {
            obj[key] = utils.combine(obj[key], val);
        } else if (!existing || options.duplicates === 'last') {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = options.allowEmptyArrays && leaf === '' ? [] : [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, '.') : cleanRoot;
            var index = parseInt(decodedRoot, 10);
            if (!options.parseArrays && decodedRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== decodedRoot
                && String(index) === decodedRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (decodedRoot !== '__proto__') {
                obj[decodedRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.decodeDotInKeys !== 'undefined' && typeof opts.decodeDotInKeys !== 'boolean') {
        throw new TypeError('`decodeDotInKeys` option can only be `true` or `false`, when provided');
    }

    if (opts.decoder !== null && typeof opts.decoder !== 'undefined' && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    var duplicates = typeof opts.duplicates === 'undefined' ? defaults.duplicates : opts.duplicates;

    if (duplicates !== 'combine' && duplicates !== 'first' && duplicates !== 'last') {
        throw new TypeError('The duplicates option must be either combine, first, or last');
    }

    var allowDots = typeof opts.allowDots === 'undefined' ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

    return {
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === 'boolean' ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        duplicates: duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};


/***/ }),

/***/ 1088:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var getSideChannel = __webpack_require__(588);
var utils = __webpack_require__(5364);
var formats = __webpack_require__(769);
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    allowEmptyArrays: false,
    arrayFormat: 'indices',
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encodeDotInKeys: false,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    commaRoundTrip,
    allowEmptyArrays,
    strictNullHandling,
    skipNulls,
    encodeDotInKeys,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        if (encodeValuesOnly && encoder) {
            obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var encodedPrefix = encodeDotInKeys ? prefix.replace(/\./g, '%2E') : prefix;

    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + '[]' : encodedPrefix;

    if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
        return adjustedPrefix + '[]';
    }

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var encodedKey = allowDots && encodeDotInKeys ? key.replace(/\./g, '%2E') : key;
        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix
            : adjustedPrefix + (allowDots ? '.' + encodedKey : '[' + encodedKey + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            allowEmptyArrays,
            strictNullHandling,
            skipNulls,
            encodeDotInKeys,
            generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.encodeDotInKeys !== 'undefined' && typeof opts.encodeDotInKeys !== 'boolean') {
        throw new TypeError('`encodeDotInKeys` option can only be `true` or `false`, when provided');
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    var arrayFormat;
    if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if ('indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = defaults.arrayFormat;
    }

    if ('commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }

    var allowDots = typeof opts.allowDots === 'undefined' ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat: arrayFormat,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === 'boolean' ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
    var commaRoundTrip = generateArrayPrefix === 'comma' && options.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.allowEmptyArrays,
            options.strictNullHandling,
            options.skipNulls,
            options.encodeDotInKeys,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ 5364:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var formats = __webpack_require__(769);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        /* eslint operator-linebreak: [2, "before"] */
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};


/***/ }),

/***/ 8973:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(8897);
var define = __webpack_require__(9381);
var hasDescriptors = __webpack_require__(6900)();
var gOPD = __webpack_require__(1399);

var $TypeError = __webpack_require__(1711);
var $floor = GetIntrinsic('%Math.floor%');

/** @type {import('.')} */
module.exports = function setFunctionLength(fn, length) {
	if (typeof fn !== 'function') {
		throw new $TypeError('`fn` is not a function');
	}
	if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
		throw new $TypeError('`length` must be a positive 32-bit integer');
	}

	var loose = arguments.length > 2 && !!arguments[2];

	var functionLengthIsConfigurable = true;
	var functionLengthIsWritable = true;
	if ('length' in fn && gOPD) {
		var desc = gOPD(fn, 'length');
		if (desc && !desc.configurable) {
			functionLengthIsConfigurable = false;
		}
		if (desc && !desc.writable) {
			functionLengthIsWritable = false;
		}
	}

	if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
		if (hasDescriptors) {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length, true, true);
		} else {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length);
		}
	}
	return fn;
};


/***/ }),

/***/ 588:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(8897);
var callBound = __webpack_require__(9343);
var inspect = __webpack_require__(8527);

var $TypeError = __webpack_require__(1711);
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
* This function traverses the list returning the node corresponding to the given key.
*
* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list. By doing so, all the recently used nodes can be accessed relatively quickly.
*/
/** @type {import('.').listGetNode} */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	/** @type {typeof list | NonNullable<(typeof list)['next']>} */
	var prev = list;
	/** @type {(typeof list)['next']} */
	var curr;
	for (; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			// eslint-disable-next-line no-extra-parens
			curr.next = /** @type {NonNullable<typeof list.next>} */ (list.next);
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

/** @type {import('.').listGet} */
var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
/** @type {import('.').listSet} */
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = /** @type {import('.').ListNode<typeof value>} */ ({ // eslint-disable-line no-param-reassign, no-extra-parens
			key: key,
			next: objects.next,
			value: value
		});
	}
};
/** @type {import('.').listHas} */
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

/** @type {import('.')} */
module.exports = function getSideChannel() {
	/** @type {WeakMap<object, unknown>} */ var $wm;
	/** @type {Map<object, unknown>} */ var $m;
	/** @type {import('.').RootNode<unknown>} */ var $o;

	/** @type {import('.').Channel} */
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					// Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};


/***/ }),

/***/ 8702:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Subscriptions = exports.Subscription = void 0;
var events_1 = __importDefault(__webpack_require__(6827));
var core_1 = __importDefault(__webpack_require__(112));
var rcsdk_1 = __importDefault(__webpack_require__(2916));
var ws_1 = __importDefault(__webpack_require__(1241));
var wait_for_async_1 = __importDefault(__webpack_require__(8335));
var Subscription = /** @class */ (function (_super) {
    __extends(Subscription, _super);
    function Subscription(options) {
        var _this = _super.call(this) || this;
        _this.events = {
            notification: 'notification',
        };
        _this.subscriptions = options.subscriptions;
        return _this;
    }
    Subscription.prototype.setEventFilters = function (eventFilters) {
        this.eventFilters = eventFilters;
        return this;
    };
    Subscription.prototype.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wsExtension;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.subscriptions.init()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.subscriptions.newWsExtension()];
                    case 2:
                        wsExtension = _a.sent();
                        return [4 /*yield*/, wsExtension.subscribe(this.eventFilters, function (event) {
                                _this.emit(_this.events.notification, event);
                            })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Subscription;
}(events_1.default));
exports.Subscription = Subscription;
var Subscriptions = /** @class */ (function () {
    function Subscriptions(options) {
        this.status = 'new'; // new, in-progress, ready
        this.rc = new core_1.default();
        this.rcSdkExtension = new rcsdk_1.default({ rcSdk: options.sdk });
    }
    Subscriptions.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status === 'ready') {
                            return [2 /*return*/];
                        }
                        if (!(this.status === 'in-progress')) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, wait_for_async_1.default)({
                                condition: function () { return _this.status === 'ready'; },
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        this.status = 'in-progress';
                        return [4 /*yield*/, this.rc.installExtension(this.rcSdkExtension)];
                    case 3:
                        _a.sent();
                        this.status = 'ready';
                        return [2 /*return*/];
                }
            });
        });
    };
    Subscriptions.prototype.newWsExtension = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wsExtension;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wsExtension = new ws_1.default();
                        return [4 /*yield*/, this.rc.installExtension(wsExtension)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, wsExtension];
                }
            });
        });
    };
    Subscriptions.prototype.createSubscription = function () {
        return new Subscription({ subscriptions: this });
    };
    return Subscriptions;
}());
exports.Subscriptions = Subscriptions;
exports["default"] = Subscriptions;


/***/ }),

/***/ 4091:
/***/ ((module) => {

"use strict";


// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0;
  var ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0;
  var bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = {
  parse: parse,
  unparse: unparse
};


/***/ }),

/***/ 6367:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  NIL: () => (/* reexport */ nil),
  parse: () => (/* reexport */ esm_browser_parse),
  stringify: () => (/* reexport */ esm_browser_stringify),
  v1: () => (/* reexport */ esm_browser_v1),
  v3: () => (/* reexport */ esm_browser_v3),
  v4: () => (/* reexport */ esm_browser_v4),
  v5: () => (/* reexport */ esm_browser_v5),
  validate: () => (/* reexport */ esm_browser_validate),
  version: () => (/* reexport */ esm_browser_version)
});

;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/regex.js
/* harmony default export */ const regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/validate.js


function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/* harmony default export */ const esm_browser_validate = (validate);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!esm_browser_validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const esm_browser_stringify = (stringify);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/v1.js

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || esm_browser_stringify(b);
}

/* harmony default export */ const esm_browser_v1 = (v1);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/parse.js


function parse(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const esm_browser_parse = (parse);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/v35.js



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = esm_browser_parse(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return esm_browser_stringify(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/md5.js
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const esm_browser_md5 = (md5);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/v3.js


var v3 = v35('v3', 0x30, esm_browser_md5);
/* harmony default export */ const esm_browser_v3 = (v3);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return esm_browser_stringify(rnds);
}

/* harmony default export */ const esm_browser_v4 = (v4);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/sha1.js
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const esm_browser_sha1 = (sha1);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/v5.js


var v5 = v35('v5', 0x50, esm_browser_sha1);
/* harmony default export */ const esm_browser_v5 = (v5);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/nil.js
/* harmony default export */ const nil = ('00000000-0000-0000-0000-000000000000');
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/version.js


function version(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const esm_browser_version = (version);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/index.js










/***/ }),

/***/ 8335:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var defaultOptions = {
    interval: 1000,
    condition: function () { return true; },
    times: Infinity,
};
/**
 * Wait for `condition()` to be `true`.
 * Its value is checked every `interval` milliseconds,
 * check no more than `times` intervals in total.
 * @param waitForOptions check the docs for `WaitForOptions`.
 * @returns Whenever `condition()` becomes `true`, return `true`.
 * If `condition()` never becomes `true` until `times` intervals passed, return `false`.
 */
var waitFor = function (waitForOptions) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, interval, condition, times;
    return __generator(this, function (_b) {
        _a = __assign(__assign({}, defaultOptions), waitForOptions), interval = _a.interval, condition = _a.condition, times = _a.times;
        return [2 /*return*/, new Promise(function (resolve) {
                var count = 0;
                var handle = setInterval(function () {
                    if (condition()) {
                        clearInterval(handle);
                        resolve(true);
                    }
                    count += 1;
                    if (count >= times) {
                        clearInterval(handle);
                        resolve(false);
                    }
                }, interval);
            })];
    });
}); };
exports["default"] = waitFor;


/***/ }),

/***/ 3966:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 3139:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Axios v1.6.8 Copyright (c) 2024 Matt Zabriskie and contributors


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : __webpack_require__.g)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0];
  }

  return str;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

var utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils$1.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$1.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$1.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var InterceptorManager$1 = InterceptorManager;

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

var platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = (
  (product) => {
    return hasBrowserEnv && ['ReactNative', 'NativeScript', 'NS'].indexOf(product) < 0
  })(typeof navigator !== 'undefined' && navigator.product);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv
});

var platform = {
  ...utils,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$1.isObject(data);

    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$1.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$1.isArrayBuffer(data) ||
      utils$1.isBuffer(data) ||
      utils$1.isStream(data) ||
      utils$1.isFile(data) ||
      utils$1.isBlob(data)
    ) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

var defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$1.freezeMethods(AxiosHeaders);

var AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$1.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

var cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils$1.isString(path) && cookie.push('path=' + path);

      utils$1.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

var isURLSameOrigin = platform.hasStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover its components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils$1.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })();

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    let {responseType, withXSRFToken} = config;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    let contentType;

    if (utils$1.isFormData(requestData)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false); // Let the browser set it
      } else if ((contentType = requestHeaders.getContentType()) !== false) {
        // fix semicolon duplication issue for ReactNative FormData implementation
        const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
        requestHeaders.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
      }
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if(platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(config));

      if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(fullPath))) {
        // Add xsrf header
        const xsrfValue = config.xsrfHeaderName && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

        if (xsrfValue) {
          requestHeaders.set(config.xsrfHeaderName, xsrfValue);
        }
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$1.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(fullPath);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};

utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({caseless}, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

const VERSION = "1.6.8";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;

        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';

        if (!err.stack) {
          err.stack = stack;
          // match without the 2 top stack lines
        } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
          err.stack += '\n' + stack;
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

var Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

var CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

var HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$1.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(8702);
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=ringcentral-subscriptions.js.map