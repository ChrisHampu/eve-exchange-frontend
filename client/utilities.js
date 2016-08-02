import Promise from 'bluebird';
import 'whatwg-fetch';
import { parseString } from 'xml2js';

const parseXml = Promise.promisify(parseString);

// Formats a raw number with appropriate comma and decimal placement
export function formatNumber(number) {
    var _number = Math.round(number*Math.pow(10,2))/Math.pow(10,2);
    var parts = _number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export function formatDate(date) {

  let minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes();
  let hours = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();   

  return `${date.getUTCDate()} ${getMonthNumberToText(date.getUTCMonth())} ${hours}:${minutes}`;
}

export function getMonthNumberToText(month) {

  switch (month) {
    case 0:
      return "January";
    case 1:
      return "Februray";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
  }
}

export async function getAPIKeyInfo(keyID, vCode) {

  let destUrl = `https://api.eveonline.com/account/APIKeyInfo.xml.aspx?keyID=${keyID}&vCode=${vCode}`;

  const response = await fetch(destUrl);
  const body = await response.text();
  const xml = await parseXml(body);

  if (xml.eveapi.error) {
    return {
      error: "Not a valid API key"
    }
  }

  const info = xml.eveapi.result[0].key[0].$;
  const characters = [];

  /*
  if (info.accessMask !== "23072779") {
    return {
      error: "Access mask must be 23072779"
    }
  }
  */

  if (info.type !== "Account" && info.type !== "Character") {
    return {
      error: "Must be account or character key"
    }
  }

  for (const char of xml.eveapi.result[0].key[0].rowset[0].row) {
    
    characters.push(char.$);
  }

  return { info, characters };
}