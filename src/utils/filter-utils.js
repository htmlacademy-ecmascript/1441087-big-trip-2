import dayjs from 'dayjs';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const today = dayjs();

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom) > today),
  [FilterType.PRESENT]: (events) => events.filter((event) => dayjs(event.dateFrom) <= today && dayjs(event.dateTo) >= today),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs(event.dateTo) < today)
};

export {FilterType, filter};
