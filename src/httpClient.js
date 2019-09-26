const fetch = require('node-fetch');
const envVariables = require('../env.json');

const tenSeconds = 10000;

exports.runGetRequest = async function (url) {
    let options = {
        headers: {
            'Authorization': `Bearer ${envVariables.apiKey}`
        },
        timeout: tenSeconds
    };

    let response = await fetch(url, options);
    return await response.json();
}