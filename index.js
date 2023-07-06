const APILink = 'https://www.freeforexapi.com/api/live?pairs=USDPHP';
const handlingPercent = 0.15;

window.onload = function () {
    var form = document.querySelector("form");
    form.onsubmit = calculation.bind(form);
}

const conversion = async (val) => {
    let returnValue;
    document.getElementById("submit").disabled = true;
    let apiResponse = await fetch('https://cors-anywhere.herokuapp.com/' + APILink).then((response) =>
        response.json())
        .catch((err) => {
            console.log('Something went wrong :( ' + err)
        });

    if (apiResponse) {
        localStorage.setItem('usdPhpConversion', apiResponse.rates?.USDPHP?.rate)
        returnValue = await val * apiResponse.rates?.USDPHP?.rate;
        console.log(apiResponse.rates.USDPHP.rate);
        document.getElementById("conversion-amount").innerHTML = 'Php 1.00 = $ ' + Number(apiResponse.rates.USDPHP.rate).toFixed(2);
    }

    else {
        let forexValue = localStorage.getItem('usdPhpConversion');
        returnValue = val * forexValue;
        console.log(forexValue);
        document.getElementById("conversion-amount").innerHTML = 'Php 1.00 = $ ' + Number(forexValue).toFixed(2);
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

    document.getElementById("amount").innerHTML = 'Php ' + totalAmount;
    document.getElementById("submit").disabled = false;
}
