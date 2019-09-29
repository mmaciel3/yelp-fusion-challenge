const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const testDouble = require('testdouble');

chai.use(chaiAsPromised);

describe('Get top 5 ice cream shops in Alpharetta with reviews', () => {
    let businessSearch, businessReview, shops;

    beforeEach(function () {
        businessSearch = testDouble.replace('../../src/businessSearch');
        businessReview = testDouble.replace('../../src/businessReview');
        shops = require('../../src/shops');
    });

    afterEach(function () {
        testDouble.reset();
    });

    it('should orchestrate the calls to Search Businesses and Business Reviews APIs', (done) => {
        const searchBusinessesResponse = {
            businesses: [
                { id: 'business1' }, { id: 'business2' }
            ]
        };

        const getBusinessesWithReviewsResponse = {
            businesses: [
                { id: 'business1', review: 'review1' }, { id: 'business2', review: 'review2' }
            ]
        };

        testDouble.when(businessSearch.getTopIceCreamShopsInAlpharetta(5))
            .thenReturn(Promise.resolve(searchBusinessesResponse));

        testDouble.when(businessReview.getBusinessesWithReviews(searchBusinessesResponse))
            .thenReturn(Promise.resolve(getBusinessesWithReviewsResponse));

        expect(shops.getTop5IceCreamShopsInAlpharettaWithReviews())
            .to.eventually.equal(getBusinessesWithReviewsResponse);

        done();
    });

    it('should propagate any errors that may happen in the call to Search Businesses API', (done) => {
        testDouble.when(businessSearch.getTopIceCreamShopsInAlpharetta(5))
            .thenReturn(Promise.reject(new Error()));

        expect(shops.getTop5IceCreamShopsInAlpharettaWithReviews())
            .to.eventually.be.rejectedWith(Error);

        done();
    });

    it('should propagate any errors that may happen in the call to Business Reviews API', (done) => {
        const searchBusinessesResponse = {
            businesses: [
                { id: 'business1' }, { id: 'business2' }
            ]
        };

        testDouble.when(businessSearch.getTopIceCreamShopsInAlpharetta(5))
            .thenReturn(Promise.resolve(searchBusinessesResponse));

        testDouble.when(businessReview.getBusinessesWithReviews(searchBusinessesResponse))
            .thenReturn(Promise.reject(new Error()));

        expect(shops.getTop5IceCreamShopsInAlpharettaWithReviews())
            .to.eventually.be.rejectedWith(Error);

        done();
    });
});