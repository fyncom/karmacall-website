var userId = localStorage.getItem("userId");
var nanoAccount = localStorage.getItem("nanoAccount");
var sessionId = localStorage.getItem("sessionId");
var countryCode = localStorage.getItem("IPcountryCode");
/*console.log("userId = ", localStorage.getItem("userId"))
console.log("nanoAccount = ", localStorage.getItem("nanoAccount"))
console.log("sessionId = ", localStorage.getItem("sessionId"))
console.log("Country Code =", countryCode)*/
var a = "d5a6c821-80a5-4a28-a603-b1eed1139689";

if (!isBlank(sessionId) && !isBlank(nanoAccount)) {
  if (countryCode === "BR") {
    getBrlValueOfBalance();
  } else {
    getUsdValueOfBalance();
  }
  var stringNanoAccount = "Your nano account is ";
  document.getElementById("nanoAccountText").innerHTML =
    stringNanoAccount.concat(nanoAccount);
}

async function getUsdValueOfBalance() {
  try {
    // Get user balance in Nano
    const object = await getNanoBalance();
    var nanoBalance = object["nanoAmount"];
    localStorage.setItem("nanoBalance", nanoBalance);
    // Get conversion rate
    const response = await getRate();
    console.log("Response Received from getRate", response);
    // Convert to USD and update text
    const processedRate = await calculateUsdBalance(
      response["amount"],
      nanoBalance
    );
    if (processedRate > 0) {
      var stringUsd = "$";
      var stringNano = "Your nano balance is ";
      document.getElementById("balanceText").innerHTML = stringUsd.concat(
        processedRate.toString()
      );
      document.getElementById("nanoBalanceText").innerHTML =
        stringNano.concat(nanoBalance);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getBrlValueOfBalance() {
  try {
    // Get user balance in Nano
    const object = await getNanoBalance();
    var nanoBalance = object["nanoAmount"];
    localStorage.setItem("nanoBalance", nanoBalance);
    // Get conversion rate
    const response = await getRateBrl();
    const usdtoNano = await getRate();
    console.log("Response Received from getRateBrl", response);
    // Convert to BRL and update text
    let processedRate = await calculateBRLBalance(
      response,
      nanoBalance,
      usdtoNano
    );
    if (processedRate > 0) {
      var stringBrl = "R$";
      // balanceText = R$0,00
      var stringNano = "Your nano balance is ";
      document.getElementById("balanceText").innerHTML = stringBrl.concat(
        processedRate.toString().replace(".", `,`)
      );
      document.getElementById("nanoBalanceText").innerHTML =
        stringNano.concat(nanoBalance);
      document.getElementById("balanceCurrency").innerHTML = "BRL";
    }
  } catch (err) {
    console.log(err);
  }
}

// Get Nano Rate In BRL
function getRateBrl() {
  var a = "d5a6c821-80a5-4a28-a603-b1eed1139689";

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Credentials", "true");
  headers.append("GET", "POST", "OPTIONS");
  headers.append("Key", a);
  return new Promise((resolve, reject) => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/usd-coin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false",
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.market_data.current_price.brl);
        // debugger
        // console.log(data['MarketData']['CurrentPrice']['BRL'])
        resolve(data.market_data.current_price.brl); // think of this as the "return" statement
      })
      .catch((error) => reject(error));
  });
}

// Check Nano Balance
function getNanoBalance() {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Credentials", "true");
  headers.append("GET", "POST", "OPTIONS");
  headers.append("Key", a);

  return new Promise((resolve, reject) => {
    fetch("https://server.fyncom.com/nano/getNanoBalance", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        address: nanoAccount,
      }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        resolve(data); // think of this as the "return" statement
      })
      .catch((error) => reject("ERROR"));
  });
}

// Get Nano Rate
function getRate() {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Credentials", "true");
  headers.append("GET", "POST", "OPTIONS");
  headers.append("Key", a);
  return new Promise((resolve, reject) => {
    fetch(
      "https://server.fyncom.com/payment/nano/get-conversion-rate/?currencyType=USD",
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        resolve(data); // think of this as the "return" statement
      })
      .catch((error) => reject(error));
  });
}

// Calculate USD balance
function calculateUsdBalance(usdToNanoRate, nanoBalance) {
  return new Promise((resolve, reject) => {
    var usdValue = usdToNanoRate * nanoBalance;
    console.log("Your USD balance is ", usdValue.toFixed(4));
    localStorage.setItem("usdValueOfMyNano", usdValue.toFixed(4).toString());
    resolve(usdValue.toFixed(4));
  });
}

// Calculate BRL balance
function calculateBRLBalance(brlToNanoRate, nanoBalance, usdtoNano) {
  //const brlToNanoRate = (getRateBrl())
  //console.log("usd to Nano is " + usdtoNano["amount"])
  return new Promise((resolve, reject) => {
    var brlValue = brlToNanoRate * nanoBalance * usdtoNano["amount"];
    console.log("Your BRL balance is ", brlValue.toFixed(4));
    localStorage.setItem("usdValueOfMyNano", brlValue.toFixed(4).toString());
    resolve(brlValue.toFixed(4));
  });
}

function isBlank(str) {
  return !str || /^\s*$/.test(str);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
