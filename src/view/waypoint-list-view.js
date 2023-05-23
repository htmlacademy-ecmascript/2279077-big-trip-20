import AbstractView from '../framework/view/abstract-view.js';

function createWaypointItemTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class WaypointListView extends AbstractView{
  get template() {
    return createWaypointItemTemplate();
  }
}
