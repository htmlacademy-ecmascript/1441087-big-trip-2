import AbstractView from '../framework/view/abstract-view.js';

function createEventItemTemplate() {
  return '<li class="trip-events__item"></li>';
}

export default class EventItemView extends AbstractView {
  get template() {
    return createEventItemTemplate();
  }
}
