import { RenderPosition, render, remove } from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import { SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { sortByTime, sortByPrice, sortByDate } from '../sort-util.js';
import { dataFilter } from '../filter.js';
import NoPointView from '../view/no-point-view.js';
import NewPointPresenter from './new-point-presenter.js';

export default class BoardPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #filtersModel = null;
  #noPointsComponent = null;

  #pointListComponent = new PointListView();
  #sortComponent = null;

  #destinations = [];
  #offers = [];
  #listPoints = [];
  #newPointPresenter = null;
  #pointPresenter = new Map();

  #currentSortType = SortType.DAY;

  #filterType = FilterType.EVERYTHING;

  constructor ({ pointListContainer, pointsModel, filtersModel, onNewPointDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onPointChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = dataFilter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDate);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  init() {
    this.#destinations = this.#pointsModel.destinations;
    this.#offers = this.#pointsModel.offers;
    this.#listPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  createPoint(){
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new ListSortView ({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #renderPoint(destinations, offers, point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onPointChange: this.#handleViewAction
    });
    pointPresenter.init(destinations, offers, point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointView ({
      filterType: this.#filterType
    });

    render(this.#noPointsComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    if(this.#noPointsComponent){
      remove(this.#noPointsComponent);
    }

    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    render(this.#pointListComponent, this.#pointListContainer);

    const points = this.points;
    const pointsCount = points.length;
    if (pointsCount === 0){
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#listPoints.forEach((point) => this.#renderPoint(this.#destinations, this.#offers, point));
  }
}
