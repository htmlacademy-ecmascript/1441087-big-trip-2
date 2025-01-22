import {sortTypes} from '../const';
import {getCapitalizedString} from '../utils/common-utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortItemTemplate(sortItem) {
  const {name, isDisabled, isDefault} = sortItem;
  const checkedState = isDefault ? 'checked' : '';
  const disabledState = isDisabled ? 'disabled' : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${name}">
      <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${checkedState} ${disabledState}>
      <label class="trip-sort__btn" for="sort-${name}">${getCapitalizedString(name)}</label>
    </div>`
  );
}

function createSortTemplate() {
  const sortItems = sortTypes.slice().map((sortItem) => createSortItemTemplate(sortItem)).join('');
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems}
    </form>`
  );
}


export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }
}
