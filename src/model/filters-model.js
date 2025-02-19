import {FilterType} from '../const.js';
import Observable from '../framework/observable.js';


const DEFAULT_FILTER_TYPE = FilterType.EVERYTHING;
const TODAY = new Date();

const FilterMethod = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => event.dateFrom > TODAY),
  [FilterType.PRESENT]: (events) => events.filter((event) => event.dateFrom <= TODAY && event.dateTo >= TODAY),
  [FilterType.PAST]: (events) => events.filter((event) => event.dateTo < TODAY)
};

const NoEventMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};


export default class FiltersModel extends Observable {
  #filterType = DEFAULT_FILTER_TYPE;

  get filterType() {
    return this.#filterType;
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

  setFilter(updateType, filterType) {
    this.#filterType = filterType;
    this._notify(updateType, filterType);
  }

  getNoEventMessage(filterType) {
    return NoEventMessage[filterType];
  }
}
