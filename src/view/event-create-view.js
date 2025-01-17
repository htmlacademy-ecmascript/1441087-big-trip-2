import { createElement } from '../render.js';
import { DateFormat, EVENT_TYPES } from '../const.js';
import { getDefaultEvent, getFormattedDate, getCapitalizedString, getHtmlId } from '../utils.js';


function createTypeTemplate(type) {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${getCapitalizedString(type)}</label>
    </div>`
  );
}

function createEventTypeListTemplate(eventTypes) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${eventTypes.map((type) => createTypeTemplate(type)).join('')}
      </fieldset>
    </div>`
  );
}

function createDestinationListTemplate(destinations) {
  return (
    `<datalist id="destination-list-1">
      ${destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('')}
    </datalist>`
  );
}

function createOfferTemplate(offer) {
  const offerId = getHtmlId(offer.title);

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerId}" type="checkbox" name="event-offer-${offerId}">
      <label class="event__offer-label" for="event-offer-${offerId}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
}

function createOfferListTemplate(offersPack = {}) {
  return offersPack.offers.length !== 0 ? (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersPack.offers.map((offer) => createOfferTemplate(offer)).join('')}
      </div>
    </section>`
  ) : '';
}

function createPicturesListTemplate(pictures = []) {
  return pictures.length !== 0 ? (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>`
  ) : '';
}

function createDestinationTemplate(destination) {
  if (destination && (destination.description !== '' || destination.pictures.length !== 0)) {
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        ${createPicturesListTemplate(destination.pictures)}
      </section>`);
  } else {
    return '';
  }
}

function createEventCreateTemplate(event, destinations, offersPacks) {
  const currentDestination = destinations.find((destination) => destination.id === event.destination);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${event.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${createEventTypeListTemplate(EVENT_TYPES)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${getCapitalizedString(event.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1">
          ${createDestinationListTemplate(destinations)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFormattedDate(event.dateFrom, DateFormat.DATE)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFormattedDate(event.dateTo, DateFormat.DATE)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${event.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        ${createOfferListTemplate(offersPacks.find((offersPack) => offersPack.type === event.type))}

        ${createDestinationTemplate(currentDestination)}
      </section>
    </form>`
  );
}

export default class EventCreateView {
  destinations = null;
  offersPacks = null;

  constructor({destinations, offersPacks}){
    this.destinations = destinations;
    this.offersPacks = offersPacks;
  }

  getTemplate() {
    return createEventCreateTemplate(
      getDefaultEvent(),
      this.destinations,
      this.offersPacks,
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
