import dayjs from 'dayjs';

const filters = {
  'everything': (events) => events.filter((event) => event),
  'future': (events) => events.filter((event) => dayjs(event.dateFrom) > dayjs()),
  'present': (events) => events.filter((event) => dayjs(event.dateFrom) <= dayjs() && dayjs(event.dateTo) >= dayjs()),
  'past': (events) => events.filter((event) => dayjs(event.dateTo) < dayjs())
};

function generateFilters(events) {
  return Object.entries(filters).map(
    ([filterType, filterEvents]) => ({
      type: filterType,
      count: filterEvents(events).length,
    }),
  );
}

export {generateFilters};
