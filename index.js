const { slackApp } = require('./app');
const awsLambdaReceiver = slackApp.receiver;

exports.handler = async (event, context, callback) => {
  const handler = awsLambdaReceiver.toHandler();
  return handler(event, context, callback);
};
