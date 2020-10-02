const mongoose = require("mongoose");
const tft = require("../utils/tft");
const Match = require("../models/match");
const LeagueEntry = require("../models/league-entry");
const { lowerNoSpaces } = require("../utils/helpers");

const summonerSchema = new mongoose.Schema(
  {
    db_name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      unique: true,
    },
    puuid: {
      type: String,
      unique: true,
    },
    id: {
      type: String,
      unique: true,
    },
    accountId: {
      type: String,
      unique: true,
    },
    profileIconId: Number,
    summonerLevel: Number,
    revisionDate: Number,
  },
  { timestamps: true }
);

summonerSchema.virtual("matches", {
  ref: "Match",
  localField: "puuid",
  foreignField: "participants",
});

summonerSchema.virtual("leagueEntries", {
  ref: "LeagueEntry",
  localField: "id",
  foreignField: "summonerId",
});

summonerSchema.statics.update = async (query) => {
  const summonerData = await tft.getSummoner(query);
  if (summonerData.status) {
    return null;
  }
  const { puuid, id, name } = summonerData;
  const db_name = lowerNoSpaces(name);
  summonerData.db_name = db_name;
  const summoner = await Summoner.findOneAndUpdate({ db_name }, summonerData, {
    upsert: true,
    new: true,
  });
  await Match.update(puuid);
  await LeagueEntry.update(id);
  console.log("before return");
  return summoner;
};

//
summonerSchema.methods.getProfile = async function () {
  console.log("Models/getProfile");
  const summoner = this;
  const sort = {
    "info.game_datetime": -1,
  };
  const filter = {
    "info.queue_id": 1100, // RANKED 1100 UNRANKED 1090
    "info.tft_set_number": 4, // Last Version of the Game
  };
  await summoner
    .populate({
      path: "matches",
      match: filter,
      options: {
        limit: 20,
        sort,
      },
    })
    .execPopulate();
  await summoner
    .populate({
      path: "leagueEntries",
      options: {
        limit: 1,
        sort: {
          updatedAt: -1,
        },
      },
    })
    .execPopulate();

  console.log("Models/getProfile/return");
  return {
    meta: summoner,
    matches: summoner.matches,
    league: summoner.leagueEntries,
  };
};

summonerSchema.methods.getLeagueDetails = async function (limit = 20) {
  const summoner = this;
  await summoner.populate("leagueEntries").execPopulate();
  if (!summoner.leagueEntries) {
    return {}; // no entry
  }
  // !!!!! FIX Error control, check if the sort is ok with last entry returned
  return {
    leagueEntry: summoner.leagueEntries[0],
    updatedAt: summoner.updatedAt,
  };
};

const Summoner = mongoose.model("Summoner", summonerSchema);

module.exports = Summoner;
