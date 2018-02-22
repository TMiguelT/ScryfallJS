require('es6-promise').polyfill();
require('isomorphic-fetch');
const url = require('url');

const API_ROOT = 'https://api.scryfall.com';

class ApiEntry {
    /**
     *
     * @param parent The parent ScryfallApiClient
     * @param url The URL we have built up to this point
     * @returns {Proxy}
     */
    constructor(parent, url){
        return new Proxy({
            parent,
            url
        }, this);
    }

    call(target, thisArg, args){
        return fetch(this.path)
    }

    get(target, prop){
        return new ApiEntry(this.parent, url.resolve(this.url, prop))
    }
}

class ScryfallApiClient {
    constructor({clientSecret = null, grantSecret = null} = {}) {
        this.clientSecret = clientSecret;
        this.grantSecret = grantSecret;
    }

    get headers() {
        if (this.clientSecret)
            return {
                'Authorization': `Bearer cs-${this.clientSecret}`
            };
        else if (this.grantSecret)
            return {
                'Authorization': `Bearer gs-${this.grantSecret}`
            };
        else
            return {};
    }

    _request(url, body) {
        return fetch(url, {
            method: 'GET',
            headers: this.headers,
            body
        })
    }

    get cards(){
        console.log(API_ROOT);
        return new ApiEntry(this, url.resolve(API_ROOT, 'cards'));
    }
}

module.exports = ScryfallApiClient;