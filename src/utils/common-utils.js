function getCapitalizedString(string) {
  return string[0].toUpperCase() + string.slice(1);
}


function getHtmlSafeString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}


function getIdGenerator () {
  let currentValue = 0;

  return function () {
    currentValue += 1;
    return currentValue;
  };
}


export {
  getCapitalizedString,
  getHtmlSafeString,
  getIdGenerator
};
