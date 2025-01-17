import { createElement } from '../render.js';

function createEventItemTemplate() {
  return '<li class="trip-events__item"></li>';
}

export default class EventItemView {
  getTemplate() {
    return createEventItemTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
