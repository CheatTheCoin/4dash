import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // Fetch Bitcoin og PAXG frá CoinGecko
    const cgRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold&vs_currencies=usd&include_24hr_change=true"
    );
    const cgData = await cgRes.json();

    // CoinGecko values
    const bitcoin = {
      price: cgData.bitcoin.usd,
      change: cgData.bitcoin.usd_24h_change,
    };

    const paxg = {
      price: cgData["pax-gold"].usd,
      change: cgData["pax-gold"].usd_24h_change,
    };

    // Fetch Brent Oil frá Finnhub
    const finnhubKey = process.env.FINNHUB_API_KEY;

    const oilRes = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=OANDA:BCO_USD&token=${finnhubKey}`
    );
    const oilJson = await oilRes.json();

    const oil = {
      price: oilJson.c,
      change: ((oilJson.c - oilJson.pc) / oilJson.pc) * 100,
    };

    // Fetch S&P 500 frá Finnhub
    const spRes = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=^GSPC&token=${finnhubKey}`
    );
    const spJson = await spRes.json();

    const sp500 = {
      price: spJson.c,
      change: ((spJson.c - spJson.pc) / spJson.pc) * 100,
    };

    res.status(200).json({ bitcoin, paxg, oil, sp500 });
  } catch (err) {
    console.error("Villa í /api/prices:", err);
    res.status(500).json({ error: "Villa við að sækja gögn" });
  }
}
