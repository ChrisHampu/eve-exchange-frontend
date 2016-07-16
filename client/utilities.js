
// Formats a raw number with appropriate comma and decimal placement
export function formatNumber(number) {
    var _number = Math.round(number*Math.pow(10,2))/Math.pow(10,2);
    var parts = _number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}