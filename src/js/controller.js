import resultsView from './views/resultsView';
import * as model from './model';
import searchView from './views/searchView';
import gameView from './views/gameView';
import bookmarksView from './views/bookmarksView';
import previewView from './views/previewView';
import filterView from './views/filterView';

let resultsLimit;
let maxPrice;
let sortBy;
const controlFilterApply = async function (formData) {
  resultsLimit = formData.resultsLimit;
  maxPrice = formData.maxPrice;
  sortBy = formData.sort;
  console.log(resultsLimit, maxPrice, sortBy);

  if (model.state.search.results.length === 0) return;

  console.log(model.state.search.results);
  const sortedResults = model.filterData(
    model.state.search.results,
    resultsLimit,
    maxPrice,
    sortBy
  );
  console.log(sortedResults);

  resultsView.clear();

  if (sortedResults.length === 0) {
    resultsView.renderError();
    return;
  }

  sortedResults.forEach(result => resultsView.render(result));
};

const controlFilterReset = function () {
  resultsLimit = '';
  maxPrice = '';
  sortBy = '';
};

const controlSearchResults = async function () {
  resultsView.renderSpinner();

  const query = searchView.getQuery();

  await model.fetchPreviewData(query, resultsLimit, maxPrice, sortBy);

  if (model.state.search.results.length === 0) {
    resultsView.renderError();
    return;
  }

  resultsView.clear();
  model.state.search.results.map(gameData => {
    resultsView.render(gameData);
  });
};

const controlRender = async function () {
  const hash = window.location.hash.slice(1);

  if (!hash) {
    gameView.renderError();
    return;
  }

  gameView.renderSpinner();

  await model.fetchGameData(hash);

  gameView.clear();
  gameView.render(model.state.game);
  renderSliderCircles();
};

const renderSliderCircles = function () {
  const imgCircles = Array.from(
    document.querySelector('.img__legend').children
  );

  imgCircles.forEach(
    circle => (circle.innerHTML = '<i class="far fa-circle img__circle"></i>')
  );

  const imgItems = Array.from(
    document.querySelector('.game__images--list').children
  );

  const curImg = document.querySelector(`li[data-position="0"]`);

  const imgIndex = imgItems.indexOf(curImg);

  imgCircles[imgIndex].innerHTML = '<i class="fas fa-circle img__circle"></i>';
};

const controlSlider = function (e) {
  const button = e.target.closest('.change__img');

  if (!button) return;

  const imgItems = Array.from(
    button.parentElement.querySelector('.game__images--list').children
  );

  if (button.classList.contains('prev__img')) {
    imgItems.forEach(img => {
      img.dataset.position = +img.dataset.position + 1;
    });

    const curImg = imgItems.find(img => img.dataset.position === '0');

    if (!curImg) {
      imgItems.forEach(
        img => (img.dataset.position = +img.dataset.position - 1)
      );
      return;
    }

    imgItems.forEach(img => {
      img.style.transform = `translateX(${100 * +img.dataset.position}%)`;
    });
  }
  if (button.classList.contains('next__img')) {
    imgItems.forEach(img => {
      img.dataset.position = +img.dataset.position - 1;
    });

    const curImg = imgItems.find(img => img.dataset.position === '0');

    if (!curImg) {
      imgItems.forEach(
        img => (img.dataset.position = +img.dataset.position + 1)
      );
      return;
    }

    imgItems.forEach(img => {
      img.style.transform = `translateX(${100 * +img.dataset.position}%)`;
    });
  }

  renderSliderCircles();
};

const controlDescription = function (e) {
  const shortDescription = model.state.game.shortDescription;
  const description = model.state.game.description;

  const targetEl = e.target.closest('.modify__description');
  if (!targetEl) return;

  const container = targetEl.parentElement;
  const descriptionContainer = container.querySelector('.game__description');

  targetEl.classList.toggle('more');

  if (!targetEl.classList.contains('more')) {
    targetEl.textContent = 'Read less';
    descriptionContainer.innerHTML = description;
  } else {
    targetEl.textContent = 'Read more';
    descriptionContainer.innerHTML = shortDescription;
  }
};

const controlBookmarks = async function (e) {
  if (e.type === 'load') {
    model.state.bookmarks.forEach(bookmark => bookmarksView.render(bookmark));
    return;
  }

  const bookmarkBtn = e.target.closest('.bookmark');
  if (!bookmarkBtn) return;

  const bookmarkData = await model.addRemoveBookmarkData();
  if (!bookmarkData) return;

  console.log(model.state.game.bookmarked);
  gameView._fillEmptyBookmarkIcon(model.state.game.bookmarked);

  bookmarksView.clear();
  bookmarkData.forEach(bookmark => bookmarksView.render(bookmark));

  checkForBookmarks();
};

const checkForBookmarks = function () {
  if (model.state.bookmarks.length === 0) bookmarksView.renderError();
};

const controlPreviewHighlight = function (e) {
  const correspondingPreviews = document.querySelectorAll(
    `[data-id="${window.location.hash.slice(1)}"]`
  );

  const previews = document.querySelectorAll('.game__preview');

  previews.forEach(preview => {
    preview.classList.add('unselected');
    preview.classList.remove('selected');
  });

  correspondingPreviews.forEach(preview => {
    preview.classList.add('selected');
    preview.classList.remove('unselected');
  });
};

const init = async function () {
  model.getStoredBookmarks();
  checkForBookmarks();
  model.fetchStores();
  filterView.showHideFilter();
  filterView.addHandlerApplyFilter(controlFilterApply);
  filterView.addHandlerResetFilter(controlFilterReset);
  searchView.addHandlerSearch(controlSearchResults);
  gameView.addHandlerRender(controlRender);
  gameView.addHandlerSlider(controlSlider);
  gameView.addHandlerDescription(controlDescription);
  gameView.addHandlerBookmark(controlBookmarks);
  previewView.addHandlerHighlight(controlPreviewHighlight);
};
init();
