// This file provides function to call RIOT API

const fetch = require("node-fetch");

const urlTFTEU = "https://euw1.api.riotgames.com/tft";
const urlTFTMatchesEU = "https://europe.api.riotgames.com/tft";

const headers = {
  "X-Riot-Token": process.env.X_RIOT_TOKEN,
};

// TFT-SUMMONER-V1
const getSummoner = async (name) => {
  const summoner = await fetch(
    `${urlTFTEU}/summoner/v1/summoners/by-name/${name}`,
    {
      headers,
    }
  ).then((res) => {
    return res.json();
  });
  return summoner;
};

const getSummonerByPuuid = async (puuid) => {
  console.log("getSummonnerbyPuiid");
  const summoner = await fetch(
    `${urlTFTEU}/summoner/v1/summoners/by-puuid/${puuid}`,
    {
      headers,
    }
  ).then((res) => {
    return res.json();
  });
  return summoner;
};

// TFT-MATCH-V1

const getMatchesIds = async (puuid, count = 20) => {
  const lastMatches = await fetch(
    `${urlTFTMatchesEU}/match/v1/matches/by-puuid/${puuid}/ids?count=${count}`,
    { headers }
  ).then((res) => res.json());
  return lastMatches;
};

const getMatchData = async (matchId) => {
  const data = await fetch(`${urlTFTMatchesEU}/match/v1/matches/${matchId}`, {
    headers,
  }).then((res) => res.json());

  return data;
};

// TFT-LEAGUE-V1

const getLeagueEntries = async (summonerId) => {
  console.log("entering getLeagueEntries");
  const entries = await fetch(
    `${urlTFTEU}/league/v1/entries/by-summoner/${summonerId}`,
    { headers }
  )
    .then((res) => res.json())
    .catch((e) => {
      console.log("Error processing getLeagueEntries");
    });
  return entries;
};

const getLEbyTierDivision = async (tier, division) => {
  const entries = await fetch(
    `${urlTFTEU}/league/v1/entries/${tier}/${division}`,
    { headers }
  )
    .then((res) => res.json())
    .catch((e) => {
      console.log("Error processing getLEbyTierDivision");
    });
  return entries;
};

module.exports = {
  getSummoner,
  getSummonerByPuuid,
  getMatchesIds,
  getMatchData,
  getLeagueEntries,
  getLEbyTierDivision,
};
