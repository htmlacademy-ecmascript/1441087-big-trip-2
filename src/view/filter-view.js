import {getCapitalizedString} from '../utils/common-utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilter) {
  const {type, count} = filter;
  const isDisabled = count === 0 ? 'disabled' : '';
  const isChecked = type === currentFilter ? 'checked' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isDisabled} ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${type}">${getCapitalizedString(type)}</label>
    </div>`
  );
}

function createFilterTemplate(filters, currentFilter) {
  const filterItemTemplates = filters.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemTemplates}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #filterClickHandler = null;

  constructor({filters, currentFilter, filterClickHandler}){
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#filterClickHandler = filterClickHandler;

    this.element.addEventListener('click', this.#onFilterClick);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #onFilterClick = (evt) => {
    const targetInput = evt.target.closest('input');

    if(targetInput) {
      evt.preventDefault();
      this.#filterClickHandler(evt.target.value);
    }
  };
}
