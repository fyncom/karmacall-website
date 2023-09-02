var phoneNumber = localStorage.getItem("phoneNumber");
var IPcountryCode = localStorage.getItem("IPcountryCode");

const myForm2 = document.getElementById("nanoAccountWithDraw");
myForm2.addEventListener("submit", function (e) {
  e.preventDefault();
  var externalNanoAccount = document.getElementById(
    "externalNanoAccount"
  ).value;

  //Regex to only allow Nano account formats
  const regex = RegExp(
    "(xrb|nano)_(1|3)[13456789abcdefghijkmnopqrstuwxyz]{59}"
  );
  if (regex.test(externalNanoAccount)) {
    if (!isBlank(nanoAccount) && !isBlank(sessionId)) {
      console.log("Withdraw Nano button hit");
      withdrawNano(externalNanoAccount);
    } else {
      console.log(
        "Sorry, not authorized. Try logging in through the previous page with your phone number"
      );
      alert(
        "Not authorized. Try logging in through the previous page with your phone number"
      );
    }
  } else {
    alert("You have entered an invalid Nano account, please try again");
  }
});

// Withdraw Nano // Need to get the amount to send and the account to send to.
async function withdrawNano(accountToSendTo) {
  var amountToSend = prompt("How much Nano would you like to withdraw?", "");
  try {
    await getUsdValueOfBalance(nanoAccount);
    const response = await sendNano(amountToSend, accountToSendTo);
    console.log("sendNano response successful with response ", response);
    if (!isBlank(response["transactionId"])) {
      // This call is lazy and wasteful - Should just subtract values if you want to update, rather than making another API call
      getUsdValueOfBalance(nanoAccount);
      alert("Nano successfully sent!");
    }
  } catch (err) {
    console.log(err);
  }
}

// Actually send the Nano
function sendNano(amountToSend, accountToSendTo) {
  var myNanoBalance;
  var a = "d5a6c821-80a5-4a28-a603-b1eed1139689";

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Credentials", "true");
  headers.append("GET", "POST", "OPTIONS");
  headers.append("Key", a);

  myNanoBalance = localStorage.getItem("nanoBalance");
  return new Promise((resolve, reject) => {
    if (amountToSend > myNanoBalance) {
      insufficientBalance = true;
      alert("This is more Nano than you have in your account");
      reject(insufficientBalance);
    }
    fetch("https://server.fyncom.com/nano/userSend", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        amount: amountToSend,
        countryCode: IPcountryCode,
        destinationAddress: accountToSendTo,
        sessionId: sessionId,
        sourceAddress: nanoAccount,
        userPhoneNumber: phoneNumber,
      }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => reject(error));
  });
}

function isBlank(str) {
  return !str || /^\s*$/.test(str);
}
