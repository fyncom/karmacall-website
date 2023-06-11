let nanoAccount = "nano_3rcpayu3g39njpq3mkizuepfr5rh1nwuz4xypwsmubkoiww88wubff8d719t";
let a = "d5a6c821-80a5-4a28-a603-b1eed1139689";
let url = "https://server.fyncom.com/";

getAccountBlockCount()

// Check Nano Balance
function getAccountBlockCount() {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);

    return new Promise((resolve, reject) => {
        fetch(url + 'nano/accountBlockCount', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                destinationAddress: nanoAccount,
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            const accountblockCount = data['accountBlockCount'];
            // console.log('AccountBlockCount is ', accountblockCount)
            if (accountblockCount > 0) {
                document.getElementById("totalPayments").innerHTML = accountblockCount;
            }
            resolve(data) // think of this as the "return" statement
        }).catch(error => reject('ERROR'))
    })
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
