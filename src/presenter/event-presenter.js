import {render, replace, remove} from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing'
};

export default class EventPresenter {
  #eventListContainer = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;
  #allDestinations = null;
  #allOffersPacks = null;
  #currentDestination = null;
  #currentOffersPack = null;

  #onEventUpdate = null;
  #onModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({eventListContainer, allDestinations, allOffersPacks, onEventUpdate, onModeChange}) {
    this.#eventListContainer = eventListContainer;
    this.#allDestinations = allDestinations;
    this.#allOffersPacks = allOffersPacks;
    this.#onEventUpdate = onEventUpdate;
    this.#onModeChange = onModeChange;
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
      onToggleClick: this.#onToggleShowClick,
      onFavoriteClick: this.#onFavoriteClick
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      currentDestination: this.#currentDestination,
      currentOffersPack: this.#currentOffersPack,
      allDestinations:  this.#allDestinations,
      allOffersPacks: this.#allOffersPacks,
      onToggleClick: this.#onToggleHideClick,
      onFormSubmit: this.#onFormSubmit,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#displayEventComponent();
    }
  }

  #displayEventComponent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #displayEventEditComponent() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
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

  #onFavoriteClick = () => {
    this.#onEventUpdate({...this.#event, isFavorite: !this.#event.isFavorite});
  };

  #onFormSubmit = (event) => {
    this.#onEventUpdate(event);
    this.#displayEventComponent();
  };
}
