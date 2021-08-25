class WaterData {
    constructor(state, riverName, location, time, latitude, longitude, tempture, ph, conductivity, oxygen, salt) {
        this.state = state
        this.name = riverName;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.time = time;
        this.tempute = tempture;
        this.ph = ph;
        this.conductivity = conductivity;
        this.oxygen = oxygen;
        this.salt = salt;
        console.log(`riverName=${riverName}, location=${location}, latitude=${latitude}, longitude=${longitude}, time=${time}, tempture=${tempture}, ph=${ph}, conductivity=${conductivity}, oxygen=${oxygen}, salt=${salt}`);
    }

    generateHTML() {
        let stateClass = '.' + this.state
        let stateSelector = document.querySelector(stateClass);

        // add section for this record
        let newSection = document.createElement('section');
        stateSelector.append(newSection);

        for (let entries of Object.entries(this)) {
            console.log(`${entries[0]}, ${entries[1]}`);
            let newSpan = document.createElement('span');
            newSection.append(newSpan);
            newSection.classList.add('sites');
            newSpan.innerHTML = `${entries[0].toLocaleUpperCase()}: ${entries[1]}`;
            newSpan.classList.add('entries');
        }

    }
}



// Data in QLD
let stateQLD = "QLD";
let URLQLD = "https://www.data.qld.gov.au/api/3/action/datastore_search_sql";
// Data in NSW
let stateNSW = "NSW";
let URLNSW = "https://data.nsw.gov.au/data/api/3/action/datastore_search_sql";

let dataProcessArray = [{
    "state":stateQLD,
    "URL":URLQLD,
    "riverName": "Gregory River",
    "resourse": "d78a9af9-da56-4e4a-b2d0-f7dd9f37757c",
    "location": "tidal zone at approximately 5.2km from the mouth of the Gregory River",
    "latitude": -20.1688,
    "longitude": 148.464,
    "time": "Timestamp",
    "tempture": "TempC",
    "ph": "pH",
    "conductivity": "SpCondmScm",
    "oxygen": "DOmgL",
    "salt": "DOPerSat",
}, {
    "state":stateQLD,
    "URL":URLQLD,
    "riverName": "Burnett River",
    "resourse": "07192e1f-13b4-4542-98f2-5b4eec6b96ac",
    "location": "Old Bundaberg Co-op Wharf",
    "latitude": -24.86491,
    "longitude": 152.34390,
    "time": "TIMESTAMP",
    "tempture": "Temp_degC",
    "ph": "pH",
    "conductivity": "EC_uScm",
    "oxygen": "DO_mg",
    "salt": "DO_Sat",
}, {
    "state":stateQLD,
    "URL":URLQLD,
    "riverName": "Baffle Creek",
    "resourse": "77ca1d7a-2b2a-40b4-95f2-45373f8795b3",
    "location": "tidal zone at the Ferry Crossing approximately 16km from the mouth of Baffle Creek, between Gladstone and Bundaberg",
    "latitude": -24.50861,
    "longitude": 151.9279,
    "time": "TIMESTAMP",
    "tempture": "EXO-TempC",
    "ph": "EXO-pH",
    "conductivity": "EXO-SpCondmScm",
    "oxygen": "EXO-DOmgL",
    "salt": "EXO-DOPerSat",
}, ]





$(document).ready(function () {

    for (let dataProcess of dataProcessArray) {
        let data = {
            sql: `SELECT * from "${dataProcess.resourse}" ORDER BY _id DESC LIMIT 1`,
        }

        $.ajax({
            url: dataProcess.URL,
            data: data,
            dataType: "jsonp",
            cache: true,
            success: function (data) {
                dataRecord = data.result.records[0];
                let waterDate = new WaterData(dataProcess.state, dataProcess.riverName, dataProcess.location, dataRecord[dataProcess.time],
                    dataProcess.latitude, dataProcess.longitude, dataRecord[dataProcess.tempture], dataRecord[dataProcess.ph],
                    dataRecord[dataProcess.conductivity], dataRecord[dataProcess.oxygen], dataRecord[dataProcess.salt]);
                waterDate.generateHTML();
            }
        });
    }


});