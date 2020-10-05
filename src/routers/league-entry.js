// Just for testing purpose ? not sur we will need this api in the future since our API is 'summoner' centric
const express = require("express");
const tft = require("../utils/tft");
const LeagueEntry = require("../models/league-entry");

const router = new express.Router();

router.get("/entries/by-summoner/:summonerId", async (req, res) => {
  try {
    const entries = await tft.getLeagueEntries(req.params.summonerId);
    if (!entries) {
      return res.status(404).send();
    }
    res.send(entries);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/entries/all", async (req, res) => {
  try {
    await LeagueEntry.updateAll();
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
