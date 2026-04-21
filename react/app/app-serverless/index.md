<!-- example  -->


```js
// https://yourdomain.com/hs/serverless/get-language-property
// https://www-umhs-sk-org.sandbox.hs-sites.com/hs/serverless/api/language-property


// exports.main = async (context, sendResponse) => {
//   return {
//     statusCode: 200,
//     body: {
//       message: "Success"
//     },
//     headers: {
//       "Content-Type": "application/json"
//     }
//   };
// };

// const token = "pat-na---; 
const url = 'https://api.hubapi.com/crm/properties/v3/contacts/language';
const options = {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
};

exports.main = async (context) => {
  
  try {

    const res = await fetch(url, options);

    if(!res.ok) throw new Error(`Failed to fetch language property: ${res.status} ${res.statusText}`);

    const data = await res.json();
    console.log('Fetched language property data:', data);

    return { statusCode: 200, body: data };


  } catch (error) {
    return { statusCode: 500, body: { error: error.message } };
  }

};
```