// ==========================================
// SIMPLE SERVERLESS TEST FUNCTION
// Can be called directly in the browser

// Replace with your site url
// https://50353423.hs-sites.com/_hcms/api/chat?message=Hi+there

// ==========================================

exports.main = async (context, sendResponse) => {
  try {
    // If called via browser GET request, context.body may be empty
    // We'll read query params if available
    const urlParams = new URLSearchParams(context.querystring);
    console.log("URL Params:", urlParams);
    const message = urlParams.get("message") || "Hello from browser";

    // Simple fake response
    const reply = `You said: "${message}". This is a demo response from serverless function.`;

    sendResponse({
      statusCode: 200,
      body: JSON.stringify({ reply }),
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    sendResponse({
      statusCode: 500,
      body: JSON.stringify({ error: "Serverless test failed." })
    });
  }
};
