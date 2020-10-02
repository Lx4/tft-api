const express = require("express");
const Summoner = require("../models/summoner");
const { lowerNoSpaces } = require("../utils/helpers");

const router = new express.Router();

router.get("/summoners/update/:name", async (req, res) => {
  try {
    const db_name = lowerNoSpaces(req.params.name);
    const summoner = await Summoner.update(db_name);
    if (!summoner) {
      return res.status(404).send();
    }
    res.send(summoner);
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/summoners/leagueDetails/:name", async (req, res) => {
  try {
    const db_name = lowerNoSpaces(req.params.name);

    const summoner =
      (await Summoner.findOne({ db_name })) || (await Summoner.update(db_name));
    if (!summoner) {
      return res.status(404).send();
    }
    const data = await summoner.getLeagueDetails();
    res.send(data);
  } catch (error) {}
});

router.get("/summoners/:name", async (req, res) => {
  try {
    const db_name = lowerNoSpaces(req.params.name);
    let summoner =
      (await Summoner.findOne({ db_name })) || (await Summoner.update(db_name));
    if (!summoner) {
      return res.status(404).send();
    }
    console.log("populating matches");
    await summoner.populate("matches").execPopulate();
    console.log("populating leagueEntries");
    await summoner.populate("leagueEntries").execPopulate();
    console.log("after populating");
    res.send({
      meta: summoner,
      matches: summoner.matches,
      league: summoner.leagueEntries,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/summoners/profile/:name", async (req, res) => {
  try {
    const db_name = lowerNoSpaces(req.params.name);
    let summoner =
      (await Summoner.findOne({ db_name })) || (await Summoner.update(db_name));
    console.log("summoner profile : ");
    console.log(summoner);
    if (!summoner) {
      return res.status(404).send();
    }
    console.log("Router/Profile");
    console.log(summoner);
    const profile = await summoner.getProfile();
    console.log("Router/Profile/afterGetProfile");
    res.send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
