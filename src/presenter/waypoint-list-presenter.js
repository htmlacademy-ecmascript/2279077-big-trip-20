import { render } from '../framework/render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import { updateItem } from '../utils.js';
import PointPresenter from '../presenter/point-presenter.js';

export default class TripPresenter {
  #waypointListContainer = null;
  #pointsModel = null;

  #waypointListComponent = new WaypointListView();

  #listPoints = [];
  #offers = [];
  #destinations = [];

  #pointPresenter = new Map();

  constructor ({ waypointListContainer, pointsModel }) {
    this.#waypointListContainer = waypointListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;
    render(this.#waypointListComponent, this.#waypointListContainer);

    for (let i = 0; i < this.#listPoints.length; i++) {
      this.#renderPoint(this.#listPoints[i], this.#offers, this.#destinations);
    }
  }

  #handlePointChange = (updatedPoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      waypointListContainer: this.#waypointListComponent.element,
      onPointChange: this.#handlePointChange
    });
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }
}
