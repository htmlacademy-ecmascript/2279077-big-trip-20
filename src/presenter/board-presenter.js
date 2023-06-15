import { RenderPosition, render, remove } from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import { SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { sortByTime, sortByPrice, sortByDate } from '../sort-util.js';
import { dataFilter } from '../filter.js';
import NoPointView from '../view/no-point-view.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';

export default class BoardPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #filtersModel = null;
  #noPointsComponent = null;

  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;

  #destinations = [];
  #offers = [];
  #newPointPresenter = null;
  #pointPresenter = new Map();

  #currentSortType = SortType.DAY;

  #filterType = FilterType.EVERYTHING;

  #isLoading = true;

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
        return filteredPoints.slice().sort(sortByDate);
      case SortType.TIME:
        return filteredPoints.slice().sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.slice().sort(sortByPrice);
      default:
        throw new Error(`Unknow sort type ${this.#currentSortType}`);
    }
  }


  init() {
    this.#destinations = this.#pointsModel.destinations;
    this.#offers = this.#pointsModel.offers;

    this.#renderBoard();
  }

  createPoint(){
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

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
        this.#pointPresenter.get(data.id).init(this.#destinations, this.#offers, data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderPoint(destinations, offers, point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(destinations, offers, point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
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
    remove(this.#loadingComponent);

    if (this.#noPointsComponent){
      remove(this.#noPointsComponent);
    }

    if (resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }


  #renderBoard() {
    render(this.#pointListComponent, this.#pointListContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const points = this.points;

    if (points.length === 0){
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    points.forEach((point) => this.#renderPoint(this.#destinations, this.#offers, point));
  }
}
