import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType, isEscapeKey} from '../utils/common-utils.js';
import EventCreateView from '../view/event-create-view.js';


export default class NewEventPresenter {
  #eventListContainer = null;

  #eventCreateComponent = null;

  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;

  #onEventUpdate = null;
  #onDestroy = null;

  constructor({eventListContainer, destinationsModel, eventsModel, offersModel, onEventUpdate, onDestroy}) {
    this.#eventListContainer = eventListContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#onEventUpdate = onEventUpdate;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#eventCreateComponent !== null) {
      return;
    }

    const defaultEvent = this.#eventsModel.defaultEvent;

    this.#eventCreateComponent = new EventCreateView({
      event: defaultEvent,
      currentDestination: this.#destinationsModel.getDestinationById(defaultEvent.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(defaultEvent.type),
      allDestinations: this.#destinationsModel.destinations,
      allOffersPacks: this.#offersModel.offersPacks,
      onFormSubmit: this.#onFormSubmit,
      onCancelClick: this.#onCancelClick
    });

    render(this.#eventCreateComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventCreateComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#eventCreateComponent);
    this.#eventCreateComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #onFormSubmit = (event) => {
    this.#onEventUpdate(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {...event, id: crypto.randomUUID()},
    );
    this.destroy();
  };

  #onCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if(isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
