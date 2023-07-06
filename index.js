const APILink = 'https://www.freeforexapi.com/api/live?pairs=USDPHP';
const handlingPercent = 0.15;

const conversion = (val) => {
    fetch(APILink).then((response) => {
        console.log(response)
    }).catch((err) => {
        console.log('Something went wrong :( ' + err)
    });
}

const calculation = () => {
    const realAmount = document.getElementById('real-amount').value;
    const discountPercent = document.getElementById('discount-percent').value / 100;
    const taxPercent = document.getElementById('tax-percent').value / 100;

    var discountAmount = realAmount * discountPercent;
    var discountedAmount = realAmount - discountAmount;
    var taxAmount = discountedAmount * taxPercent;
    var taxedAmount = discountedAmount - taxAmount;
    var handlingAmount = taxedAmount * handlingPercent;
    var withHandlingAmount = taxedAmount - handlingAmount;

    conversion(withHandlingAmount);
}