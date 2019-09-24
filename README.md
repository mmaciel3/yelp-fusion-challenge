## Code challenge requirements
Write a program using Javascript and the [Yelp Fusion API](https://www.yelp.com/fusion) that tells what the top 5 ice cream shops in Alpharetta are and why.

The output of the application should include:
* The business name
* The business address (street, city)
* An excerpt from a review of that business
* The name of the person that wrote the review

The business information should be output in the order received from the API response.

## How to run the app

### 1. Pre-requirements
1. Have [Git](https://git-scm.com/downloads) installed.
2. Have [Nodejs](https://nodejs.org/en/download/) installed.

### 2. First setup
1. Clone this repository.
2. Create a file called ``env.json`` in the root of the project. This JSON file must contain a property called "apiKey" and the value of this property must be your Yelp Fusion API key. For example:
```json
{
    "apiKey": "this is where I place my API key"
}
```
3. Open a terminal window and browse to the directory where you cloned this repository.
4. Run command ``npm install``. This will download all the dependencies needed by this project.

### 3. Running the application
1. Open a terminal window and browse to the directory where you cloned this repository.
2. Run command ``npm start``.

## Code structure/design decisions
