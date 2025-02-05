import {render, remove, replace} from '../framework/render.js';
import {UpdateType} from '../utils/common-utils.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filtersModel = null;
  #eventsModel = null;

  #filterComponent = null;

  constructor({filterContainer, filtersModel, eventsModel}) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const events = this.#eventsModel.events;

    return Object.values(this.#filtersModel.filterTypes).map((type) => ({
      type,
      count: this.#filtersModel.filterMethods[type](events).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilter: this.#filtersModel.filter,
      filterClickHandler: this.#onFilterClick
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #onFilterClick = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
