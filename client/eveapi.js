import 'whatwg-fetch';
import Promise from 'bluebird';
import { parseString } from 'xml2js';
import store from './store';
import { updateEveapi } from './actions/eveapiActions';

const parseXml = Promise.promisify(parseString);

async function pullAccountBalance(api) {

  let accBalanceUrl = `https://api.eveonline.com/char/AccountBalance.xml.aspx?characterID=${api.characterID}&keyID=${api.keyID}&vCode=${api.vCode}`;

  const res = await fetch(accBalanceUrl);
  const body = await res.text();
  const xml = await parseXml(body);

  let accountBalance = null;

  if (!xml.eveapi.error) {

    for (const acc of xml.eveapi.result[0].rowset[0].row) {

      if (acc.$.accountKey === "1000") {
        accountBalance = parseFloat(acc.$.balance);
      }
    }
  }

  return accountBalance;
}

async function pullWalletJournal(api) {

  let walletJournalUrl = `https://api.eveonline.com/char/WalletJournal.xml.aspx?characterID=${api.characterID}&keyID=${api.keyID}&vCode=${api.vCode}&rowCount=1500`;

  const res = await fetch(walletJournalUrl);
  const body = await res.text();
  const xml = await parseXml(body);

  console.log(xml);
}

async function pullWalletTransactions(api) {

  let walletTransactionUrl = `https://api.eveonline.com/char/WalletTransactions.xml.aspx?characterID=${api.characterID}&keyID=${api.keyID}&vCode=${api.vCode}`;

  const res = await fetch(walletTransactionUrl);
  const body = await res.text();
  const xml = await parseXml(body);

  console.log(xml);
}

async function pullMarketOrders(api) {

  let marketOrdersUrl = `https://api.eveonline.com/char/MarketOrders.xml.aspx?characterID=${api.characterID}&keyID=${api.keyID}&vCode=${api.vCode}`;

  const res = await fetch(marketOrdersUrl);
  const body = await res.text();
  const xml = await parseXml(body);

  console.log(xml);
}

export async function pullApiData(api) {

  const accountBalance = await pullAccountBalance(api);

  if (accountBalance) {
    store.dispatch(updateEveapi({ accountBalance }));
  }

  //pullWalletJournal(api);
  //pullWalletTransactions(api);
  pullMarketOrders(api);

}