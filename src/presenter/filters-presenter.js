import { FilterType, UpdateType } from '../const.js';
import ListFiltersView from '../view/list-filters-view.js';
import { render, replace, remove } from '../framework/render.js';
import { dataFilter } from '../filter.js';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor({filtersContainer, filtersModel, pointsModel}){
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: dataFilter[type](points).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new ListFiltersView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType){
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
