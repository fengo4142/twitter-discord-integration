// Importing Required Packages
const Twit = require("twit");
const request = require("request-promise");
// Local Imports
const config = require("../config");
const log = require("./log");

const followAccount = (keys, resolve, reject, accountToFollow) => {
  const T = new Twit(keys);
  try {
    T.post(
      "friendships/create",
      { screen_name: accountToFollow },
      (err, response, data) => {
        if (err) {
          reject(err);
        }
        log.gray(`Followed ${accountToFollow} from ${keys.access_token}`);
        resolve();
      }
    );
  } catch (err) {
    log.red("followAccount discord.js");
    log.red(err);
    reject();
  }
};

const followAll = (resolve, reject, account) =>
  config.AccountKeys.forEach((keys) =>
    followAccount(keys, resolve, reject, account)
  );

module.exports = {
  currentMonitor: (user) => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              title: `**CURRENTLY MONITORING **[@${user.screen_name}]**`,
              url: `https://twitter.com/${user.screen_name}`,
              color: 12414443,
              footer: {
                text: "WFDevelopment | Twitter",
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
              thumbnail: {
                url: user.profile_image_url_https,
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent Monitored Hook");
          resolve();
        })
        .catch((err) => {
          log.red("currentMonitor");
          log.red(err);
        });
    });
  },
  go: () => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              title: `**THE MONITOR IS RUNNING**`,
              color: 12414443,
              footer: {
                text: "WFDevelopment | Twitter",
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent FastMode Hook");
          resolve();
        })
        .catch((err) => {
          log.red("go");
          log.red(err);
          reject();
        });
    });
  },
  pause: () => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              title: `**THE MONITOR HAS BEEN PAUSED**`,
              color: 12414443,
              footer: {
                text: "WFDevelopment | Twitter",
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent Pause Hook");
          resolve();
        })
        .catch((err) => {
          log.red("red");
          log.red(err);
          reject();
        });
    });
  },
  fastMode: () => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              title: `***SWITCHED TO FAST MODE***`,
              color: 12414443,
              footer: {
                text: "WFDevelopment | Twitter",
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent FastMode Hook");
          resolve();
        })
        .catch((err) => {
          log.red("fast");
          log.red(err);
          reject();
        });
    });
  },
  hypeMode: () => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              title: `***SWITCHED TO HYPEDDD MODE***`,
              color: 12414443,
              footer: {
                text: "WFDevelopment | Twitter",
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent HypedMode Hook");
          resolve();
        })
        .catch((err) => {
          log.red("hype");
          log.red(err);
          reject();
        });
    });
  },
  normalMode: () => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              title: `**SWITCHED TO NORMAL MODE**`,
              color: 12414443,
              footer: {
                text: "WFDevelopment | Twitter",
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent NormalMode Hook");
          resolve();
        })
        .catch((err) => {
          log.red("normalMode");
          log.red(err);
          reject();
        });
    });
  },
  slowMode: () => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              title: `**SWITCHED TO SLOW MODE**`,
              color: 12414443,
              footer: {
                text: "WFDevelopment | Twitter",
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent SlowMode Hook");
          resolve();
        })
        .catch((err) => {
          log.red("slowMode");
          log.red(err);
          reject();
        });
    });
  },
  sendMonitor: (user) => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              description: `**NOW MONITORING** [**[@${user.screen_name}]**](https://twitter.com/${user.screen_name})\n\n\`\`Good luck with the drop!\`\``,
              color: 12414443,
              footer: {
                text: "WFDevelopment | Twitter",
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
              thumbnail: {
                url: user.profile_image_url_https,
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent Monitored Hook");
          resolve();
        })
        .catch((err) => {
          log.red("sendMonitor");
          log.red(err);
          reject();
        });
    });
  },
  /**
   * Send Hook
   * Sends new tweet content when a new
   * tweet is found
   * @param {Object} tweet
   * @returns {Promise} resolves upon completion
   */
  sendHook: (tweet) => {
    const fields = [];

    // Checking if tweet contains a link
    if (tweet.entities.urls[0]) {
      log.gray("Link Identified");
      fields.push({
        name: "URL(s) in Tweet",
        value: tweet.entities.urls
          .map(
            (url) =>
              `[**(t.co)**](${url.url}) - [**${url.expanded_url}**](${url.expanded_url})`
          )
          .join("\n"),
        inline: false,
      });
    }

    // Checking if tweet mentions anyone
    // if (tweet.entities.user_mentions[0]) {
    //   log.gray("User Mention Identified");
    //   fields.push({
    //     name: "User Mentions:",
    //     value: tweet.entities.user_mentions
    //       .map((user) => {
    //         followAll(
    //           () => {
    //             log.green("Resolved");
    //           },
    //           () => {
    //             log.red("Rejected");
    //           },
    //           user.screen_name
    //         );
    //         return `[**@${user.screen_name}**](https://twitter.com/${user.screen_name}) - ${user.name}`;
    //       })
    //       .join("\n"),
    //     inline: false,
    //   });
    // }

    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          avatar_url:
            "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
          embeds: [
            {
              title: "**New Tweet Detected!**",
              url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
              description: tweet.full_text,
              color: 12414443,
              author: {
                name: `${tweet.user.name}`,
                url: `https://twitter.com/${tweet.user.screen_name}`,
                icon_url: tweet.user.profile_image_url_https,
              },
              image: {
                url: tweet.entities.media
                  ? tweet.entities.media[0].media_url
                  : "",
              },
              fields: fields,
              footer: {
                text: `WFDevelopment | Twitter`,
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent Hook");
          resolve();
        })
        .catch((err) => {
          log.red("embed sent");
          log.red(err);
          reject();
        });
    });
  },

  /**
   * Send OCR
   * Sends ocr image recognition results to
   * discord when tweet contains an image
   * @param {Object} tweet
   * @param {String} text
   * @returns {Promise} resolves upon completion
   */
  sendOcr: (tweet, text) => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          username: tweet.user.name,
          avatar_url: tweet.user.profile_image_url_https,
          embeds: [
            {
              color: 0x45c577,
              title: "OCR Result",
              description: text,
              footer: {
                text: `WFDevelopment | Twitter`,
                icon_url:
                  "https://cdn.discordapp.com/attachments/711998321564319875/714617139830718524/GeminiWillArtboard_1.png",
              },
            },
          ],
        },
      })
        .then(() => {
          log.gray("Sent OCR Results");
          resolve();
        })
        .catch((err) => {
          log.red("ocr");
          log.red(err);
          reject();
        });
    });
  },
};
