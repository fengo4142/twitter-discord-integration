// Importing Required Packages
const Twit = require("twit");
// Local Imports
const config = require("./config.json");
const log = require("./classes/log.js");
const discordHook = require("./classes/discord.js");
const ocr = require("./classes/ocr.js");
const Discord = require("discord.js");
const client = new Discord.Client();
let express = require("express");
const fs = require("fs");

let app = express();

app.set("port", process.env.PORT || 5000);

// Start node server
app.listen(app.get("port"), function () {
  console.log("Node server is running on port " + app.get("port"));
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);
  console.log("1");
});
process.on("uncaughtException", (reason) => {
  console.log(reason);
  console.log("2");
});

const prefix = ",";

let accountToMonitor = config.Twitter.Account;
let wait = false;
let lastTweet = 0;
const slowModeHype = 1000 / (100000 / 24 / 60 / 60) + 1;
const slowMode =
  1000 / ((100000 / 24 / 60 / 60) * config.Twitter.Keys.length) + 1;
const fastModeHype = 1000 / (1500 / 15 / 60) + 1;
const fastMode = 1000 / ((1500 / 15 / 60) * config.Twitter.Keys.length) + 1;
let mode = slowMode;
let timeout = 10000;
let hype = false;

client.on("ready", () => {
  log.green(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
  if (msg.author.bot || msg.channel.type === "dm") return;
  if (msg.content === `${prefix}ping`) {
    msg.channel.send("pong");
  }
  if (msg.content.split(" ")[0] === `${prefix}monitor`) {
    if (fs.existsSync("temp.json")) {
      let json = require("./temp.json");
      json.ids = [];
      fs.writeFile("temp.json", JSON.stringify(json), "utf8", (err) => {
        if (err) throw err;
      });
    }
    wait = true;
    accountToMonitor = msg.content.split(" ")[1];
    lastTweet = 0;
    wait = false;
  }
  if (msg.content === `${prefix}fast`) {
    mode = hype ? fastModeHype : fastMode;
    discordHook.fastMode();
  }
  if (msg.content.split(" ")[0] === `${prefix}timeout`) {
    wait = true;
    timeout = parseInt(msg.content.split(" ")[1]);
    wait = false;
    log.gray(`Set timeout to : ${timeout}`);
    msg.channel.send(`Set timeout to : ${timeout}`);
  }
  if (msg.content === `${prefix}hyped`) {
    wait = true;
    hype = true;
    mode = slowModeHype;
    wait = false;
    discordHook.hypeMode();
  }
  if (msg.content === `${prefix}normal`) {
    wait = true;
    hype = false;
    mode = slowMode;
    wait = false;
    discordHook.normalMode();
  }
  if (msg.content === `${prefix}slow`) {
    mode = hype ? slowModeHype : slowMode;
    discordHook.slowMode();
  }
  if (msg.content === `${prefix}pause`) {
    wait = true;
    discordHook.pause();
  }
  if (msg.content === `${prefix}acc`) {
    sendMonitoring(
      () => {
        log.green("Resolved");
      },
      () => {
        log.red("Rejected");
      },
      discordHook.currentMonitor
    );
  }
  if (msg.content === `${prefix}go`) {
    wait = false;
    discordHook.go();
    sendMonitoring(
      () => {
        log.green("Resolved");
      },
      () => {
        log.red("Rejected");
      },
      discordHook.sendMonitor
    );
  }
});

let userIds = []
const T = new Twit(config.AccountKeys[0]);

const sendMonitoring = (resolve, reject, hook) => {
  try {
    T.get(
      "users/show",
      { screen_name: accountToMonitor, include_entities: true },
      (err, response, data) => {
        if (err) {
          reject(err);
        }
        if (response) {
          userIds.push(response.id_str)
          //hook(response);
        }
        if (userIds.length === config.AccountKeys.length) {
          resolve();
        }
      }
    );
  } catch (err) {
    log.red("senddd");
    log.red(err);
  }
};

const followAccount = (keys, resolve, reject, k) => {
  try {
    const T = new Twit(keys);

    T.post(
      "friendships/create",
      { screen_name: accountToMonitor },
      (err, response, data) => {
        if (err) {
          reject(err);
        }
        log.gray(`Followed ${accountToMonitor} from ${keys.access_token}`);
        resolve();
      }
    );
    if (k === 0)
      sendMonitoring(resolve, reject, discordHook.sendMonitor);
  } catch (err) {
    log.red("followacc index");
    log.red(err);
  }
};

const followAll = (resolve, reject) => {
  config.AccountKeys.forEach((keys, k) =>
    accountToMonitor.length ? followAccount(keys, resolve, reject, k) : null
  );
}
const init = () => {
  log.green("Initializing Monitor!");
  return new Promise((resolve, reject) => {
    followAll(resolve, reject);
    log.green("Finished initializing Monitor!");
    resolve();
  });
};

const sendHook = (data) => {
  let tweetsIds = [];
  let isAlreadyHandled = false;
  if (data && data[0] && data[0]["id"] && lastTweet !== data[0]["id"]) {
    if (fs.existsSync("temp.json")) {
      let json = require("./temp.json");
      tweetsIds = json.ids;
    }
    if (tweetsIds) {
      isAlreadyHandled = tweetsIds.includes(data[0]["id"]);
    }
    if (lastTweet !== 0 && !isAlreadyHandled) {
      tweetsIds.push(data[0]["id"]);
      let res = {
        ids: tweetsIds,
      };
      fs.writeFile("temp.json", JSON.stringify(res), "utf8", (err) => {
        if (err) throw err;
      });
      discordHook.sendHook(data[0]);
    }
    lastTweet = data[0]["id"];
  }
};


const monitor = async () => {
  // Initializing Twitter Stream
  console.log("", userIds)
  let stream = T.stream("statuses/filter", { follow: userIds });

  // Stream Connect Event
  stream.on("connect", request => {
    log.cyan("Attempting to Connect to Twitter API");
  });

  // Stream Connected Event
  stream.on("connected", res => {
    log.cyan(
      `Monitor Connected to Twitter API. Monitoring ${
        config.Twitter.Keys.length
      } profiles.`
    );
  });

  // Stream Tweet Event
  stream.on("tweet", tweet => {
    // Looping through all userIds
    if (userIds.includes(tweet.user.id_str)) {
      // Tweet Reply?
      if (!isReply(tweet) === true) {
        log.green("New Tweet");
        sendHook(tweet);

        // Checking for Image - OCR
        if (tweet.entities.media) {
          ocr.getImageText(tweet, tweet.entities.media[0].media_url);
        }
      } else {
        log.red("Bad Tweet");
      }
    }
  });

  // Stream Warning Event
  stream.on("warning", warning => {
    log.yellow(`Monitor Received Warning from Twitter API 
    Warning Message: ${warning}`);
  });

  // Stream Disconnect Event
  stream.on("disconnect", disconnectMessage => {
    log.red(`Monitor Disconnected from Twitter API Stream 
    Error Message: ${disconnectMessage}`);
  });
};

init().then(
  setTimeout(() => {
    monitor()
  }, 3000)
);

