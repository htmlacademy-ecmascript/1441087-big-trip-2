const DateFormat = {
  DAY_HUMAN: 'MMM DD',
  DAY_MACHINE: 'YYYY-MM-DD',
  TIME_HUMAN: 'HH:mm',
  TIME_MACHINE: 'YYYY-MM-DDTHH:mm',
};

const getDefaultEvent = () => ({
  id: '',
  basePrice: 0,
  dateFrom: new Date().toString(),
  dateTo: new Date().toString(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi'
});

export {
  DateFormat,
  getDefaultEvent,
};
