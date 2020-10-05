const mongoose = require("mongoose");
const limiter = require("../utils/limiter");
const tft = require("../utils/tft");

const matchSchema = new mongoose.Schema({
  data_version: {
    type: String,
  },
  match_id: {
    type: String,
    unique: true,
    required: true,
  },
  participants: [
    {
      type: "String",
      ref: "Summoner",
    },
  ],
  participants_details: {
    type: ["Mixed"],
  },
  info: {
    game_datetime: {
      type: Number,
    },
    game_length: {
      type: Number,
    },
    game_variation: {
      type: String,
    },
    game_version: {
      type: String,
    },
    participants: {
      type: ["Mixed"],
    },
    queue_id: {
      type: Number,
    },
    tft_set_number: {
      type: Number,
    },
  },
});

matchSchema.statics.update = async (puuid) => {
  console.log("entering match update");
  const lastMatches = await tft.getMatchesIds(puuid);
  const matches = [];
  for (match_id of lastMatches) {
    const match = await Match.findOne({ match_id });
    if (!match) {
      matches.push(match_id);
    }
  }
  for (match_id of matches) {
    const { metadata, info } = await limiter.schedule(() =>
      tft.getMatchData(match_id)
    );
    const match = new Match({ ...metadata, info });
    await match.save();
  }
};

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
