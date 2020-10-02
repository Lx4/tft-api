const mongoose = require("mongoose");
const tft = require("../utils/tft");
const limiter = require("../utils/limiter");

const leagueEntrySchema = new mongoose.Schema(
  {
    leagueId: {
      type: "String",
      required: true,
    },
    queueType: {
      type: "String",
    },
    tier: {
      type: "String",
    },
    rank: {
      type: "String",
    },
    summonerId: {
      type: "String",
      ref: "Summoner",
    },
    summonerName: {
      type: "String",
    },
    leaguePoints: {
      type: "Number",
    },
    wins: {
      type: "Number",
    },
    losses: {
      type: "Number",
    },
    veteran: {
      type: "Boolean",
    },
    inactive: {
      type: "Boolean",
    },
    freshBlood: {
      type: "Boolean",
    },
    hotStreak: {
      type: "Boolean",
    },
  },
  { timestamps: true }
);

leagueEntrySchema.statics.update = async (summonerId) => {
  const lastEntries = await limiter.schedule(() =>
    tft.getLeagueEntries(summonerId)
  );
  const entries = [];
  for (lastEntry of lastEntries) {
    const entry = await LeagueEntry.findOne(lastEntry);
    if (!entry) {
      entries.push(lastEntry);
    }
  }
  for (entry of entries) {
    const newEntry = new LeagueEntry(entry);
    await newEntry.save();
  }
};

const LeagueEntry = mongoose.model("LeagueEntry", leagueEntrySchema);

module.exports = LeagueEntry;
