function titleCase(str) {
    newStr = str.slice(0, 1).toUpperCase() + str.slice(1);
    return newStr;
}


let cityId = {
    110000: "Beijing",
    120000: "Tianjin",
    130000: "Heibei",
    140000: "Shanxi",
    150000: "Nei_Monggol",
    210000: "Liaoning",
    220000: "Jilin",
    230000: "Heilongjiang",
    310000: "Shanghai",
    320000: "Jiangsu",
    330000: "Zhejiang",
    340000: "Anhui",
    350000: "Fujian",
    360000: "jiangxi",
    370000: "Shandong",
    410000: "Henan",
    420000: "Hubei",
    430000: "Hunan",
    440000: "Guangdong",
    450000: "Guangxi",
    460000: "Hainan",
    500000: "Chongqing",
    510000: "Sichuan",
    520000: "Guizhou",
    530000: "Yunnan",
    540000: "Tibet",
    610000: "Shaanxi",
    620000: "Gansu",
    630000: "Qinghai",
    640000: "Ningxia",
    650000: "Xinjiang"
};

let cityName = {}

function getcityName() {
    for (let k in cityId) {
        cityName[cityId[k]] = parseInt(k);
    }
}



class WaterData {
    constructor(cityId, city, riverBasin, monitoringPoint, time, level, tempture, pH, oxygen, conductivity, turbidity,
        permanganate, ammonia, phosphorus, nitrogen, situation) {
        this.cityId = cityId;
        this.city = city;
        this.riverBasin = riverBasin;
        this.monitoringPoint = monitoringPoint;
        this.time = time;
        this.level = level;
        this.tempute = tempture;
        this.ph = pH;
        this.oxygen = oxygen;
        this.conductivity = conductivity;
        this.turbidity = turbidity;
        this.permanganate = permanganate;
        this.ammonia = ammonia;
        this.phosphorus = phosphorus;
        this.nitrogen = nitrogen;
        this.situation = situation;
    }

    generateHTML() {
        let cityClass = '.' + cityId[this.cityId]
        let stateSelector = document.querySelector(cityClass);
        stateSelector.classList.add('city')

        // add section for this record
        let newSection = document.createElement('section');
        stateSelector.append(newSection);
        newSection.classList.add('entries');

        let firstEntries = document.createElement('div');
        newSection.append(firstEntries);
        firstEntries.classList.add('firstEntries');

        let secondEntries = document.createElement('div');
        newSection.append(secondEntries);
        secondEntries.classList.add('secondEntries');

        let addEntries = firstEntries;

        for (let entries of Object.entries(this)) {
            // console.log(`${entries[0]}, ${entries[1]}`);
            if (entries[0] === "cityId") {
                continue;
            } else {
                let newSpan = document.createElement('span');
                addEntries.append(newSpan);
                newSpan.innerHTML = `${titleCase(entries[0])}: ${entries[1]}`;
                newSpan.classList.add(`${entries[0]}`);
                if (entries[0] === "level") {
                    addEntries = secondEntries;
                    switch (entries[1]) {
                        case "Ⅰ":
                            newSpan.classList.add(`level1`);
                            break;
                        case "Ⅱ":
                            newSpan.classList.add(`level2`);
                            break;
                        case "Ⅲ":
                            newSpan.classList.add(`level3`);
                            break;
                        case "Ⅳ":
                            newSpan.classList.add(`level4`);
                            break;
                        case "劣Ⅴ":
                        case "Ⅴ":
                            newSpan.classList.add(`level5`);
                            break;
                        default:
                            newSpan.classList.add(`levelInvalid`);

                    }
                }

                newSpan.classList.add(`data`);
            }
        }
    }
}

function sendRequest(key) {

    $.ajax({
        url: "https://liss-cors-anywhere.herokuapp.com/http://106.37.208.243:8068/GJZ/Ajax/Publish.ashx",
        data: {
            "AreaID": key,
            "RiverID": null,
            "MNName": null,
            "PageIndex": 1,
            "PageSize": 200,
            "action": "getRealDatas"
        },

        success: function (data) {
            let dataRecords = eval("(" + data + ")").tbody;
            if (dataRecords !== undefined) {

                // for (var i = 0; i < notAccessKey.length; i++) {
                //     if (notAccessKey[i] === 9) {
                //         notAccessKey.splice(i, 1);
                //     }
                // }

                for (let i = 0; i < dataRecords.length; i++) {
                    entries = dataRecords[i];
                    let waterData = new WaterData(key, entries[0], entries[1], entries[2], entries[3], entries[4], entries[5], entries[6], entries[7], entries[8], entries[9], entries[10], entries[11], entries[12], entries[13], entries[16])
                    // console.log(waterData);
                    waterData.generateHTML()
                }
            } else {
                setTimeout(() => {
                    // console.log(key);
                    sendRequest(key);
                }, 5000);
            }

        },
        error: function (data) {
            console.log(data.msg);
        }
    });
}

function getSearchCity() {
    // console.log(window.location);
    if (window.location.search.length === 0) {
        return 0;
    }
    let search = window.location.search.slice(6);
    for (let city in cityName) {
        if (search === city) {
            return cityName[city];
        }
    }
    return -1;
}

function createCitySelectionHtml() {
    let sectioin = document.querySelector('#selectionCity');
    for (let key in cityName) {
        if (key.length !== 0) {
            let p = document.createElement('p');
            sectioin.append(p);
            p.innerHTML = key;
        }
    }
    $("#selectionCity p").hide();
}

let select = false;
function selectCity() {
    $('#citySelection').on({
        keyup: function() {
            select = false;
            let text = document.querySelector('#citySelection').value.toUpperCase();
            $("#selectionCity p").hide();
            $("#selectionCity p").each(function(){
                if (this.innerHTML.toUpperCase().includes(text)) {
                    $(this).show();
                }
            });
        },
        blur: function() {
            if (select === false) {
            $("#selectionCity p").hide();
            }
        }
    });

    $("#selectionCity p").on({
        click: function() {
            select = true;
            let text = this.innerHTML;
            document.querySelector('#citySelection').value = text;
            $("#selectionCity p").hide();
            $("#citySelection").focus();
        },
        mouseover: function() {
            select = true;
        },
        mouseout: function() {
            select = false;
        }
    });
}

$(document).ready(function () {

    getcityName();
    createCitySelectionHtml();
    selectCity();

    let cityid = getSearchCity();
    console.log(cityid);

    if (cityid === -1) {
        document.querySelector('h2').innerHTML = "Nothing found, please try another city.";
    } else if (cityid === 0) {
        document.querySelector('h2').innerHTML = "Default display: Beijing.";
        sendRequest(cityName["Beijing"]);
    } else if (cityid !== -1) {
        document.querySelector('h2').innerHTML = `City: ${cityId[cityid]}`;
        sendRequest(cityid);
    }

});