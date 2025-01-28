import {DateFormat, EVENT_TYPES} from '../const.js';
import {getCapitalizedString, getHtmlSafeString} from '../utils/common-utils.js';
import {getFormattedDate} from '../utils/date-utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';


function createTypeTemplate(_state, type, id) {
  const isChecked = _state.type === type ? 'checked' : '';

  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${getCapitalizedString(type)}</label>
    </div>`
  );
}

function createEventTypeListTemplate(_state, eventTypes, id) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${eventTypes.map((type) => createTypeTemplate(_state, type, id)).join('')}
      </fieldset>
    </div>`
  );
}

function createDestinationListTemplate(destinations, id) {
  return (
    `<datalist id="destination-list-${id}">
      ${destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('')}
    </datalist>`
  );
}

function createOfferTemplate(offer, _state, id) {
  const {title, price} = offer;
  const offerHtmlTitle = getHtmlSafeString(title);
  const isChecked = _state.offers.includes(offer.id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerHtmlTitle}-${id}" type="checkbox" name="event-offer-${offerHtmlTitle}" ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offerHtmlTitle}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function createOfferListTemplate(_state, offersPack = {}, id) {
  return offersPack.offers.length !== 0 ? (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersPack.offers.map((offer) => createOfferTemplate(offer, _state, id)).join('')}
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
  const {description, pictures} = destination;

  if (destination && (description !== '' || pictures.length !== 0)) {
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${createPicturesListTemplate(pictures)}
      </section>`);
  } else {
    return '';
  }
}

function createEventEditTemplate(_state, currentDestination, currentOffersPack, allDestinations) {
  const {id, type, dateFrom, dateTo, basePrice} = _state;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
            ${createEventTypeListTemplate(_state, EVENT_TYPES, id)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${getCapitalizedString(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-${id}">
            ${createDestinationListTemplate(allDestinations, id)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${getFormattedDate(dateFrom, DateFormat.DATE)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${getFormattedDate(dateTo, DateFormat.DATE)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOfferListTemplate(_state, currentOffersPack, id)}

          ${createDestinationTemplate(currentDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class EventEditView extends AbstractStatefulView {
  #currentDestination = null;
  #currentOffersPack = null;
  #allDestinations = null;
  #allOffersPacks = null;
  #onToggleClick = null;
  #onFormSubmit = null;

  constructor({
    event,
    currentDestination,
    currentOffersPack,
    allDestinations,
    allOffersPacks,
    onToggleClick,
    onFormSubmit}){
    super();
    this._setState(this._parseEventToState(event));
    this.#currentDestination = currentDestination;
    this.#currentOffersPack = currentOffersPack;
    this.#allDestinations = allDestinations;
    this.#allOffersPacks = allOffersPacks;
    this.#onToggleClick = onToggleClick;
    this.#onFormSubmit = onFormSubmit;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onToggleClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmitHandler);
  }

  get template() {
    return createEventEditTemplate(
      this._state,
      this.#currentDestination,
      this.#currentOffersPack,
      this.#allDestinations,
      this.#allOffersPacks,
    );
  }

  #onToggleClickHandler = (evt) => {
    evt.preventDefault();
    this.#onToggleClick();
  };

  #onFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(this._parseStateToEvent(this._state));
  };
}
