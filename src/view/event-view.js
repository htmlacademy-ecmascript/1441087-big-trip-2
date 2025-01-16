import {createElement} from '../render.js';
import {DateFormat} from '../const.js';
import {
  getFormattedDate,
  getDateDifference,
  getCapitalizedWord,
} from '../utils.js';


function createOfferTemplate(offer) {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  );
}


function createOffersCheckedListTemplate(offersChecked) {
  return offersChecked.length !== 0 ? (
    `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersChecked.map((offer) => createOfferTemplate(offer)).join('')}
      </ul>`
  ) : '';
}


function createEventTemplate(event, destination, offersChecked) {
  const dayHuman = getFormattedDate(event.dateFrom, DateFormat.DAY_HUMAN);
  const dayMachine = getFormattedDate(event.dateFrom, DateFormat.DAY_MACHINE);
  const timeFromHuman = getFormattedDate(event.dateFrom, DateFormat.TIME_HUMAN);
  const timeFromMachine = getFormattedDate(event.dateFrom, DateFormat.TIME_MACHINE);
  const timeToHuman = getFormattedDate(event.dateTo, DateFormat.TIME_HUMAN);
  const timeToMachine = getFormattedDate(event.dateTo, DateFormat.TIME_MACHINE);
  const duration = getDateDifference(event.dateTo, event.dateFrom);


  return (
    `<div class="event">
      <time class="event__date" datetime="${dayMachine}">${dayHuman}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${getCapitalizedWord(event.type)} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${timeFromMachine}">${timeFromHuman}</time>
          &mdash;
          <time class="event__end-time" datetime="${timeToMachine}">${timeToHuman}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${event.basePrice}</span>
      </p>

      ${createOffersCheckedListTemplate(offersChecked)}

      <button class="event__favorite-btn event__favorite-btn--active" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
}


export default class EventView {
  constructor({event, destination, offersPack, offersChecked}) {
    this.event = event;
    this.destination = destination;
    this.offersPack = offersPack;
    this.offersChecked = offersChecked;
  }

  getTemplate() {
    return createEventTemplate(
      this.event,
      this.destination,
      this.offersChecked
    );
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
