yaml = require('js-yaml');
fs   = require('fs');
fetch = require('node-fetch');
xml2js = require('xml2js');

var parser = new xml2js.Parser();

stations = {};


data = yaml.safeLoad(fs.readFileSync('staStations.yaml'));

for(var i in data) {

  stations[data[i].stationID] = data[i].stationName;
}

fetch('https://api.eveonline.com/eve/ConquerableStationList.xml.aspx')
.then(function(data) { return data.text() })
.then(function(data) { 
  parser.parseString(data, function(err, res) {

    for (var i in res.eveapi.result[0].rowset[0].row) {
      
      var row = res.eveapi.result[0].rowset[0].row[i];

      stations[parseInt(row.$.stationID)] = row.$.stationName;
    }

    var string = "{";

    Object.keys(stations).forEach(function(key) {

      string += key.toString() + ':"' + stations[key] + '",';
    });

    string = string.slice(0, string.length-1)
    string += "}";

    fs.writeFileSync('station_id_to_name.json', string);
  })
})