const APILink = 'https://www.freeforexapi.com/api/live?pairs=USDPHP';
const handlingPercent = 0.15;

const conversion = async (val) => {
    document.getElementById("submit").disabled = true;
    let apiResponse = await fetch('https://cors-anywhere.herokuapp.com/' + APILink).then((response) => 
        response.json())
        .catch((err) => {
        console.log('Something went wrong :( ' + err)
    });

    let returnValue = await val * apiResponse.rates.USDPHP.rate;
    console.log(apiResponse.rates.USDPHP.rate);
    console.log(returnValue);
    document.getElementById("conversion-amount").innerHTML = 'Php 1.00 = $ ' + Number(apiResponse.rates.USDPHP.rate).toFixed(2);

    return returnValue
}

const calculation = async () => {
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
    var conversionAmount

    document.getElementById("amount").innerHTML = 'Php ' + totalAmount;
    document.getElementById("submit").disabled = false;
}
