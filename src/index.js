//c:/Users/Admin/mongodb/bin/mongod.exe --dbpath="C:/Users/Admin/mongodb-data"

const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const summonerRouter = require("./routers/summoner");
const matchRouter = require("./routers/match");
const leagueEntryRouter = require("./routers/league-entry");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(summonerRouter);
app.use(matchRouter);
app.use(leagueEntryRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
