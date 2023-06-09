import { render, RenderPosition } from './framework/render.js';
import PointInfoView from './view/trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/point-model.js';
import FiltersModel from './model/filter-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';

const siteHeaderElement = document.querySelector('.page-header');
const filtersContainer = siteHeaderElement.querySelector('.trip-controls__filters');
const tripInfoContainer = siteHeaderElement.querySelector('.trip-main');

const siteMainElement = document.querySelector('.page-main');
const tripEventsContainer = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();

const boardPresenter = new BoardPresenter({
  pointListContainer: tripEventsContainer,
  pointsModel,
  filtersModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filtersPresenter = new FiltersPresenter ({
  filtersContainer,
  filtersModel,
  pointsModel,
});


const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose(){
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick(){
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, tripInfoContainer);
render(new PointInfoView(), tripInfoContainer, RenderPosition.AFTERBEGIN);

filtersPresenter.init();
boardPresenter.init();
