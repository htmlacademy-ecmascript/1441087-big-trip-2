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
    isAvailable: true,
    isDefault: true
  },
  {
    name: 'event',
    isAvailable: false,
    isDefault: false
  },
  {
    name: 'time',
    isAvailable: true,
    isDefault: false
  },
  {
    name: 'price',
    isAvailable: true,
    isDefault: false
  },
  {
    name: 'offers',
    isAvailable: false,
    isDefault: false
  }
];


export {
  EVENT_TYPES,
  DateFormat,
  FilterType,
  sortTypes
};
