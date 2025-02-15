import AbstractView from '../framework/view/abstract-view.js';


function createTripInfoTemplate(tripTotalCost, tripTitle) {
  return (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>

        <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalCost}</span>
      </p>
    </section>
  `);
}

export default class TripInfoView extends AbstractView {
  #tripTotalCost = null;
  #tripTitle = null;

  constructor({tripTotalCost, tripTitle}) {
    super();
    this.#tripTotalCost = tripTotalCost;
    this.#tripTitle = tripTitle;
  }

  get template() {
    return createTripInfoTemplate(
      this.#tripTotalCost,
      this.#tripTitle,
    );
  }
}
