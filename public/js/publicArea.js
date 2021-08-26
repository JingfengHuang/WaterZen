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
    630000: "Qinhai",
    640000: "Ningxia",
    650000: "Xinjiang"
};

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

        for (let entries of Object.entries(this)) {
            console.log(`${entries[0]}, ${entries[1]}`);
            if (entries[0] === "cityId") {
                continue;
            }
            let newSpan = document.createElement('span');
            newSection.append(newSpan);
            newSection.classList.add('entries');
            newSpan.innerHTML = `${titleCase(entries[0])}: ${entries[1]}`;
            newSpan.classList.add(`${entries[0]}`);
            newSpan.classList.add(`data`);
        }

    }
}


$(document).ready(function () {

    for (let key in cityId) {
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/http://106.37.208.243:8068/GJZ/Ajax/Publish.ashx",
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
                console.log(dataRecords.length);
                for (let i = 0; i < dataRecords.length; i++) {
                    entries = dataRecords[i];
                    let waterData = new WaterData(key, entries[0], entries[1], entries[2], entries[3], entries[4], entries[5], entries[6], entries[7], entries[8], entries[9], entries[10], entries[11], entries[12], entries[13], entries[16])
                    console.log(waterData);
                    waterData.generateHTML()
                }
            },
            error: function (data) {
                console.log(data.msg);
            }
        });
    }
});