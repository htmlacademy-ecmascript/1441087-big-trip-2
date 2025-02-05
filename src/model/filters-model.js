import dayjs from 'dayjs';
import Observable from '../framework/observable.js';

const TODAY = dayjs();

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const DEFAULT_FILTER_TYPE = FilterType.EVERYTHING;

const FilterMethod = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom) > TODAY),
  [FilterType.PRESENT]: (events) => events.filter((event) => dayjs(event.dateFrom) <= TODAY && dayjs(event.dateTo) >= TODAY),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs(event.dateTo) < TODAY)
};

const noEventMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

export default class FiltersModel extends Observable {
  #filter = DEFAULT_FILTER_TYPE;

  get filter() {
    return this.#filter;
  }

  get defaultFilterType() {
    return DEFAULT_FILTER_TYPE;
  }

  get filterTypes() {
    return FilterType;
  }

  get filterMethods() {
    return FilterMethod;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }

  getnoEventMessage(filterType) {
    return noEventMessage[filterType];
  }
}
