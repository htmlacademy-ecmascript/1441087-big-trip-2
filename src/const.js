const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const DateFormat = {
  DAY: 'MMM DD',
  TIME: 'HH:mm',
  DATE: 'DD/MM/YY HH:mm'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const sortTypes = [
  {
    name: 'day',
    isDisabled: false,
    isDefault: true
  },
  {
    name: 'event',
    isDisabled: true,
    isDefault: false
  },
  {
    name: 'time',
    isDisabled: false,
    isDefault: false
  },
  {
    name: 'price',
    isDisabled: false,
    isDefault: false
  },
  {
    name: 'offers',
    isDisabled: true,
    isDefault: false
  }
];


export {
  EVENT_TYPES,
  DateFormat,
  FilterType,
  sortTypes
};
