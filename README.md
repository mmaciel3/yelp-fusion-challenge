# Code challenge requirements
Write a program using Javascript and the [Yelp Fusion API](https://www.yelp.com/fusion) that tells what the top 5 ice cream shops in Alpharetta are and why.

The output of the application should include:
* The business name
* The business address (street, city)
* An excerpt from a review of that business
* The name of the person that wrote the review

The business information should be output in the order received from the API response.

# How to run the app

### Pre-requirements
1. Have [Git](https://git-scm.com/downloads) installed.
2. Have [Nodejs](https://nodejs.org/en/download/) installed.

### First setup
1. Clone this repository.
2. Create a file called ``env.json`` in the root of the project. This JSON file must contain a property called "apiKey" and the value of this property must be your Yelp Fusion API key. For example:
```json
{
    "apiKey": "this is where I place my API key"
}
```
3. Open a terminal window and browse to the directory where you cloned this repository.
4. Run command ``npm install``. This will download all the dependencies needed by this project.

### Running the application
1. Open a terminal window and browse to the directory where you cloned this repository.
2. Run command ``npm start``. This will start the server.

### Calling the API
After starting the application, you can now call the API by issuing a GET request to http://localhost:3000/top5.

# Technical details
I have tried to keep things as simple as possible. For this reason, I'm only using 2 NPM modules in the production code: express (to create a server with my API), and node-fetch (to issue HTTP requests to the Yelp Fusion API).  
I'm also not using any ES6 features so that I don't need to add a dependency on Babel.

The code structure is quite simple:
* [app.js](./src/app.js) is the entry point. It contains the Express API route and error handling.
* [businessReview.js](./src/businessReview.js) contains all the logic related to retrieving reviews for businesses from the Yelp Fusion API.
* [businessSearch.js](./src/businessSearch.js) has the business logic to get the top 5 icecream shops in Alpharetta, GA, from the Yelp Fusion API.
* [shops.js](./src/shops.js) orchestrates the calls to ``businessReview.js`` and ``businessSearch.js``.
* [httpClient.js](./src/httpClient.js) encapsulates the calls to the Yelp Fusion API.
* [yelpApi.js](./src/yelpApi.js) contains the base URL for the Yelp API. This is in a separate file so that, should Yelp release a new version of the API, we have a single point to be changed.

**Note**: the API returns icecream shops in Alpharetta and nearby cities. This is expected as per the documentation of the [Business Search API](https://www.yelp.com/developers/documentation/v3/business_search):

>| Name     | Type   | Description |
>| -------- | ------ | ----------- |
>| location | string | Required if either latitude or longitude is not provided. This string indicates the geographic area to be used when searching for businesses. Examples: "New York City", "NYC", "350 5th Ave, New York, NY 10118". ***Businesses returned in the response may not be strictly within the specified location.*** |

## Tests
This project contains both integration and unit tests.

Integration tests will actually call the Yelp Fusion API, so they may fail if the API is down for some reason. These tests are located at folder [/test/integration](./test/integration/).  
As a pre-requisite to running those tests, you need to have a file called ``env.json`` with your API key in the root of the project, as explained in the [First Setup section](#first-setup).  
The integration suite can be executed with the command ``npm run test:integration``.

Unit tests test each module independently, mocking any dependencies such as the call to the Fusion API, and therefore do not require an API key. The ``env.json`` file still needs to exist, but its content can be just an empty JSON.  
These tests are located at folder [/test/unit](./test/unit/) and can be run by executing the command ``npm run test:unit``.

Running both unit and integration tests at once is also possible by executing command ``npm test``.