import {render, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripMainContainer = null;

  #tripInfoComponent = null;

  constructor({tripMainContainer}) {
    this.#tripMainContainer = tripMainContainer;
  }

  init() {
    this.#tripInfoComponent = new TripInfoView();
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
  }
}
