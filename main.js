var settings;

function loadSettings(callback) {
    var settingsFile = new XMLHttpRequest();
    settingsFile.overrideMimeType("application/json");
    settingsFile.open("GET", "./settings.json", true);
    settingsFile.onreadystatechange = function () {
        if (settingsFile.readyState === 4 && settingsFile.status == "200") {
            settings = JSON.parse(settingsFile.responseText);
            callback();
        }
    }
    settingsFile.send(null);
}

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

function updateClock() {
    var time = new Date();

    document.getElementsByClassName('clock')[0].innerHTML = time.getHours() + " " + time.getMinutes();
    if (time.getMinutes() < 10) {
        document.getElementsByClassName('clock')[0].innerHTML = time.getHours() + " 0" + time.getMinutes();
    }
}

function updateBackground() {
    var date = new Date();
    var daytime = getDaytime(date.getHours());
    var picture = getPicture(daytime, getNextTime(daytime));
    var path;

    if (picture < 10) {
        path = "'./assets/pictures/" + daytime + "_00000" + picture + ".jpeg'";
    } else if (picture < 100) {
        path = "'./assets/pictures/" + daytime + "_0000" + picture + ".jpeg'";
    } else if (picture < 1000) {
        path = "'./assets/pictures/" + daytime + "_000" + picture + ".jpeg'";
    }
    console.log(path);

    document.body.style.backgroundImage = "url(" + path + ")";
}

function getDaytime(hour) {
    console.log(hour);
    if (hour < settings.background.sunrise) {
        return 'night';
    }
    if (hour >= settings.background.sunrise && hour < settings.background.morning) {
        return 'sunrise';
    }
    if (hour >= settings.background.morning && hour < settings.background.afternoon) {
        return 'morning';
    }
    if (hour >= settings.background.afternoon && hour < settings.background.sunset) {
        return 'afternoon';
    }
    if (hour >= settings.background.sunset && hour < settings.background.evening) {
        return 'sunset';
    }
    if (hour >= settings.background.evening) {
        return 'evening';
    }
}

function getPicture(daytime, nextTime) {
    var partStartDate = new Date();
    partStartDate.setHours(settings.background[daytime], 0, 0, 0);
    var partLength = (settings.background[nextTime] - settings.background[daytime]);
    var partTimePassed = (Date.now() - partStartDate.getTime()) / 1000;
    var partPictures = settings.background.pictures[daytime];
    var partPercentPassed = (partTimePassed / 60 / 60) / partLength * 100;
    var pictureNumber = partPercentPassed / 100 * partPictures;

    return pictureNumber.toFixed(0);
}

function getNextTime(daytime) {
    switch (daytime) {
        case 'night':
            return 'sunrise';
        case 'sunrise':
            return 'morning';
        case 'morning':
            return 'afternoon';
        case 'afternoon':
            return 'sunset';
        case 'sunset':
            return 'evening';
        case 'evening':
            return 'night1';
    }
}

function startRefreshing() {
    updateClock();
    updateCryptoTicker();
    updateBackground();
    setInterval(function () {
        updateClock();
        updateCryptoTicker();
        updateBackground();
    }, 30000);
}

loadSettings(startRefreshing);

//localStorage["inputText"] = data;