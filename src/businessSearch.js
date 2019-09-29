const httpClient = require('./httpClient');
const yelpApi = require('./yelpApi');

exports.getTopIceCreamShopsInAlpharetta = async function (amountOfShops) {
    let searchBusinessesUrl = buildSearchBusinessesUrl(amountOfShops);
    return await httpClient.runGetRequest(searchBusinessesUrl)
        .then(response => filterResponseAttributes(response));
}

function buildSearchBusinessesUrl(amountOfShops) {
    const queryCriteria = {
        'sort_by': 'rating',
        'limit': amountOfShops,
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