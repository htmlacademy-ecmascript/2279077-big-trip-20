import AbstractView from '../framework/view/abstract-view.js';

function createPointItemTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class PointListView extends AbstractView{
  get template() {
    return createPointItemTemplate();
  }
}
