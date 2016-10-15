import 'whatwg-fetch';
import xml2js from 'xml-json-parser';

// Formats a raw number with appropriate comma and decimal placement
export function formatNumber(number) {

  var _number = Math.round(number*Math.pow(10,2))/Math.pow(10,2);
  var parts = _number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function formatNumberUnit(num) {

  let suffix = "";

  if (num <= -1000000000000 || num >= 1000000000000) {
    num /= 1000000000000;
    suffix = "T";
  } else if (num <= -1000000000 || num >= 1000000000) {
    num /= 1000000000;
    suffix = "B";
  } else if (num <= -1000000 || num >= 1000000) {
    num /= 1000000;
    suffix = "M";
  } else if (num <= -1000 || num >= 1000) {
    num /= 1000;
    suffix = "K";
  }

  num = num.toFixed(3);

  return num.toString().replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') + suffix;
}

export function formatPercent(num) {

  return Math.round((num || 0) * Math.pow(10,2)) / Math.pow(10,2);
}

export function formatDate(date) {

  let _date = date;

  if (typeof date === "string") {
    _date = new Date(date);
  }

  let minutes = _date.getUTCMinutes() < 10 ? `0${_date.getUTCMinutes()}` : _date.getUTCMinutes();
  let hours = _date.getUTCHours() < 10 ? `0${_date.getUTCHours()}` : _date.getUTCHours();   

  return `${_date.getUTCDate()} ${getMonthNumberToText(_date.getUTCMonth())} ${hours}:${minutes}`;
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

export function prettyDate(time) {
    var date = time;

    if (typeof date === "string") {
      date = new Date(date);
    }

    var diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0)
        return;

    const week_diff = Math.ceil(day_diff / 7);
    const month_diff = Math.ceil(day_diff / 30);

    return day_diff == 0 && (
        diff < 60 && "just now" ||
        diff < 120 && "a minute ago" ||
        diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
        diff < 7200 && "about an hour ago" ||
        diff < 86400 && `about ${Math.floor(diff / 3600)} hours ago`) ||
        day_diff == 1 && "a day ago" ||
        day_diff < 7 && day_diff + " days ago" ||
        day_diff < 31 && `${week_diff===1?"a":week_diff} week${week_diff===1?"":"s"} ago` ||
        `${month_diff===1?"a":month_diff} month${month_diff===1?"":"s"} ago`;
}

export async function getAPIKeyInfo(keyID, vCode) {

  
  let destUrl = `https://api.eveonline.com/account/APIKeyInfo.xml.aspx?keyID=${keyID}&vCode=${vCode}`;

  const response = await fetch(destUrl);
  const body = await response.text();
  const xml = new xml2js().xml_str2json(body);

  if (xml.eveapi.error) {
    return {
      error: "Not a valid API key"
    }
  }

  console.log(xml);

  const info = xml.eveapi.result.key;
  const characters = [];

  /*
  if (info.accessMask !== "23072779") {
    return {
      error: "Access mask must be 23072779"
    }
  }
  */

  if (info._type !== "Account" && info._type !== "Character") {
    return {
      error: "Must be account or character key"
    }
  }

  console.log(xml.eveapi.result.key.rowset.row);
  
  for (const char of xml.eveapi.result.key.rowset.row) {
    
    characters.push({characterID: char._characterID, characterName: char._characterName});
  }
  console.log(characters);

  return { info: { type: info._type, expires: info._expires, accessMask: info._accessMask }, characters };
}