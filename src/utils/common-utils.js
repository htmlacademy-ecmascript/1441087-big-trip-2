function getCapitalizedString(data) {
  return data[0].toUpperCase() + data.slice(1);
}

function getHtmlSafeString(data) {
  return data.replace(/\s+/g, '-').toLowerCase();
}

function isEscapeKey (evt) {
  return evt.key === 'Escape';
}


export {
  getCapitalizedString,
  getHtmlSafeString,
  isEscapeKey
};
