require('dotenv').config();
const { AwsLambdaReceiver, App } = require("@slack/bolt");

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true, // Needed for Lambda
});

// Handle slash command
slackApp.command('/hello', async ({ ack, respond, command }) => {
  await ack();
  await respond(`Hello <@${command.user_id}>! 👋`);
});

// Handle mentions
slackApp.event('app_mention', async ({ event, say }) => {
  await say(`Hey <@${event.user}>! I'm alive on Lambda.`);
});

slackApp.event('app_home_opened', async ({ event, client }) => {
  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        callback_id: 'home_view',

        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `👋 Hello <@${event.user}>! Welcome to your Slack Bot Home.`
            }
          },
          {
            type: 'divider'
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Do Something'
                },
                action_id: 'do_something'
              }
            ]
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error publishing home tab:', error);
  }
});


module.exports = { slackApp };
