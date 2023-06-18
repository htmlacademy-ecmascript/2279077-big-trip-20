import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { BLANK_POINT, POINTS_TYPES } from '../const.js';
import dayjs from 'dayjs';
import { getOffersByType } from '../utils/common.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Разметка точки назначения

const createEventPhotosTemplate = (picturesList) => {
  if (!picturesList.length) {
    return '';
  }

  return (/*html*/`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesList.map((picture) => `<img class="event__photo" src="${picture.src}" alt="Event photo.">`).join('')}
      </div>
    </div>`);
};

const createDestinationTemplate = (destinationItem) => {
  if (!destinationItem) {
    return '';
  }

  return (/*html*/`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationItem.description}</p>
      ${createEventPhotosTemplate(destinationItem.pictures)}
    </section>`);
};


// Разметка предложения

const createOffersMarkup = (typeOffers, offers, isDisabled) => typeOffers.map((offer) => {
  const checked = offers.includes(offer.id) ? 'checked' : '';

  return (/*html*/
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offer.id}"
        type="checkbox"
        value="${offer.id}"
        name="event-offer-${offer.id}"
        ${checked}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`);
}).join('');

const createOffersTemplate = (typeOffers, offers) => {
  if (!typeOffers.length) {
    return '';
  }

  return (/*html*/`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${createOffersMarkup(typeOffers, offers)}
      </div>
    </section>
  `);


};


// Разметка пункта назначения

const createDestinationListTemplate = (allDestination) => (/*html*/`
  <datalist id="destination-list-1">
    ${allDestination.map((destination) => `<option value="${he.encode(`${destination?.name || ''}`)}"></option>`).join('')}
  </datalist>`);


// Разметка типа события

const createTypesMarkup = (type) => POINTS_TYPES.map((typeEvent) => {
  const isChecked = typeEvent.toLowerCase() === type ? 'checked' : '';

  return (/*html*/`
      <div class="event__type-item">
        <input
          id="event-type-${typeEvent.toLowerCase()}-1"
          class="event__type-input  visually-hidden"
          type="radio"
          name="event-type"
          value="${typeEvent.toLowerCase()}" ${isChecked}
        >
        <label
          class="event__type-label event__type-label--${typeEvent.toLowerCase()}"
          for="event-type-${typeEvent.toLowerCase()}-1">${typeEvent}
        </label>
      </div>`);
}).join('');

// Изменение точки маршрута

const createPointEditTemplate = (allDestinations, allOffers, point, isNew) => {
  const { type, destination: destinationId, offers, basePrice, dateFrom, dateTo, isDisabled, isSaving, isDeleting } = point;
  const destinationItem = allDestinations.find((item) => item.id === destinationId);

  const timeFrom = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const timeTo = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const deleteButton = isDeleting ? 'Deleting...' : 'Delete';

  const typeOffers = getOffersByType(allOffers, type.toLowerCase());

  return (/*html*/
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypesMarkup(type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationItem?.name || ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${createDestinationListTemplate(allDestinations)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeFrom}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeTo}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(`${basePrice}`)}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isNew ? 'Cancel' : deleteButton}</button>
          ${isNew ? '' : '<button class="event__rollup-btn" type="button">'}
        </header>
        <section class="event__details">
          ${createOffersTemplate(typeOffers, offers)}

          ${createDestinationTemplate(destinationItem)}
        </section>
    </form>
  </li>`
  );
};

export default class PointEditView extends AbstractStatefulView {
  #destinations = {};
  #offers = {};

  #editFormSubmit = null;
  #editFormCancel = null;
  #editFormDelete = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  #isNew = false;

  constructor({ destinations, offers, point = BLANK_POINT, onEditFormSubmit, onEditFormCancel, onEditFormDelete, isNew = false }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this._setState(PointEditView.parsePointToState(point));

    this.#editFormSubmit = onEditFormSubmit;
    this.#editFormCancel = onEditFormCancel;
    this.#editFormDelete = onEditFormDelete;
    this.#isNew = isNew;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this.#destinations, this.#offers, this._state, this.#isNew);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom || this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerTo.destroy();
      this.#datepickerFrom = null;
      this.#datepickerTo = null;
    }
  }

  reset (point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);

    if (this.#isNew) {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#formCancelHandler);
    } else {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#formDeleteHandler);

      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#formCancelHandler);
    }

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);

    const offersElement = this.element.querySelector('.event__available-offers');

    if (offersElement) {
      offersElement.addEventListener('change', this.#offerSelectHandler);
    }

    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    if (evt.target.value === '') {
      return;
    }

    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    if (selectedDestination) {
      this.updateElement({
        destination: selectedDestination.id,
      });
    }
  };

  #offerSelectHandler = (evt) => {
    const selectedOffer = evt.target.value;

    const newOffers = evt.target.checked
      ? this._state.offers.concat(selectedOffer)
      : this._state.offers.filter((offer) => offer !== selectedOffer);

    this.updateElement({
      offers: newOffers,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#editFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#editFormDelete(PointEditView.parseStateToPoint(this._state));
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#editFormCancel();
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerFrom() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: 'today',
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        'time_24hr': true,
      },
    );
  }

  #setDatepickerTo() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        'time_24hr': true,
      },
    );
  }

  static parsePointToState = (point) =>
    ({ ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}

