const fetch = require("node-fetch");
const envVariables = require("../env.json");

const yelpApiBasePath = 'https://api.yelp.com/v3';

function buildSearchBusinessesUrl() {
    const searchBusinessesApiPath = '/businesses/search';

    const queryCriteria = {
        'sort_by': 'rating',
        'limit': 5,
        'categories': 'icecream',
        'location': 'Alpharetta,GA,USA',
    }

    let queryString = buildEncodedQueryString(queryCriteria);

    return yelpApiBasePath + searchBusinessesApiPath + '?' + queryString;
}

function buildEncodedQueryString(queryCriteria) {
    let encodedQueryParameters = [];

    for (let [key, value] of Object.entries(queryCriteria)) {
        encodedQueryParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }

    return encodedQueryParameters.join('&');
}

async function runGetRequest(url, apiKey) {
    let options = {
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        timeout: 10000
    };

    let response = await fetch(url, options);
    return await response.json();
}

function buildAddress(location) {
    let address = [location.address1, location.address2, location.address3]
        .filter(location => location && location != 'null' && location.trim() != '')
        .join(' ');

    return address + ', ' + location.city;
}

function filterResponseAttributes(response) {
    let relevantFields = [];

    response.businesses.forEach(business => {
        relevantFields.push({
            id: business.id,
            name: business.name,
            address: buildAddress(business.location)
        });
    });

    return relevantFields;
}

async function getTop5IceCreamShopsInAlpharetta(apiKey) {
    let searchBusinessesUrl = buildSearchBusinessesUrl();
    return await runGetRequest(searchBusinessesUrl, apiKey);
}

async function addBusinessReview(apiKey, business) {
    let businessReviewsUrl = `${yelpApiBasePath}/businesses/${business.id}/reviews`;
    let response = await runGetRequest(businessReviewsUrl, apiKey);

    let firstReview = response.reviews[0];

    return {
        name: business.name,
        address: business.address,
        review: firstReview.text,
        reviewer: firstReview.user.name
    };
}

async function getBusinessesWithReviews(apiKey, businesses) {
    let businessesWithReviews = [];

    businesses.forEach(business => {
        businessesWithReviews.push(addBusinessReview(apiKey, business))
    });

    return Promise.all(businessesWithReviews);
}

(async () => {
    let apiKey = envVariables.apiKey;

    let top5Shops = await getTop5IceCreamShopsInAlpharetta(apiKey)
        .then(response => filterResponseAttributes(response))
        .then(response => getBusinessesWithReviews(apiKey, response));

    console.log(top5Shops);
})();