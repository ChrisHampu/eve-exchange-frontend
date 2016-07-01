import requests
import json
import time
import concurrent.futures
import rethinkdb as r

conn = r.connect(db='market')

start = time.perf_counter()

rr = requests.get("https://crest-tq.eveonline.com/market/10000002/orders/all/")

js = rr.json()
global total
total = 0
##items = []

print("Inserting page 1")

pages = js['pageCount']
total += len(js['items'])

print(r.table("orders").insert(js['items'], durability="soft", return_changes=False, conflict="replace").run(conn))

print("1 is done")

def loadPage(number):
	global total
	print('loading page %s' % number)
	req = requests.get("https://crest-tq.eveonline.com/market/10000002/orders/all/?page=%s" % number)
	j = req.json()
	print("page %s has %s items " % (number, len(j['items'])))
	total += len(j['items'])
	print('inserting page %s' % number)
	print(r.table("orders").insert(j['items'], durability="soft", return_changes=False, conflict="replace").run(conn))
	print('%s is done' % number)
	return total

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:

	future_to_url = {executor.submit(loadPage, i): i for i in range(2,pages+1)}

	for future in concurrent.futures.as_completed(future_to_url):

		url = future_to_url[future]

		print("inserted")

		#print(data)

print(time.perf_counter() - start)
print(total)

##start = time.perf_counter()

##print(time.perf_counter() - start)

#{"buy": false, "issued": "2016-06-02T16:30:22", "price": 19999998.99, "volume": 1, "duration": 14, "id": 4558325263, "minVolume": 1, "volumeEntered": 1, "range": "region", "stationID": 60003760, "type": 13873}

'''

r.db('market')
  .table('orders2')
  .sample(1000)
  .group("name")
  .map(function(doc) {
    return { total: doc("price"), price: doc("price"), count: 1, max: doc("price"), min: doc("price") } 
  })
  .reduce(function(left, right) { return {
    'max': r.branch(r.gt(left('max'), right('max')), left('max'), right('max')), 
    'min': r.branch(r.gt(left('min'), right('min')), right('min'), left('min')), 
    	'total': left('total').add(right('total')),
      'count': left('count').add(right('count'))
  }})
  .ungroup()
   .map(function(group) {
     return { 'name': group("group"), 'max': group("reduction")("max"), min: group("reduction")("min"), 'avg': group("reduction")("total").div(group("reduction")("count")) }
  });

'''