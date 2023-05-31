import AbstractView from '../framework/view/abstract-view.js';

function createTripFiltersTemplate(type, count, isSelected) {
  return (/*html*/
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${isSelected ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}>
      <label
        class="trip-filters__filter-label"
        for="filter-${type}">
        ${type}</label>
    </div>`
  );
}

const createFilterFormTemplate = (filters) => (/*html*/`
  <form class="trip-filters" action="#" method="get">
      ${Object.entries(filters).map(([type, count], index) =>
    createTripFiltersTemplate(type, count, index === 0)).join('')}
    </form>`
);

export default class ListFiltersView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterFormTemplate(this.#filters);
  }
}
