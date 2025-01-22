import dayjs from 'dayjs';
import {FilterType} from '../const';

const filters = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom) > dayjs()),
  [FilterType.PRESENT]: (events) => events.filter((event) => dayjs(event.dateFrom) <= dayjs() && dayjs(event.dateTo) >= dayjs()),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs(event.dateTo) < dayjs())
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
