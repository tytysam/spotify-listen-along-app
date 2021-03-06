// REF: https://socket.io/docs/v3/server-initialization/
// REF: https://developer.spotify.com/documentation/general/guides/authorization-guide/

require("dotenv").config();

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const compression = require("compression");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const auth = require("./authorization.js");
const api = require("./api.js");

app.prepare().then(() => {
  app.use(compression());
  app.use(cookieParser());
  // *** to-do: shift from ejs to jsx
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");

  // need this to parse our refresh_token
  app.use(
    bodyParser.json({
      limit: 1024,
    })
  );

  // Auth Router
  app.use("/auth", auth);
  app.use("/api", api(io));

  // *** to-do: 404???

  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(
      `Dude, let's surf the interwebs | Listening on port: ${
        process.env.PORT || 3000
      }`
    );
  });
});
