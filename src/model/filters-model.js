import Observable from '../framework/observable.js';
import {FilterType} from '../utils/filter-utils.js';

export default class FiltersModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  get defaultFilterType() {
    return FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
