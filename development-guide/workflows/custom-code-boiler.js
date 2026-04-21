// https://developers.hubspot.com/docs/api-reference/automation-actions-v4-v4/custom-code-actions



// TESTING BOILERPLATE


/**
 * This is a boilerplate for custom code workflows.
 * 
 * Input Fields (Property to include in code):
 * - email: [email property internal name].
 *
 * Output Fields (data outputs):
 * - string: debug_message
 */

exports.main = async (event, callback) => {
  console.log('Custom code ran');
  console.log('Inputs:', event.inputFields);

  const email = event.inputFields.email || 'no email provided';

  callback({
    outputFields: {
      debug_message: `Workflow ran for: ${email}`
    }
  });
};
