const businessSearch = require('./businessSearch.js');
const businessReview = require('./businessReview.js');
const envVariables = require('../env.json');

const express = require('express');
const app = express();
const port = 3000;

app.get('/top5', async (req, res) => {
    try {
        const top5Shops = await businessSearch.getTop5IceCreamShopsInAlpharetta()
            .then(response => businessReview.getBusinessesWithReviews(response));

        res.status(200).send(top5Shops);
    } catch (error) {
        console.log('Error when processing request:', error);
        res.status(500).send('Unfortunately, we cannot complete your request at this time due to an internal server error.');
    }
});

app.listen(port, () => {
    if (!envVariables.apiKey) {
        const errorMessage = 'ERROR: missing required API key. Your Yelp Fusion API key must be ' +
            'placed in a file called \"env.json\" located in the root of the project. ' +
            'This JSON file must contain a property called "apiKey" whose value must be your API key.';

        console.error(errorMessage);
        console.error('Aborting server startup.');

        throw new Error(errorMessage);
    }

    console.log(`Server is running on port ${port}`)
});