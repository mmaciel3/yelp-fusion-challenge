const businessSearch = require('./businessSearch');
const businessReview = require('./businessReview');

exports.getTop5IceCreamShopsInAlpharettaWithReviews = async function () {
    return await businessSearch.getTopIceCreamShopsInAlpharetta(5)
        .then(response => businessReview.getBusinessesWithReviews(response));
}