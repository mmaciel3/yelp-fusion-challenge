const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const testDouble = require('testdouble');

chai.use(chaiAsPromised);

describe('Get top 5 ice cream shops in Alpharetta', () => {
    let yelpApi, httpClient, businessSearch;
    let getExpectedApiUrl = function (amountOfShops) {
        return `basePath/businesses/search?sort_by=rating&limit=${amountOfShops}&categories=icecream&location=Alpharetta%2CGA%2CUSA`;
    };

    beforeEach(function () {
        yelpApi = testDouble.replace('../../src/yelpApi');
        httpClient = testDouble.replace('../../src/httpClient');
        businessSearch = require('../../src/businessSearch');

        yelpApi.basePath = 'basePath';
    });

    afterEach(function () {
        testDouble.reset();
    });

    it('should build address based on the response when all address lines exist', (done) => {
        const amountOfShops = 1;

        const yelpApiResponse = {
            businesses:
                [
                    {
                        id: 'id',
                        name: 'name',
                        location: { address1: 'add1', address2: 'add2', address3: 'add3', city: 'city' }
                    }
                ]
        };

        const expectedResponse = { id: 'id', name: 'name', address: 'add1 add2 add3, city' }

        testDouble.when(httpClient.runGetRequest(getExpectedApiUrl(amountOfShops)))
            .thenReturn(Promise.resolve(yelpApiResponse));

        expect(businessSearch.getTopIceCreamShopsInAlpharetta(amountOfShops)).to.eventually
            .be.an('array').that.deep.includes(expectedResponse)
            .and.to.have.lengthOf(1);

        done();
    });

    it('should build address based on the response when an address line is null', (done) => {
        const amountOfShops = 1;

        const yelpApiResponse = {
            businesses:
                [
                    {
                        id: 'id',
                        name: 'name',
                        location: { address1: 'add1', address2: 'add2', address3: null, city: 'city' }
                    }
                ]
        };

        const expectedResponse = { id: 'id', name: 'name', address: 'add1 add2, city' }

        testDouble.when(httpClient.runGetRequest(getExpectedApiUrl(amountOfShops)))
            .thenReturn(Promise.resolve(yelpApiResponse));

        expect(businessSearch.getTopIceCreamShopsInAlpharetta(amountOfShops)).to.eventually
            .be.an('array').that.deep.includes(expectedResponse)
            .and.to.have.lengthOf(1);

        done();
    });

    it('should build address based on the response when an address line is a null string', (done) => {
        const amountOfShops = 1;

        const yelpApiResponse = {
            businesses:
                [
                    {
                        id: 'id',
                        name: 'name',
                        location: { address1: 'add1', address2: 'add2', address3: 'null', city: 'city' }
                    }
                ]
        };

        const expectedResponse = { id: 'id', name: 'name', address: 'add1 add2, city' }

        testDouble.when(httpClient.runGetRequest(getExpectedApiUrl(amountOfShops)))
            .thenReturn(Promise.resolve(yelpApiResponse));

        expect(businessSearch.getTopIceCreamShopsInAlpharetta(amountOfShops)).to.eventually
            .be.an('array').that.deep.includes(expectedResponse)
            .and.to.have.lengthOf(1);

        done();
    });

    it('should build address based on the response when an address line is empty', (done) => {
        const amountOfShops = 1;

        const yelpApiResponse = {
            businesses:
                [
                    {
                        id: 'id',
                        name: 'name',
                        location: { address1: 'add1', address2: 'add2', address3: '', city: 'city' }
                    }
                ]
        };

        const expectedResponse = { id: 'id', name: 'name', address: 'add1 add2, city' }

        testDouble.when(httpClient.runGetRequest(getExpectedApiUrl(amountOfShops)))
            .thenReturn(Promise.resolve(yelpApiResponse));

        expect(businessSearch.getTopIceCreamShopsInAlpharetta(amountOfShops)).to.eventually
            .be.an('array').that.deep.includes(expectedResponse)
            .and.to.have.lengthOf(1);

        done();
    });

    it('should reject promise if call to Yelp API fails', (done) => {
        const amountOfShops = 1;
        testDouble.when(httpClient.runGetRequest(getExpectedApiUrl(amountOfShops)))
            .thenReturn(Promise.reject(new Error()));

        expect(businessSearch.getTopIceCreamShopsInAlpharetta(amountOfShops)).to.eventually
            .be.rejectedWith(Error);

        done();
    });
});