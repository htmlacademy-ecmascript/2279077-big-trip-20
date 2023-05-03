import { createElement } from '../render.js';

function createWaypointItemTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class WaypointListView {
  getTemplate() {
    return createWaypointItemTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
