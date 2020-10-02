// Just for testing purpose ? not sur we will need this api in the future since our API is 'summoner' centric

const express = require("express");
const Match = require("../models/match");
const tft = require("../utils/tft");

const router = new express.Router();

router.get("/matches/by-puuid/:puuid", async (req, res) => {
  try {
    const matchesIds = await tft.getMatchesIds(req.params.puuid);
    if (!matchesIds) {
      return res.status(404).send();
    }
    res.send(matchesIds);
  } catch (error) {
    res.status(400).send(e);
  }
});

router.get("/matches/:matchId", async (req, res) => {
  try {
    const match_id = req.params.matchId;
    let match = await Match.findOne({ match_id });
    if (!match) {
      match = await tft.getMatch(match_id);
    }
    if (!match) {
      return res.status(404).send();
    }
    res.send(match);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
