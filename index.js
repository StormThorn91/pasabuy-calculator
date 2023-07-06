const usdApiLink = 'https://www.freeforexapi.com/api/live?pairs=USDPHP';
const krwApiLink = 'https://www.freeforexapi.com/api/live?pairs=USDKRW';
const handlingPercent = 0.15;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log("Registered! ", reg)
            }).catch(err => {
                console.log("Registration failed ", err)
            })
    });
}

if (screen.width >= 700) {
    document.location = "desktop-guard.html";
}


window.onload = function () {
    var form = document.querySelector("form");
    form.onsubmit = calculation.bind(form);
}

const onForexOptionValueChanged = () => {
    if (document.getElementById('forex-option').value === 'KRW') {
        document.getElementById('real-amount').placeholder = 'Original Price in KRW'
    }
    else {
        document.getElementById('real-amount').placeholder = 'Original Price in USD'
    }
}

const conversion = async (val) => {
    let returnValue;
    document.getElementById("submit").disabled = true;
    let apiResponseUSD = await fetch('https://cors-anywhere.herokuapp.com/' + usdApiLink).then((response) =>
        response.json())
        .catch((err) => {
            console.log('Something went wrong :( ' + err)
        });

    let apiResponseKRW = await fetch('https://cors-anywhere.herokuapp.com/' + krwApiLink).then((response) =>
        response.json())
        .catch((err) => {
            console.log('Something went wrong :( ' + err)
        });

    if (apiResponseUSD) {
        localStorage.setItem('usdPhpConversion', apiResponseUSD.rates?.USDPHP?.rate)
        if (document.getElementById('forex-option').value === 'KRW') {
            if (apiResponseKRW) {
                let krwToPhp = apiResponseUSD.rates?.USDPHP?.rate / apiResponseKRW.rates?.USDKRW?.rate
                localStorage.setItem('krwPhpConversion', krwToPhp);
                returnValue = await val * krwToPhp;
                console.log(krwToPhp);
                document.getElementById("conversion-amount").innerHTML = '₱ 1.00 = ₩ ' + Number(krwToPhp).toFixed(2);
            }
        }

        else {
            returnValue = await val * apiResponseUSD.rates?.USDPHP?.rate;
            console.log(apiResponseUSD.rates.USDPHP.rate);
            document.getElementById("conversion-amount").innerHTML = '₱ 1.00 = $ ' + Number(apiResponseUSD.rates.USDPHP.rate).toFixed(2);
        }
    }

    else {
        let forexValue;
        if (document.getElementById('forex-option').value === 'KRW') {
            forexValue = localStorage.getItem('krwPhpConversion');
            returnValue = val * forexValue;
            console.log(forexValue);
            document.getElementById("conversion-amount").innerHTML = '₱ 1.00 = ₩ ' + Number(forexValue).toFixed(2);
        }

        else {
            forexValue = localStorage.getItem('usdPhpConversion');
            returnValue = val * forexValue;
            console.log(forexValue);
            document.getElementById("conversion-amount").innerHTML = '₱ 1.00 = $ ' + Number(forexValue).toFixed(2);
        }
    }
    console.log(returnValue);



    return returnValue
}

const calculation = async (e) => {
    e.preventDefault();
    const realAmount = document.getElementById('real-amount').value;
    const discountPercent = document.getElementById('discount-percent').value / 100;
    const taxPercent = document.getElementById('tax-percent').value / 100;

    var discountAmount = realAmount * discountPercent;
    var discountedAmount = realAmount - discountAmount;
    var taxAmount = discountedAmount * taxPercent;
    var taxedAmount = discountedAmount + taxAmount;
    var handlingAmount = taxedAmount * handlingPercent;
    var withHandlingAmount = taxedAmount + handlingAmount;
    var totalAmount = Number(await conversion(withHandlingAmount)).toFixed(2);

    document.getElementById("amount").innerHTML = '₱ ' + totalAmount;
    document.getElementById("submit").disabled = false;
}
