const httpClient = require('./httpClient.js');
const yelpApi = require('./yelpApi.js');

exports.getTop5IceCreamShopsInAlpharetta = async function () {
    let searchBusinessesUrl = buildSearchBusinessesUrl();
    return await httpClient.runGetRequest(searchBusinessesUrl)
        .then(response => filterResponseAttributes(response));
}

function buildSearchBusinessesUrl() {
    const queryCriteria = {
        'sort_by': 'rating',
        'limit': 5,
        'categories': 'icecream',
        'location': 'Alpharetta,GA,USA'
    };

    let queryString = buildEncodedQueryString(queryCriteria);

    return `${yelpApi.basePath}/businesses/search?${queryString}`;
}

function buildEncodedQueryString(queryCriteria) {
    let encodedQueryParameters = [];

    for (let [key, value] of Object.entries(queryCriteria)) {
        encodedQueryParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }

    return encodedQueryParameters.join('&');
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

function buildAddress(location) {
    let address = [location.address1, location.address2, location.address3]
        .filter(location => location && location != 'null' && location.trim() != '')
        .join(' ');

    return address + ', ' + location.city;
}