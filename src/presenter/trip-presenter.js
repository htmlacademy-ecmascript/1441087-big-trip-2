import {render, replace} from '../framework/render.js';
import {getIdGenerator} from '../utils/common-utils.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import NoEventView from '../view/no-event-view.js';


const idGenerator = getIdGenerator();


export default class TripPresenter {
  #tripComponent = new TripView();
  #eventListComponent = new EventListView();
  #tripContainer = null;
  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;
  #events = [];

  constructor({tripContainer, destinationsModel, eventsModel, offersModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
  }

  init () {
    this.#events = [...this.#eventsModel.events];
    this.#renderTrip();
  }

  #renderEvent(event) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        displayEventComponent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventComponent = new EventView({
      viewId: idGenerator(),
      event: event,
      currentDestination: this.#destinationsModel.getDestinationById(event.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(event.type),
      onToggleClick: () => {
        displayEventEditComponent();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const eventEditComponent = new EventEditView({
      viewId: idGenerator(),
      event: event,
      currentDestination: this.#destinationsModel.getDestinationById(event.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(event.type),
      allDestinations: this.#destinationsModel.destinations,
      allOffersPacks: this.#offersModel.offersPacks,
      onToggleClick: () => {
        displayEventComponent();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormSubmit: () => {
        displayEventComponent();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    function displayEventComponent() {
      replace(eventComponent, eventEditComponent);
    }

    function displayEventEditComponent() {
      replace(eventEditComponent, eventComponent);
    }

    render(eventComponent, this.#eventListComponent.element);
  }

  #renderTrip() {
    render(this.#tripComponent, this.#tripContainer);

    if(this.#events.length === 0) {
      render(new NoEventView(), this.#tripComponent.element);
      return;
    }

    render(new SortView(), this.#tripComponent.element);
    render(this.#eventListComponent, this.#tripComponent.element);

    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }
}
