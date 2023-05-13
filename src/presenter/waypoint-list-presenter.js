import { render } from '../render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import PointItemView from '../view/waypoint-view.js';
// import PointEditFormView from '../view/edit-waypoint-view.js';

export default class TripPresenter {
  waypointListComponent = new WaypointListView();

  constructor ({ waypointListContainer, pointsModel }) {
    this.waypointListContainer = waypointListContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.listPoints = [...this.pointsModel.getPoints()];
    this.offers = this.pointsModel.getOffers();
    this.destinations = this.pointsModel.getDestinations();
    render(this.waypointListComponent, this.waypointListContainer);
    // render(new PointEditFormView({point: this.listPoints[0]}, offers: this.offers, destinations: this.destinations), this.waypointListComponent.getElement());

    for (let i = 0; i < this.listPoints.length; i++) {
      render(new PointItemView({point: this.listPoints[i], offers: this.offers, destinations: this.destinations}), this.waypointListComponent.getElement());
    }
  }
}
