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
  DATE: 'DD/MM/YY HH:mm',
  FLATPICKR: 'd/m/y H:i'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const flatpickrConfig = {
  enableTime: true,
  'time_24hr': true,
  locale: {firstDayOfWeek: 1},
  dateFormat: DateFormat.FLATPICKR
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  EVENT_TYPES,
  DateFormat,
  FilterType,
  flatpickrConfig,
  UserAction,
  UpdateType
};
