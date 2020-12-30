const express = require("express");
const fs = require("fs");
const SpotifyWebAPI = require("spotify-web-api-node");

const AuthConfig = require("./config/authorization.js");

const Robot = require("./models/Robot.js");
const QueueItem = require("./models/QueueItem.js");
const QueueManager = require("./models/QueueManager.js");

const spotifyApi = new SpotifyWebAPI({
  clientId: AuthConfig.CLIENT_ID,
  clientSecret: AuthConfig.CLIENT_SECRET,
});

const Router = express.Router;

let accessToken = null;

// Fetch a new Token
const fetchNewToken = (callback) => {
  console.log("Fetching new token..");
  spotifyApi
    .clientCredentialsGrant()
    .then((data) => {
      accessToken = data.body["access_token"];
      const expires_in = data.body["expires_in"];
      spotifyApi.setAccessToken(accessToken);
      callback && callback(accessToken);
      setTimeout(() => {
        fetchNewToken();
      }, (expires_in - 10 * 60) * 1000);
      // set to refresh in expires_in - 10 minutes
    })
    .catch((err) => {
      console.error("fetchNewToken says... > Error fetching new token", err);
    });
};

// Returns a new token OR the cached on is still valid
const getToken = (callback) => {
  if (accessToken !== null) {
    callback && callback(accessToken);
  } else {
    fetchNewToken(callback);
  }
};

const robotUser = new Robot({
  getToken: getToken,
  spotifyApi: spotifyApi,
});

let users = [robotUser.toJSON()];

let globalSocket = null;
let globalIo = null;

const queueManager = new QueueManager({
  onPlay: () => {
    const { track, user } = queueManager.getPlayingContext();
    // if one user happens to log-in on multiple tabs, just send "play track" on one tab,
    // and "update now playing" to other tabs....
    users.forEach((user) => {
      user.socketIdArray.forEach((socketId, index) => {
        if (index === 0) {
          globalIo.to(socketId).emit("play track", track, user);
        } else {
          globalIo.to(socketId).emit("update now playing", track, user);
        }
      });
    });
  },
  onQueueChanged: () => {
    globalSocket && globalSocket.emit("update queue", queueManager.getQueue());
    globalSocket &&
      globalSocket.broadcast.emit("update queue", queueManager.getQueue());
  },
  onQueueEnded: async () => {
    globalSocket && globalSocket.emit("update queue", queueManager.getQueue());
    globalSocket &&
      globalSocket.broadcast.emit("update queue", queueManager.getQueue());

    const robotRecommendation = await robotUser.generateRecommendation(
      queueManager.playedHistory,
      getToken,
      spotifyApi
    );
    if (robotRecommendation !== null) {
      queueManager.addItem(
        new QueueItem({
          track: robotRecommendation,
          user: robotUser,
        }).toJSON()
      );
    }
  },
});

queueManager.read();
queueManager.initialize();

const exportedApi = (io) => {
  let api = Router();

  globalIo = io;

  api.get("/", (req, res) => {
    res.json({ version });
  });

  api.get("/now-playing", (req, res) => {
    res.json(queueManager.playingContext);
  });

  api.get("/queue", (req, res) => {
    res.json(queueManager.queue);
  });

  api.get("/users", (req, res) => {
    res.json(users);
  });

  api.get("/me", async (req, res) => {
    await getToken();
    try {
      const resApi = spotifyApi.getMe();
      res.json(resApi.body);
    } catch (err) {
      console.error("error", err);
      res.status(500);
    }
  });

  // WEB SOCKET INTERFACE
  // socket.io
  io.on("connection", (socket) => {
    globalSocket = socket;
    socket.on("queue track", (trackId) => {
      console.log("queueing track " + trackId);
      getToken(() => {
        spotifyApi
          .getTrack(trackId)
          .then((resApi) => {
            queueManager.addItem(
              new QueueItem({
                user: socket.user,
                track: resApi.body,
              }).toJSON()
            );
          })
          .catch((err) => {
            console.error("error", err);
          });
      });
    });

    socket.on("vote up", (id) => {
      queueManager.voteUpId(socket.user, id);
    });

    socket.on("remove track", (id) => {
      queueManager.removeId(socket.user, id);
    });

    socket.on("user login", (user) => {
      let index = -1;
      users.forEach((u, i) => {
        if (u.id === user.id) {
          index = i;
        }
      });

      socket.user = user;
      if (index !== -1) {
        // the user has already logged-in, add their socketId into sockets
        users[index].socketIdArray.push(socket.id);
      } else {
        // otherwise... the user must not have logged-in yet
        users.push(Object.assign({}, user, { socketIdArray: [socket.id] }));
        socket.emit("update users", users);
        socket.broadcast.emit("update users", users);

        // check to see if user should start playing something
        const playingContext = queueManager.getPlayingContext();
        if (playingContext.track !== null) {
          socket.emit(
            "play track",
            playingContext.track,
            playingContext.user,
            Data.now() - playingContext.startTimestamp
          );
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnect " + socket.id);
      let userIndex = -1;
      let socketIdIndex = -1;
      users.forEach((user, i) => {
        user.socketIdArray.forEach((socketId, j) => {
          if (socketId === socket.id) {
            (userIndex = i), (socketIdIndex = j);
          }
        });
      });

      if (userIndex !== -1 && socketIdIndex !== -1) {
        if (users[userIndex].socketIdArray.length > 1) {
          // remove socketId from socketIdArray
          users[userIndex].socketIdArray.splice(socketIdIndex, 1);
        } else {
          // otherwise... remove user from users
          users.splice(userIndex, 1);
          socket.emit(
            "update users",
            users.map((u) => u.user)
          );
          socket.broadcast.emit(
            "update users",
            users.map((u) => u.user)
          );
        }
      }
    });
  });

  return api;
};

module.exports = exportedApi;
