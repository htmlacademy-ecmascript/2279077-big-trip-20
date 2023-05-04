import { render } from '../render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import PointItemView from '../view/waypoint-item-view';
import PointEditFormView from '../view/edition-waypoint-form-view.js';

export default class TripPresenter {
  waypointListComponent = new WaypointListView();

  constructor ({waypointListContainer}) {
    this.waypointListContainer = waypointListContainer;
  }

  init() {
    render(this.waypointListComponent, this.waypointListContainer);
    render(new PointEditFormView(), this.waypointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointItemView(), this.waypointListComponent.getElement());
    }
  }
}
