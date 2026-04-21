

# Serverless project
https://developers.hubspot.com/docs/cms/start-building/features/serverless-functions/getting-started-with-serverless-functions



1. Run the command below to create a new project using the 2025.1 platform version. Running the command without the --platform-version flag will create a 2025.2 project, which doesn’t support serverless functions.

hs project create --platform-version 2025.1

- Test call in browser
https://45519801.hs-sites.com/hs/serverless/fetch-quote



Add serverless function to project

project-folder/
└── hsproject.json
└── src/
    └── app/
       ├── app.json
       └── app.functions/
           ├── function.js
           ├── package.json
           └── serverless.json


```json

// app.json 

{
  "name": "Serverless function app",
  "description": "This app runs a serverless function to fetch a quote using the Zen Quotes API.",
  "scopes": ["crm.objects.contacts.read", "crm.objects.contacts.write"],
  "uid": "serverless-function-app",
  "public": false
}

```


```js

// function.json 

const axios = require('axios');

exports.main = async (context) => {
  try {
  // Make GET request to the ZenQuotes API
  const response = await axios.get('https://zenquotes.io/api/random');

  // Extract the quote data (first item in the array)
  const quoteData = response.data[0];

  // Log the quote and author to console
  console.log(`"${quoteData.q}" — ${quoteData.a}`);

  // Return a properly formatted response with status code and body
    return {
    statusCode: 200,
    body: quoteData,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
  // Handle any errors that occur during the request
  console.error('Error fetching quote:', error.message);

   // Return an error response
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch quote' },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

```



```json

// serverless.json 

{
"appFunctions": {
  "quote-function": {
      "file": "function.js",
      "secrets": [],
      "endpoint": {
      "path": "fetch-quote",
      "method": ["GET"]
    }
  }
}
}

```


```json

// package.json 

{
  "name": "example-serverless-function",
  "version": "0.1.0",
  "author": "HubSpot",
  "license": "MIT",
  "dependencies": {
    "@hubspot/api-client": "^7.0.1",
    "axios": "^0.27.2"
  }
}

```

example test
https://45519801.hs-sites.com/hs/serverless/fetch-quote