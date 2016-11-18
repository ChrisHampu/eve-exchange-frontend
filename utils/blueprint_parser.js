yaml = require('js-yaml');
fs   = require('fs');

itemid2name = {};
blueprints = {};
blueprintIDs = [];
blueprintIDsInt = [];
blueprint2baseprice = {};

try {
  items = yaml.safeLoad(fs.readFileSync('typeIDs.yaml'));
  bps = yaml.safeLoad(fs.readFileSync('blueprints.yaml'));

  for (var iid in items) {
    itemid2name[iid] = items[iid].name.en;
  }

  for (var bpid in bps) {

    bp = bps[bpid];

    blueprintIDs.push(bpid);
    

    if (items[bpid]) {
      if (items[bpid].basePrice > 0) {
        blueprint2baseprice[bpid] = items[bpid].basePrice
      }
    }
    //console.log(bp);

    activities = bp.activities;

    manufacturing = activities.manufacturing;

    if (!manufacturing) {
      continue;
    }

    materials = manufacturing.materials;
    products = manufacturing.products;

    if (!products) {
      continue;
    }
    //invention = manufacturing.invention;

    //console.log(materials);

    productID = products[0].typeID;
    quantity = products[0].quantity;

    blueprintIDsInt.push(parseInt(productID));

    blueprints[productID] = {
      materials,
      quantity,
      name: itemid2name[products[0].typeID]
    };
  }

  fs.writeFileSync('blueprints.json', JSON.stringify(blueprints));

  fs.writeFileSync('blueprint_ids.json', JSON.stringify(blueprintIDs));

  fs.writeFileSync('blueprint_manufacturable_ids.json', JSON.stringify(blueprintIDsInt));

  fs.writeFileSync('blueprint_basePrice.json', JSON.stringify(blueprint2baseprice));

} catch (e) {
  console.log(e);
}