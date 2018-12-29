function updateCryptoTicker() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var price = parseFloat(JSON.parse(xhttp.responseText).ticker.price).toFixed(2);
            var change = parseFloat(JSON.parse(xhttp.responseText).ticker.change).toFixed(2);

            if (change > 0) {
                document.getElementsByClassName('pricechange')[0].style.color = "#31B404";
            } else {
                document.getElementsByClassName('pricechange')[0].style.color = "#FA5858";
            }

            document.getElementsByClassName('price')[0].innerHTML = price + " €";
            document.getElementsByClassName('pricechange')[0].innerHTML = +change + " %";
        }
    };

    xhttp.open("GET", "https://api.cryptonator.com/api/ticker/btc-eur", true);
    xhttp.send();
}

function updateClock(){
    var time = new Date();
    document.getElementsByClassName('clock')[0].innerHTML = time.getHours() + " " + time.getMinutes();
}

updateCryptoTicker();
updateClock();
