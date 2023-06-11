let url = 'https://server.fyncom.com';
const myForm = document.getElementById('phoneNumberInput');
// let a = "d5a6c821-80a5-4a28-a603-b1eed1139689" // try this after verifying everything works

myForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let phoneNumber = document.getElementById("phoneNumber").value;
    let codeDropdown = document.getElementById('countryCodes');
    let IPcountryCode = codeDropdown.options[codeDropdown.selectedIndex].dataset.countryCode

    const urlParams = new URLSearchParams(window.location.search);
    // const myParam = urlParams.get('_ijt'); // local testing
    const referralCode = urlParams.get('_referralCode');
    console.log("URL referral Variable is " + referralCode)
    doWork(phoneNumber, IPcountryCode)
});

async function doWork(number, IPcountryCode) {
    let a = "d5a6c821-80a5-4a28-a603-b1eed1139689"

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);

    let sessionId = "none";
    let thisUserId = 0;
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('_referralCode');
    // verify trigger
    try {
        localStorage.setItem("IPcountryCode", IPcountryCode)
        localStorage.setItem("phoneNumber", number)
        let object = await verify(number, IPcountryCode)
            .then(value => {
                console.log("response is ", value)
                console.log("sessionId is ", value['sessionId'])
                sessionId = value['sessionId']
                localStorage.setItem("sessionId", sessionId)
            });
        // verify confirm
        const response = await verifyConfirm(sessionId);
        console.log('Response Received from verifyConfirm', response);        

        const processedResponse = await handleVerifyResponse(response, number, IPcountryCode);
        // existing users
        if (!processedResponse) {
            const userId = await getUserId(number, IPcountryCode);
            console.log("Existing user Id ", userId['userId'])
            thisUserId = userId['userId']
            const nanoAccount = await getNanoAccount()
            const connectedAccount = await connectNanoAccountWithUserId(thisUserId, nanoAccount['nanoNodeWalletAccount'])
            console.log("response of new nano account connection is ", connectedAccount)
            if (connectedAccount['message'] === 'Welcome back!') {
                localStorage.setItem("nanoAccount", connectedAccount['currentDatabaseAccountAddress'])
            }
        } else { // new users
            console.log("This is a new user!")
            console.log(processedResponse['userId'])
            thisUserId = processedResponse['userId']
            const nanoAccount = await getNanoAccount()
            const connectedAccount = await connectNanoAccountWithUserId(thisUserId, nanoAccount['nanoNodeWalletAccount'])
            console.log("response of new nano account connection is ", connectedAccount)
            if (connectedAccount['message'] === 'Account address successfully saved') {
                localStorage.setItem("nanoAccount", connectedAccount['currentDatabaseAccountAddress'])
            }
        }
        console.log(processedResponse);
        localStorage.setItem("userId", thisUserId)

        // handle referral code
        if (referralCode != null) {
            console.log("referralCode is not null. It is " + referralCode)
            const referralResponse = await handleReferral(referralCode, thisUserId);
            console.log(referralResponse)
        } else {
            console.log("referralCode is null")
        }

        window.location = "cash-out"
    } catch (err) {
        console.log(err)
    }
}

let verify = async (number, IPcountryCode) => {
    let a = "d5a6c821-80a5-4a28-a603-b1eed1139689"

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);
    return new Promise((resolve, reject) => {
        fetch(url + '/verification/trigger', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                countryCode: IPcountryCode,
                number: number
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            resolve(data) // think of this as the "return" statement
        }).catch(error => reject('ERROR'))
    })
}

// This will be the second action - deliver OTP dialog, send input to verifyConfirm
function verifyConfirm(sessionId) {
    let a = "d5a6c821-80a5-4a28-a603-b1eed1139689"

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);
    /*    let counter = 0;
        verifyConfirm2(sessionId)*/
    // function verifyConfirm2(sessionId) {
    let otp = prompt("Please enter the 6 digit OTP that was sent to your phone", '');
    if (otp != null) {
        return new Promise((resolve, reject) => {
            fetch(url + '/verification/confirm', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    sessionId: sessionId,
                    verificationCode: otp
                })
            }).then(res => {
                return res.json()
            }).then(data => {
                /*                if (data['verificationStatus'] === 'FAILED') {
                                    if (counter > 1) {
                                        console.log("limit hit")
                                        alert("You are doing that too much, please try again later")
                                    }
                
                                    if (confirm("Wrong code was entered, would you like to try again?")) {
                                        console.log("Trying again")
                                        verifyConfirm2(sessionId)
                                    } else {
                                        console.log("Exited verifyConfirm")
                                    }
                                    console.log("counter is ", counter)
                                    counter++
                                }*/
                resolve(data) // think of this as the "return" statement
            }).catch(error => reject(error))
        })
    }
    // }
}

//depending on what verificationStatus is, Register User
function handleVerifyResponse(response, number, IPcountryCode) {
    let a = "d5a6c821-80a5-4a28-a603-b1eed1139689"

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);
    let newUser = false
    console.log(response)
    return new Promise((resolve, reject) => {
        if (response['verificationStatus'] === 'VERIFIED') {
            fetch(url + '/user/register', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    countryCode: IPcountryCode,
                    number: number
                })
            }).then(res => {
                if (res.status === 200) {
                    newUser = true
                    console.log("New User successfully Registered with code 200")
                    return res.json()
                } else if (res.status === 400) {
                    console.log("User already exists, code 400")
                    return res.json()
                }
            }).then(data => {
                console.log("in then before 2 variable resolve")
                if (newUser) {
                    resolve(data)
                } else {
                    resolve(newUser) // think of this as the "return" statement
                }
            }).catch(error => reject(error))
        } else if (response['verificationStatus'] === 'FAILED') {
            reject("Sorry, that wasn't the correct response code... Try again?")
        }
    })
}

//For existing users only
function getUserId(number, IPcountryCode) {
    let a = "d5a6c821-80a5-4a28-a603-b1eed1139689"

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);
    return new Promise((resolve, reject) => {
        fetch(url + '/user/getUser', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                countryCode: IPcountryCode,
                number: number
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            resolve(data) // think of this as the "return" statement
        }).catch(error => reject(error))
    })
}

//For new users only
function getNanoAccount() {
    let a = "d5a6c821-80a5-4a28-a603-b1eed1139689"

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);
    return new Promise((resolve, reject) => {
        fetch(url + '/wallet/createSimpleNanoAccount', {
            method: 'GET',
            headers: headers,
        }).then(res => {
            return res.json()
        }).then(data => {
            resolve(data) // think of this as the "return" statement
        }).catch(error => reject(error))
    })
}

function connectNanoAccountWithUserId(userId, nanoAccount) {
    let a = "d5a6c821-80a5-4a28-a603-b1eed1139689"

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);
    return new Promise((resolve, reject) => {
        fetch(url + '/payment/crypto/save', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                address: nanoAccount,
                addressType: "NANO",
                userId: userId
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            resolve(data) // think of this as the "return" statement
        }).catch(error => reject(error))
    })
}

//For referrals only.
function handleReferral(referralCode, userId) {
    let a = "d5a6c821-80a5-4a28-a603-b1eed1139689"

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST', 'OPTIONS');
    headers.append('Key', a);
    return new Promise((resolve, reject) => {
        fetch(url + '/nano/referralSignUp', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                referralCode: referralCode,
                referreeUserId: userId
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            resolve(data) // think of this as the "return" statement
        }).catch(error => reject(error))
    })
}

function getCallingCode() {
    const url = 'https://api.ipgeolocation.io/ipgeo?apiKey=9d0005d72b1a45619e83ccb9446e930b'
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            country = data.country_code2
            setCallingCode(country)
        })
        .catch((err) => {
            // Do something for an error here
        })
}

function setCallingCode(countryCode) {
    let IPcountryCode = countryCode;
    let codeDropdown = document.getElementById('countryCodes');
    localStorage.setItem("IPcountryCode", IPcountryCode)    
    for (let i, j = 0; i = codeDropdown.options[j]; j++) {
        if (i.dataset.countryCode == IPcountryCode) {
            codeDropdown.selectedIndex = j;
            i.selected = true
            return IPcountryCode
        }
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
getCallingCode()
