const chai = require('chai');
const assert = chai.assert;

const yelpApi = require('../../src/yelpApi');

describe('Yelp API base path', () => {
    it('should be equal to V3 API URL', (done) => {
        assert.equal('https://api.yelp.com/v3', yelpApi.basePath);
        done();
    });
});