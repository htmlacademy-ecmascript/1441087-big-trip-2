import {render} from '../framework/render.js';
import {getIdGenerator} from '../utils.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';


const idGenerator = getIdGenerator();


export default class TripPresenter {
  #tripComponent = null;
  #eventListComponent = null;
  #tripContainer = null;
  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;
  #tripEvents = [];

  constructor({tripContainer, destinationsModel, eventsModel, offersModel}) {
    this.#tripComponent = new TripView();
    this.#eventListComponent = new EventListView();
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
  }

  init () {
    this.#tripEvents = [...this.#eventsModel.getAllEvents()];

    render(this.#tripComponent, this.#tripContainer);
    render(new SortView(), this.#tripComponent.element);
    render(this.#eventListComponent, this.#tripComponent.element);

    for (let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderEvent(this.#tripEvents[i]);
    }
  }

  #renderEvent(event) {
    const eventComponent = new EventView({
      viewId: idGenerator(),
      event,
      currentDestination: this.#destinationsModel.getDestinationById(event.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(event.type),
    });

    render(eventComponent, this.#eventListComponent.element);
  }
}
