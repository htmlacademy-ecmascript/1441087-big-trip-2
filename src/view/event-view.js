import {createElement} from '../render.js';
import {DateFormat} from '../const.js';
import {
  getFormattedDate,
  getDateDifference,
  getCapitalizedString,
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


function createoffersCheckedListTemplate(event, offersPack) {
  const checkedOffers = offersPack.offers.filter((offer) => event.offers.includes(offer.id));
  return checkedOffers.length !== 0 ? (
    `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${checkedOffers.map((offer) => createOfferTemplate(offer)).join('')}
      </ul>`
  ) : '';
}


function createEventTemplate(viewId, event, currentDestination, currentOffersPack) {
  const dayFormatted = getFormattedDate(event.dateFrom, DateFormat.DAY);
  const timeFromFormatted = getFormattedDate(event.dateFrom, DateFormat.TIME);
  const timeToFormatted = getFormattedDate(event.dateTo, DateFormat.TIME);
  const duration = getDateDifference(event.dateTo, event.dateFrom);
  const isFavorite = event.isFavorite ? 'event__favorite-btn--active' : '';


  return (
    `<div id = "${viewId}" class="event">
      <time class="event__date" datetime="${event.dateFrom}">${dayFormatted}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${getCapitalizedString(event.type)} ${currentDestination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${event.dateFrom}">${timeFromFormatted}</time>
          &mdash;
          <time class="event__end-time" datetime="${event.dateTo}">${timeToFormatted}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${event.basePrice}</span>
      </p>
      ${createoffersCheckedListTemplate(event, currentOffersPack)}
      <button class="event__favorite-btn ${isFavorite}" type="button">
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
  viewId = null;
  event = null;
  currentDestination = null;
  currentOffersPack = null;

  constructor({viewId, event, currentDestination, currentOffersPack}) {
    this.viewId = viewId;
    this.event = event;
    this.currentDestination = currentDestination;
    this.currentOffersPack = currentOffersPack;
  }

  getTemplate() {
    return createEventTemplate(
      this.viewId,
      this.event,
      this.currentDestination,
      this.currentOffersPack,
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
