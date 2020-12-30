require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const compression = require("compression");

// //  LIFTED FROM A NEXT.js APPLICATON... HOW SHOULD I REPLACE??
// const dev = process.env.NODE_ENV !== "production";
// const nextApp = next({ dev });
// const nextHandler = nextApp.getRequestHandler();

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

  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});
