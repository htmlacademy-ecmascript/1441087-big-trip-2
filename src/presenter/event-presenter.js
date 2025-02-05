import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType, isEscapeKey} from '../utils/common-utils.js';
import {isDatesEqual} from '../utils/date-utils.js';
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
      toggleClickHandler: this.#onToggleShowClick,
      favoriteClickHandler: this.#onFavoriteClick
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      currentDestination: this.#currentDestination,
      currentOffersPack: this.#currentOffersPack,
      allDestinations:  this.#allDestinations,
      allOffersPacks: this.#allOffersPacks,
      toggleClickHandler: this.#onToggleHideClick,
      formSubmitHandler: this.#onFormSubmit,
      deleteClickHandler: this.#onDeleteCLick,
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
      this.#eventEditComponent.reset(this.#event, this.#currentDestination, this.#currentOffersPack);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt) &&
        document.activeElement.tagName !== 'INPUT') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event, this.#currentDestination, this.#currentOffersPack);
      this.#replaceFormToCard();
    }
  };

  #onToggleShowClick = () => {
    this.#replaceCardToForm();
  };

  #onToggleHideClick = () => {
    this.#eventEditComponent.reset(this.#event, this.#currentDestination, this.#currentOffersPack);
    this.#replaceFormToCard();
  };

  #onFavoriteClick = () => {
    this.#onEventUpdate(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite}
    );
  };

  #onFormSubmit = (event) => {
    const isMinorUpdate = !isDatesEqual(this.#event.dateFrom, event.dateFrom) ||
    !isDatesEqual(this.#event.dateTo, event.dateTo) ||
    (this.#event.basePrice !== event.basePrice);

    this.#onEventUpdate(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      event
    );
    this.#replaceFormToCard();
  };

  #onDeleteCLick = (event) => {
    this.#onEventUpdate(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event
    );
  };
}
