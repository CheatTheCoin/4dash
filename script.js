async function fetchPrices() {
  const res = await fetch("/api/prices");
  return res.json();
}

function updateElement(id, value) {
  const container = document.getElementById(id);
  if (!value) {
    container.querySelector(".price").textContent = "N/A";
    container.querySelector(".change").textContent = "";
    return;
  }
  container.querySelector(".price").textContent = `$${value.price.toLocaleString()}`;
  const changeEl = container.querySelector(".change");
  changeEl.textContent = `${value.change.toFixed(2)}%`;
  changeEl.style.color = value.change >= 0 ? "#4caf50" : "#f44336";
}

async function updateDashboard() {
  const data = await fetchPrices();
  updateElement("btc", data.bitcoin);
  updateElement("paxg", data.paxg);
  updateElement("oil", data.oil);
  updateElement("sp500", data.sp500);
}

updateDashboard();
setInterval(updateDashboard, 300000);
