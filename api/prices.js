export default async function handler(req, res) {
  try {
    console.log("API key:", process.env.FINNHUB_API_KEY);

    // Coingecko fetch
    const cg = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold&vs_currencies=usd&include_24hr_change=true");
    const cgData = await cg.json();
    console.log("Coingecko data:", cgData);

    const finnhubKey = process.env.FINNHUB_API_KEY;

    // Oil fetch
    const oil = await fetch(`https://finnhub.io/api/v1/quote?symbol=OANDA:BCO_USD&token=${finnhubKey}`);
    const oilData = await oil.json();
    console.log("Oil data:", oilData);

    // S&P 500 fetch
    const sp = await fetch(`https://finnhub.io/api/v1/quote?symbol=^GSPC&token=${finnhubKey}`);
    const spData = await sp.json();
    console.log("SP500 data:", spData);

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
        change: oilData.dp,
      },
      sp500: {
        price: spData.c,
        change: spData.dp,
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
