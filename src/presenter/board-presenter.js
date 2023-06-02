import { RenderPosition, render } from '../framework/render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import { updateItem } from '../utils.js';
import PointPresenter from './point-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import { SortType } from '../const.js';
import { sortByTime, sortByPrice } from '../sort-util.js';

export default class TripPresenter {
  #waypointListContainer = null;
  #pointsModel = null;

  #waypointListComponent = new WaypointListView();
  #sortComponent = null;

  #destinations = [];
  #offers = [];
  #listPoints = [];

  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];

  constructor ({ waypointListContainer, pointsModel }) {
    this.#waypointListContainer = waypointListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#destinations = this.#pointsModel.destinations;
    this.#offers = this.#pointsModel.offers;
    this.#listPoints = [...this.#pointsModel.points];

    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    render(this.#waypointListComponent, this.#waypointListContainer);

    for (let i = 0; i < this.#listPoints.length; i++) {
      this.#renderPoint(this.#destinations, this.#offers, this.#listPoints[i]);
    }

    this.#renderBoard();
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#listPoints = [...sortByTime(this.#listPoints)];
        break;
      case SortType.PRICE:
        this.#listPoints = [...sortByPrice(this.#listPoints)];
        break;
      default:
        this.#listPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    // - сортировка
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);

    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort() {
    this.#sortComponent = new ListSortView ({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#waypointListComponent.element, RenderPosition.AFTERBEGIN);

  }

  #handlePointChange = (updatedPoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(destinations, offers, point) {
    const pointPresenter = new PointPresenter({
      waypointListContainer: this.#waypointListComponent.element,
      onPointChange: this.#handlePointChange
    });
    pointPresenter.init(destinations,offers, point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderPointList() {
    render(this.#waypointListComponent, this.#waypointListComponent.element);
  }

  #renderBoard() {
    render(this.#waypointListComponent, this.#waypointListContainer);

    this.#renderSort();
    this.#renderPointList();
  }
}
