yaml = require('js-yaml');
fs   = require('fs');
 
fetch = require('node-fetch');

xml2js = require('xml2js');

var exclude_blueprints = true;

var parser = new xml2js.Parser();

var groups = [];

var items = null;

var id2name = {};

function findItems(obj) {

  if (obj.childGroups.length > 0) {

    for (var child of obj.childGroups) {
      findItems(child);
    }
  } else {

    obj.items = [];

    for (var i in items) {

      if (items[i].published === undefined) {
        continue;
      }

      if (items[i].published === false) {
        continue;
      }

      if (items[i].marketGroupID === obj.id) {

        obj.items.push({id: i, name: items[i].name.en});

        id2name[i] = items[i].name.en;
      }
    }
  }
}

function findChildren(doc, children, id) {

  for (var i = 0; i < doc.length; i++) {

    if (doc[i].parentGroupID === id) {

      var _children = [];

      findChildren(doc, _children, doc[i].marketGroupID);

      children.push({name: doc[i].marketGroupName, id: doc[i].marketGroupID, childGroups: _children});
    }
  }
}

try {
  items = yaml.safeLoad(fs.readFileSync('typeIDs.yaml'));

  var _yaml = yaml.safeLoad(fs.readFileSync('invMarketGroups.yaml'));
  var doc = new Array(_yaml.slice())[0];

  var ids = [];
  var ids_str = [];

  for(var i in _yaml) {

    if (!_yaml[i].parentGroupID)  {

      var children = [];

      console.log("Finding children for root id " + _yaml[i].marketGroupID);

      findChildren(doc, children, _yaml[i].marketGroupID);

      for (var child of children) {
        findItems(child);
      }

      // Skip infantry gear & special edition & trade goods
      if (_yaml[i].marketGroupID === 350001 || _yaml[i].marketGroupID === 63 || _yaml[i].marketGroupID === 1659 || _yaml[i].marketGroupID === 2) {
        continue;
      }

      if (exclude_blueprints && _yaml[i].marketGroupID === 2 ) {
        continue;
      }

      groups.push({name: _yaml[i].marketGroupName, id: _yaml[i].marketGroupID, childGroups: children});

    }
  }

  for (var i in items) {
    ids.push(parseInt(i));
    ids_str.push(i);
  }

  fs.writeFileSync('market_groups.json', JSON.stringify(groups));
  fs.writeFileSync('market_ids.json', JSON.stringify(ids));
  fs.writeFileSync('market_id_to_name.json', JSON.stringify(id2name));
  fs.writeFileSync('market_ids_str.json', JSON.stringify(ids_str));

} catch (e) {
  console.log(e);
}