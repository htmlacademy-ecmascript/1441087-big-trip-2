import {render, replace, remove} from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

export default class EventPresenter {
  #eventListContainer = null;
  #allDestinations = null;
  #allOffersPacks = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;
  #currentDestination = null;
  #currentOffersPack = null;


  constructor({eventListContainer, allDestinations, allOffersPacks}) {
    this.#eventListContainer = eventListContainer;
    this.#allDestinations = allDestinations;
    this.#allOffersPacks = allOffersPacks;
  }

  init({event, currentDestination, currentOffersPack}) {
    this.#event = event;
    this.#currentDestination = currentDestination;
    this.#currentOffersPack = currentOffersPack;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      currentDestination: this.#currentDestination,
      currentOffersPack: this.#currentOffersPack,
      onToggleClick: this.#onToggleShowClick
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      currentDestination: this.#currentDestination,
      currentOffersPack: this.#currentOffersPack,
      allDestinations:  this.#allDestinations,
      allOffersPacks: this.#allOffersPacks,
      onToggleClick: this.#onToggleHideClick,
      onFormSubmit: this.#onFormSubmit
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#eventListContainer.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventListContainer.contains(prevEventEditComponent.element)) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #displayEventComponent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #displayEventEditComponent() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#displayEventComponent();
    }
  };

  #onToggleShowClick = () => {
    this.#displayEventEditComponent();
  };

  #onToggleHideClick = () => {
    this.#displayEventComponent();
  };

  #onFormSubmit = () => {
    this.#displayEventComponent();
  };
}
