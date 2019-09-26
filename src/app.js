const businessSearch = require('./businessSearch.js');
const businessReview = require('./businessReview.js');

async function logTop5Shops() {
    let top5Shops = await businessSearch.getTop5IceCreamShopsInAlpharetta()
        .then(response => businessReview.getBusinessesWithReviews(response));

    console.log(top5Shops);
}

logTop5Shops();