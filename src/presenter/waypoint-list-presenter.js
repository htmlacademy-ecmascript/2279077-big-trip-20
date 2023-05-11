import { render } from '../render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import PointItemView from '../view/waypoint-view.js';
import PointEditFormView from '../view/edit-waypoint-view.js';
import { getRandomArrayElement } from '../utils.js';

export default class TripPresenter {
  waypointListComponent = new WaypointListView();

  constructor ({ waypointListContainer, pointsModel }) {
    this.waypointListContainer = waypointListContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.listPoints = [...this.pointsModel.getPoints()];
    render(this.waypointListComponent, this.waypointListContainer);
    render(new PointEditFormView(getRandomArrayElement(this.listPoints)), this.waypointListComponent.getElement());

    for (let i = 0; i < this.listPoints.length; i++) {
      render(new PointItemView({ point: this.listPoints[i] }), this.waypointListComponent.getElement());
    }
  }
}
