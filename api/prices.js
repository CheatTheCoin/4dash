export default async function handler(req, res) {
  try {
    const cg = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold&vs_currencies=usd&include_24hr_change=true");
    const cgData = await cg.json();

    const finnhubKey = process.env.FINNHUB_API_KEY;

    const oil = await fetch(`https://finnhub.io/api/v1/quote?symbol=OANDA:BCO_USD&token=${finnhubKey}`);
    const oilData = await oil.json();

    const sp = await fetch(`https://finnhub.io/api/v1/quote?symbol=^GSPC&token=${finnhubKey}`);
    const spData = await sp.json();

    res.status(200).json({
      bitcoin: {
        price: cgData.bitcoin.usd,
        change: cgData.bitcoin.usd_24h_change,
      },
      paxg: {
        price: cgData["pax-gold"].usd,
        change: cgData["pax-gold"].usd_24h_change,
      },
      oil: {
        price: oilData.c,
        change: ((oilData.c - oilData.pc) / oilData.pc) * 100,
      },
      sp500: {
        price: spData.c,
        change: ((spData.c - spData.pc) / spData.pc) * 100,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Villa í að sækja gögn" });
  }
}
