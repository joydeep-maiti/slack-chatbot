require('dotenv').config();
const { AwsLambdaReceiver, App } = require('@slack/bolt');

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
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
      type: 'home',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: "Here's what you can do with Project Tracker:",
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Create New Task',
                emoji: true,
              },
              style: 'primary',
              value: 'create_task',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Create New Project',
                emoji: true,
              },
              value: 'create_project',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Help',
                emoji: true,
              },
              value: 'help',
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'image',
              image_url:
                'https://api.slack.com/img/blocks/bkb_template_images/placeholder.png',
              alt_text: 'placeholder',
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Your Configurations*',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*#public-relations*\n<fakelink.toUrl.com|PR Strategy 2019> posts new tasks, comments, and project updates to <fakelink.toChannel.com|#public-relations>',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Edit',
              emoji: true,
            },
            value: 'public-relations',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*#team-updates*\n<fakelink.toUrl.com|Q4 Team Projects> posts project updates to <fakelink.toChannel.com|#team-updates>',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Edit',
              emoji: true,
            },
            value: 'public-relations',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'New Configuration',
                emoji: true,
              },
              value: 'new_configuration',
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('Error publishing home tab:', error);
  }
});

module.exports = { slackApp };
