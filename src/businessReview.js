const httpClient = require('./httpClient');
const yelpApi = require('./yelpApi');

exports.getBusinessesWithReviews = async function (businesses) {
    let businessesWithReviews = [];

    businesses.forEach(business => {
        businessesWithReviews.push(addBusinessReview(business))
    });

    return Promise.all(businessesWithReviews);
}

async function addBusinessReview(business) {
    let businessReviewsUrl = `${yelpApi.basePath}/businesses/${business.id}/reviews`;
    let response = await httpClient.runGetRequest(businessReviewsUrl);

    let firstReview = response.reviews[0];

    let result = {
        name: business.name,
        address: business.address,
        review: firstReview.text,
        reviewer: firstReview.user.name
    };

    return result;
}