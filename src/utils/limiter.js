// Use for limiting API calls (RIOT Limit 20/s & 100/2mn)
const Bottleneck = require("bottleneck");
const limiter = new Bottleneck({
  mintime: 150,
});

module.exports = limiter;
