import {getCapitalizedString} from '../utils/common-utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortItemTemplate(sortItem, currentSortType) {
  const {name, isAvailable} = sortItem;
  const isChecked = name === currentSortType ? 'checked' : '';
  const isDisabled = isAvailable ? '' : 'disabled';

  return (
    `<div class="trip-sort__item  trip-sort__item--${name}">
      <input
        id="sort-${name}"
        data-sort-type="${name}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${name}"
        ${isChecked}
        ${isDisabled}>
      <label class="trip-sort__btn" for="sort-${name}">${getCapitalizedString(name)}</label>
    </div>`
  );
}

function createSortTemplate(sortSettings, currentSortType) {
  const sortItems = sortSettings.slice().map((sortItem) => createSortItemTemplate(sortItem, currentSortType)).join('');
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems}
    </form>`
  );
}


export default class SortView extends AbstractView {
  #sortSettings = null;
  #currentSortType = null;
  #onSortTypeChangeClick = null;

  constructor({sortSettings, currentSortType, onSortTypeChangeClick}) {
    super();
    this.#sortSettings = sortSettings;
    this.#currentSortType = currentSortType;
    this.#onSortTypeChangeClick = onSortTypeChangeClick;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortSettings, this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#onSortTypeChangeClick(evt.target.dataset.sortType);
  };
}
