import { render } from '../render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import WaypointItemView from '../view/waypoint-item-view';
import EditionWaypointFormView from '../view/edition-waypoint-form-view.js';

export default class WaypointListPresenter {
  waypointListComponent = new WaypointListView();

  constructor ({waypointListContainer}) {
    this.waypointListContainer = waypointListContainer;
  }

  init() {
    render(this.waypointListComponent, this.waypointListContainer);
    render(new EditionWaypointFormView(), this.waypointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new WaypointItemView(), this.waypointListComponent.getElement());
    }
  }
}
