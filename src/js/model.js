import 'regenerator-runtime/runtime';
import {
  API_URL,
  LIST_OF_STORES_URL,
  RAWG_API_URL,
  RAWG_API_KEY,
} from './config';
import { AJAX, filterCharacters } from './helpers';

export const state = {
  game: {},
  search: {
    query: '',
    results: [],
  },
  bookmarks: [],
  stores: [],
};

const createResultObject = function (resultData) {
  const { cheapest, cheapestDealID, external: title } = resultData;

  const selected =
    cheapestDealID === window.location.hash.slice(1) ? true : false;

  state.search.results.push({
    cheapest,
    cheapestDealID,
    title,
    selected,
  });
};

const createGameObject = function (resultData) {
  const { gameInfo } = resultData;

  state.game = {
    title: gameInfo.name,
    metacriticRating:
      gameInfo.metacriticScore === '0' ? '' : gameInfo.metacriticScore,
    metacriticLink: gameInfo.metacriticLink,
    steamRating:
      gameInfo.steamRatingPercent === '0' ? '' : gameInfo.steamRatingPercent,
    steamAppID: gameInfo.steamAppID,
    releaseDate:
      gameInfo.releaseDate === 0
        ? 'TBA'
        : `${new Date(gameInfo.releaseDate * 1000).getDate()}/${new Date(
            gameInfo.releaseDate * 1000
          ).getMonth()}/${new Date(gameInfo.releaseDate * 1000).getFullYear()}`,
    id: gameInfo.gameID,
    retailPrice: gameInfo.retailPrice,
    cheapestDealID: window.location.hash.slice(1),
  };

  state.game.bookmarked = state.bookmarks.find(
    bookmark => bookmark.cheapestDealID === state.game.cheapestDealID
  )
    ? true
    : false;
};

export const filterData = function (dataArr, resultsLimit, maxPrice, sortBy) {
  let data = dataArr;

  if (maxPrice) {
    data = data.filter(previewData => +previewData.cheapest < maxPrice);
  }

  if (resultsLimit) {
    data.splice(resultsLimit);
  }

  if (sortBy === 'price') {
    data.sort((a, b) => a.cheapest - b.cheapest);
  }
  if (sortBy === 'name') {
    data.sort((a, b) => {
      const titleA = a.external.toUpperCase();
      const titleB = b.external.toUpperCase();

      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }

      return 0;
    });
  }

  return data;
};

export const fetchPreviewData = async function (
  query,
  resultsLimit,
  maxPrice,
  sortBy
) {
  state.search.results = [];
  state.search.query = query;

  let data = await AJAX(`${API_URL}games?title=${query}`);

  if (!data.length) return;

  data = filterData(data, resultsLimit, maxPrice, sortBy);

  data.map(previewData => createResultObject(previewData));
};

export const fetchGameData = async function (id) {
  state.game = {};

  const data = await AJAX(`${API_URL}deals?id=${id}`);

  createGameObject(data);
  await fetchDeals(state.game.id);
  await fetchAdditionalData(state.game.title);
};

const fetchAdditionalData = async function (gameSlug) {
  const data = await AJAX(
    `${RAWG_API_URL}games/${filterCharacters(gameSlug)}?key=${RAWG_API_KEY}`
  );
  if (!data.id) return;

  const { id, description, developers } = data;

  if (id) {
    const gameImgs = await AJAX(
      `https://api.rawg.io/api/games/${id}/screenshots?key=9131a6b6b852479bb1a79e8e5050bf9a`
    );

    state.game.images = gameImgs.results.length !== 0 ? gameImgs.results : '';
  }

  if (developers) {
    state.game.developer = developers[0].name;
  }

  if (description) {
    const shortDescription = `${data.description.slice(
      0,
      data.description.length / 5
    )}...`;

    state.game.description = description;
    state.game.shortDescription = shortDescription;
  }
};

const fetchDeals = async function (gameID) {
  const response = await AJAX(`${API_URL}games?id=${gameID}`);
  state.game.deals = response.deals;
  response.deals.forEach(dealObj => {
    dealObj.storeName = state.stores.find(
      store => store.storeID === dealObj.storeID
    )?.storeName;
  });
};

export const fetchStores = async function () {
  const data = await AJAX(LIST_OF_STORES_URL);

  state.stores = data.map(storeData => {
    return {
      storeID: storeData.storeID,
      storeName: storeData.storeName,
    };
  });
};

export const addRemoveBookmarkData = async function () {
  const bookmarkData = {
    cheapestDealID: window.location.hash.slice(1),
    title: state.game.title,
    cheapest: state.game.deals[0].price,
  };

  if (
    state.bookmarks.find(
      bookmark => bookmark.cheapestDealID === bookmarkData.cheapestDealID
    )
  ) {
    state.game.bookmarked = false;

    const bookmarkIndex = state.bookmarks.indexOf(
      state.bookmarks.find(
        bookmark => bookmark.cheapestDealID === bookmarkData.cheapestDealID
      )
    );
    state.bookmarks.splice(bookmarkIndex, 1);

    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    return state.bookmarks;
  }

  state.game.bookmarked = true;
  state.bookmarks.push(bookmarkData);
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

  return state.bookmarks;
};

export const getStoredBookmarks = function () {
  state.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
};
