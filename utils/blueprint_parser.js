yaml = require('js-yaml');
fs   = require('fs');

itemid2name = {};
blueprints = {};
blueprintIDs = [];

try {
  items = yaml.safeLoad(fs.readFileSync('typeIDs.yaml'));
  bps = yaml.safeLoad(fs.readFileSync('blueprints.yaml'));

  for (var iid in items) {
    itemid2name[iid] = items[iid].name.en;
  }

  for (var bpid in bps) {

    bp = bps[bpid];

    blueprintIDs.push(bpid);

    //console.log(bp);

    activities = bp.activities;

    manufacturing = activities.manufacturing;

    if (!manufacturing) {
      continue;
    }

    materials = manufacturing.materials;
    products = manufacturing.products;
    //invention = manufacturing.invention;

    //console.log(materials);

    productID = products[0].typeID;
    quantity = products[0].quantity;

    blueprints[productID] = {
      materials,
      quantity,
      name: itemid2name[products[0].typeID]
    };

    //console.log(blueprints);
  }

  fs.writeFileSync('blueprints.json', JSON.stringify(blueprints));

  fs.writeFileSync('blueprint_ids.json', JSON.stringify(blueprintIDs));

} catch (e) {
  console.log(e);
}