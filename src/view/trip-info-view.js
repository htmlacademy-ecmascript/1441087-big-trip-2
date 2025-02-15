import AbstractView from '../framework/view/abstract-view.js';

function getEventTotalCost(event, offersPack) {
  const checkedOffers = offersPack.offers.filter((offer) => event.offers.includes(offer.id));
  const offersTotalCost = checkedOffers.map((offer) => offer.price).reduce((sum, price) => (sum += price), 0);
  const eventTotalCost = event.basePrice + offersTotalCost;

  return eventTotalCost;
}

function getTripTotalCost(events, offersPacks) {
  let tripTotalCost = 0;

  events.forEach((event) => {
    const offersPack = offersPacks.find((pack) => pack.type === event.type);
    tripTotalCost += getEventTotalCost(event, offersPack);
  });

  return tripTotalCost;
}

function createTripInfoTemplate(destinations, events, offersPacks) {
  const tripTotalCost = getTripTotalCost(events, offersPacks);

  return (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

        <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalCost}</span>
      </p>
    </section>
  `);
}

export default class TripInfoView extends AbstractView {
  #destinations = [];
  #events = [];
  #offersPacks = [];

  constructor({destinations, events, offersPacks}) {
    super();
    this.#destinations = destinations;
    this.#events = events;
    this.#offersPacks = offersPacks;
  }

  get template() {
    return createTripInfoTemplate(
      this.#destinations,
      this.#events,
      this.#offersPacks,
    );
  }
}
