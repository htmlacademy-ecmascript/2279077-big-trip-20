import { render } from '../framework/render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import { updateItem } from '../utils.js';
import PointPresenter from '../presenter/point-presenter.js';

export default class TripPresenter {
  #waypointListContainer = null;
  #pointsModel = null;

  #waypointListComponent = new WaypointListView();

  #destinations = [];
  #offers = [];
  #listPoints = [];

  #pointPresenter = new Map();

  constructor ({ waypointListContainer, pointsModel }) {
    this.#waypointListContainer = waypointListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#destinations = this.#pointsModel.destinations;
    this.#offers = this.#pointsModel.offers;
    this.#listPoints = [...this.#pointsModel.points];

    render(this.#waypointListComponent, this.#waypointListContainer);

    for (let i = 0; i < this.#listPoints.length; i++) {
      this.#renderPoint(this.#destinations, this.#offers, this.#listPoints[i]);
    }
  }

  #handlePointChange = (updatedPoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);
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
}
