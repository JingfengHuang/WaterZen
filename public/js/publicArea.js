function iterateRecords(data) {

    const queenslandRecord = document.querySelector('.qld');

    // get data valule
    let record = data.result.records[0];
    const {Timestamp, TempC, pH, SpCondmScm, DOmgL} = record;
    let value = `Last update time: ${Timestamp} | Tempture: ${TempC} | PH: ${pH} | Specific Conductivity: ${SpCondmScm} | Dissolved oxygen: ${DOmgL}`;


    // add section for this record
    let newSection = document.createElement('section');
    queenslandRecord.append(newSection);

    // add title
    let newLocation = document.createElement('h2');
    newLocation.innerHTML = "Gregory River";
    newSection.append(newLocation);

    // add data
    let newPara = document.createElement('p');
    newPara.innerHTML = value;
    newSection.append(newPara);
}




$(document).ready(function () {

    let data = {
        sql: 'SELECT * from "d78a9af9-da56-4e4a-b2d0-f7dd9f37757c" ORDER BY _id DESC LIMIT 1',
    }

    $.ajax({
        url: "https://www.data.qld.gov.au/api/3/action/datastore_search_sql",
        data: data,
        dataType: "jsonp",
        cache: true,
        success: function (data) {
            iterateRecords(data);
        }
    });

});