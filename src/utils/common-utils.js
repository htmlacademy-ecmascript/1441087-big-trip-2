function getCapitalizedString(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function getHtmlSafeString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}

function isEscapeKey (evt) {
  return evt.key === 'Escape';
}


export {
  getCapitalizedString,
  getHtmlSafeString,
  isEscapeKey
};
