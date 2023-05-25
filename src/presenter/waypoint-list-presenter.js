import { render, replace } from '../framework/render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import PointItemView from '../view/point-item-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class TripPresenter {
  #waypointListContainer = null;
  #pointsModel = null;

  #waypointListComponent = new WaypointListView();
  #pointEditComponent = null;

  #listPoints = [];
  #offers = [];
  #destinations = [];

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

  #renderPoint(point, offers, destinations) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointItemView({
      point,
      offers,
      destinations,
      onRollupButtonClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      point,
      offers,
      destinations,
      onEditFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#waypointListComponent.element);
  }
}
