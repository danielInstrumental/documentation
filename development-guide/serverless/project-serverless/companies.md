```js
const hubspot = require('@hubspot/api-client');

exports.main = async (context) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.PRIVATE_APP_TOKEN,
  });

  try {
    const response = await hubspotClient.crm.companies.basicApi.getPage(
      10,    // limit
      undefined, // after (pagination cursor)
      ['name', 'domain'] // properties to return
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ companies: response.results }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
``