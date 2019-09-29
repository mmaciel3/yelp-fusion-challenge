const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const testDouble = require('testdouble');

chai.use(chaiAsPromised);

describe('Run GET request', () => {
    let fetch, envVariables, httpClient;

    beforeEach(function () {
        fetch = testDouble.replace('node-fetch');
        envVariables = testDouble.replace('../../env.json');
        httpClient = require('../../src/httpClient');
    });

    afterEach(function () {
        testDouble.reset();
    });

    it('should call url received as parameter with the API key as header', (done) => {
        const url = 'myUrl';
        const apiKey = 'myApiKey';
        const options = {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 10000
        };

        envVariables.apiKey = apiKey;
        
        const responseBodyAsJson = {id: 'json response'};
        const responseOfGetCall = {
            json: () => Promise.resolve(responseBodyAsJson)
        }
        testDouble.when(fetch('myUrl', options))
            .thenReturn(Promise.resolve(responseOfGetCall));

        expect(httpClient.runGetRequest(url))
            .to.eventually.be.equal(responseBodyAsJson);

        done();
    });

    it('should propagate any errors that may happen in the GET call', (done) => {
        const url = 'myUrl';
        const apiKey = 'myApiKey';
        const options = {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 10000
        };

        envVariables.apiKey = apiKey;
        testDouble.when(fetch('myUrl', options))
            .thenReturn(Promise.reject(new Error()));

        expect(httpClient.runGetRequest(url))
            .to.eventually.be.rejectedWith(Error);

        done();
    });
});