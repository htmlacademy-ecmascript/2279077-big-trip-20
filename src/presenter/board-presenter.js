import { RenderPosition, render, remove } from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import { SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { sortByTime, sortByPrice, sortByDate } from '../utils/sort-util.js';
import { dataFilter } from '../utils/filter.js';
import NoPointView from '../view/no-point-view.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class BoardPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #filtersModel = null;
  #noPointsComponent = null;

  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;

  #newPointPresenter = null;
  #pointPresenter = new Map();

  #currentSortType = SortType.DAY;

  #filterType = FilterType.EVERYTHING;

  #isLoading = true;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor ({ pointListContainer, pointsModel, filtersModel, onNewPointDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onPointChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,

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

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  init() {
    this.#renderBoard();
  }

  createPoint(){
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init({destinations: this.destinations, offers: this.offers});

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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(this.destinations, this.offers, data);
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
    points.forEach((point) => this.#renderPoint(this.destinations, this.offers, point));
  }
}
