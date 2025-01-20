import { createElement } from '../render.js';
import { DateFormat, EVENT_TYPES } from '../const.js';
import { getFormattedDate, getCapitalizedString, getHtmlId } from '../utils.js';


function createTypeTemplate(type, viewId) {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-${viewId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${viewId}">${getCapitalizedString(type)}</label>
    </div>`
  );
}

function createEventTypeListTemplate(eventTypes, viewId) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${eventTypes.map((type) => createTypeTemplate(type, viewId)).join('')}
      </fieldset>
    </div>`
  );
}

function createDestinationListTemplate(destinations, viewId) {
  return (
    `<datalist id="destination-list-${viewId}">
      ${destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('')}
    </datalist>`
  );
}

function createOfferTemplate(offer, event, viewId) {
  const offerId = getHtmlId(offer.title);
  const offerChecked = event.offers.includes(offer.id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerId}-${viewId}" type="checkbox" name="event-offer-${offerId}" ${offerChecked}>
      <label class="event__offer-label" for="event-offer-${offerId}-${viewId}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
}

function createOfferListTemplate(event, offersPack = {}, viewId) {
  return offersPack.offers.length !== 0 ? (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersPack.offers.map((offer) => createOfferTemplate(offer, event, viewId)).join('')}
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

function createEventEditTemplate(
  viewId,
  event,
  currentDestination,
  currentOffersPack,
  allDestinations) {
  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${viewId}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${event.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${viewId}" type="checkbox">
          ${createEventTypeListTemplate(EVENT_TYPES)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${viewId}">
            ${getCapitalizedString(event.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${viewId}" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-${viewId}">
          ${createDestinationListTemplate(allDestinations, viewId)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${viewId}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${viewId}" type="text" name="event-start-time" value="${getFormattedDate(event.dateFrom, DateFormat.DATE)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${viewId}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${viewId}" type="text" name="event-end-time" value="${getFormattedDate(event.dateTo, DateFormat.DATE)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${viewId}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${viewId}" type="text" name="event-price" value="${event.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createOfferListTemplate(event, currentOffersPack, viewId)}

        ${createDestinationTemplate(currentDestination)}
      </section>
    </form>`
  );
}

export default class EventEditView {
  viewId = null;
  event = null;
  currentDestination = null;
  currentOffersPack = null;
  allDestinations = null;
  allOffersPacks = null;

  constructor({
    viewId,
    event,
    currentDestination,
    currentOffersPack,
    allDestinations,
    allOffersPacks}){
    this.viewId = viewId;
    this.event = event;
    this.currentDestination = currentDestination;
    this.currentOffersPack = currentOffersPack;
    this.allDestinations = allDestinations;
    this.allOffersPacks = allOffersPacks;
  }

  getTemplate() {
    return createEventEditTemplate(
      this.viewId,
      this.event,
      this.currentDestination,
      this.currentOffersPack,
      this.allDestinations,
      this.allOffersPacks,
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
