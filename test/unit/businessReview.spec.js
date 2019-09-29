const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const testDouble = require('testdouble');

chai.use(chaiAsPromised);

describe('Get business with reviews', () => {
    let yelpApi, httpClient, businessReview;

    beforeEach(function () {
        yelpApi = testDouble.replace('../../src/yelpApi');
        httpClient = testDouble.replace('../../src/httpClient');
        businessReview = require('../../src/businessReview');

        yelpApi.basePath = 'basePath';
    });

    afterEach(function () {
        testDouble.reset();
    })

    it('should build response with details from first review in the API response for one business', (done) => {
        const id = '1';
        const name = 'Ice Cream 4 All';
        const address = '100, Main St.';
        const firstReviewText = 'Wonderful!';
        const firstReviewer = 'Ice cream Joe';

        const businesses = [
            { id: id, name: name, address: address }
        ];

        const reviewResponse = {
            reviews: [
                { text: firstReviewText, user: { name: firstReviewer } },
                { text: 'Hated it!!', user: { name: 'who cares?' } }
            ]
        };

        const expectedResponse = { name: name, address: address, review: firstReviewText, reviewer: firstReviewer };

        yelpApi.basePath = 'basePath';
        testDouble.when(httpClient.runGetRequest(`basePath/businesses/${id}/reviews`))
            .thenReturn(Promise.resolve(reviewResponse));

        expect(businessReview.getBusinessesWithReviews(businesses)).to.eventually
            .be.an('array').that.deep.includes(expectedResponse)
            .and.to.have.lengthOf(1);

        done();
    });

    it('should build response with details from first review in the API response for multiple businesses', (done) => {
        const firstBusiness = {
            id: '1',
            name: 'name1',
            address: 'add1',
            reviewText: 'review1',
            reviewer: 'reviewer1'
        };

        const secondBusiness = {
            id: '2',
            name: 'name2',
            address: 'add2',
            reviewText: 'review2',
            reviewer: 'reviewer2'
        };

        const businesses = [
            { id: firstBusiness.id, name: firstBusiness.name, address: firstBusiness.address },
            { id: secondBusiness.id, name: secondBusiness.name, address: secondBusiness.address }
        ];

        const firstBusinessReviewsResponse = {
            reviews: [{ text: firstBusiness.reviewText, user: { name: firstBusiness.reviewer } }]
        };

        const secondBusinessReviewsResponse = {
            reviews: [{ text: secondBusiness.reviewText, user: { name: secondBusiness.reviewer } }]
        };

        const expectedResponseForFirstBusiness = {
            name: firstBusiness.name, address: firstBusiness.address, review: firstBusiness.reviewText, reviewer: firstBusiness.reviewer
        };

        const expectedResponseForSecondBusiness = {
            name: secondBusiness.name, address: secondBusiness.address, review: secondBusiness.reviewText, reviewer: secondBusiness.reviewer
        };

        yelpApi.basePath = 'basePath';
        testDouble.when(httpClient.runGetRequest(`basePath/businesses/${firstBusiness.id}/reviews`))
            .thenReturn(Promise.resolve(firstBusinessReviewsResponse));

        testDouble.when(httpClient.runGetRequest(`basePath/businesses/${secondBusiness.id}/reviews`))
            .thenReturn(Promise.resolve(secondBusinessReviewsResponse));

        expect(businessReview.getBusinessesWithReviews(businesses))
            .to.eventually.be.an('array')
            .that.includes.deep.ordered.members([expectedResponseForFirstBusiness, expectedResponseForSecondBusiness])
            .and.to.have.lengthOf(2);

        done();
    });

    it('should reject promise if call to Yelp API fails', (done) => {
        const id = '1';
        const name = 'name';
        const address = 'address';

        const businesses = [{ id: id, name: name, address: address }];

        testDouble.when(httpClient.runGetRequest(`basePath/businesses/${id}/reviews`))
            .thenReturn(Promise.reject(new Error()));

        expect(businessReview.getBusinessesWithReviews(businesses)).to.eventually
            .be.rejectedWith(Error);

        done();
    });
});