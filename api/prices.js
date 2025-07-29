import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const cg = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cpax-gold&vs_currencies=usd&include_24hr_change=true').then(r=>r.json());
    const finnhubKey = process.env.FINNHUB_API_KEY;

    const oilData = await fetch(`https://finnhub.io/api/v1/quote?symbol=OANDA:BCO_USD&token=${finnhubKey}`).then(r=>r.json());
    const spData = await fetch(`https://finnhub.io/api/v1/quote?symbol=^GSPC&token=${finnhubKey}`).then(r=>r.json());

    res.status(200).json({
      bitcoin: { price: cg.bitcoin.usd, change: cg.bitcoin.usd_24h_change },
      paxg: { price: cg["pax-gold"].usd, change: cg["pax-gold"].usd_24h_change },
      oil: { price: oilData.c, change: ((oilData.c - oilData.pc) / oilData.pc) * 100 },
      sp500: { price: spData.c, change: ((spData.c - spData.pc) / spData.pc) * 100 }
    });
  } catch (err) {
    res.status(500).json({ error: "API error", details: err.message });
  }
}
