import View from './View';

class GameView extends View {
  _parentElement = document.querySelector('.game__container');
  _errorMessage = 'No game yet! Search for one.';

  _generateMarkup(data) {
    const html = `
    <div class="game__container--top">
      <div class="game__info">
        <h3 class="game__title">
          ${data.title}
          <button class="bookmark btn">
            <i class="${data.bookmarked ? 'fas' : 'far'} fa-bookmark"></i>
          </button>
        </h3>
        <div class="ratings">
          <h5 class="ratings__title">Ratings:</h5>
          <div class="ratings__links">
            <a class="metacritic__rating rating" href="https://www.metacritic.com${
              data.metacriticLink
            }" target="_blank">
              <img
                class="metacritic__icon rating__icon"
                src="metacritic-icon.cae689fa.png"
                alt="Metacritic icon"
              />${data.metacriticRating || '--'}
            </a>
            <a class="steam__rating rating" href="https://store.steampowered.com/app/${
              data.steamAppID
            }/" target="_blank">
              <img
                class="steam__icon rating__icon"
                src="steam-icon.1c571dd0.png"
                alt="Steam icon"
              />${data.steamRating || '--'}
            </a>
          </div>
        </div>
        <div class="game__detail--primary">
          <h5>
            Released on:
            <span class="game__detail--date">${data.releaseDate}</span>
            <h5 class="game__detail--publisher">${
              data.developer ? `by ${data.developer}` : ''
            }</h5>
          </h5>
        </div>
      </div>
    </div>
    ${
      data.images
        ? `
    <div class="game__images">
      <button class="prev__img change__img"><i class="fas fa-chevron-left"></i></button>
      <ul class="game__images--list">
        ${data.images.map(this._generateImgMarkup).join('')}
      </ul>
      <button class="next__img change__img"><i class="fas fa-chevron-right"></i></button>
      <ul class="img__legend">
        ${data.images
          .map(
            (_, i) =>
              `
              <li class="img__legend--item"  data-img="${i}">
                <i class="far fa-circle img__circle"></i>
              </li>
              `
          )
          .join('')}
      </ul>
    </div>`
        : ''
    }
    <div class="game__container--middle">
    ${
      data.shortDescription
        ? `
      <div class="game__description">
        ${data.shortDescription}
      </div>
      <button class="modify__description more">Read more</button>`
        : ''
    }
    </div>
    <div class="game__container--bottom">
      <!-- <li class="retail hidden">
        <h3 class="retail__message message">Looks like there's no deal. You can buy the game at retail price tho:</h3>
        <a class="retail__link" href="<link to shop>">Go to SHOP THAT SELLS THE GAME</a>
      </li> -->
      <h2 class="game__deals--title">Here are your deals!</h2>
      <ul class="game__deals">
        ${data.deals.map(deal => this._generateDealMarkup(deal)).join('')}
      </ul>
    </div>
    `;

    return html;
  }

  _generateDealMarkup(dealData) {
    return `
    <li class="game__deal"> 
      <a class="link__to__deal" href="https://www.cheapshark.com/redirect?dealID=${dealData.dealID}" target="_blank">
        <h3 class="game__deal--price">${dealData.price}$</h3>
        <h3 class="game__deal--store">${dealData.storeName}</h3>
      </a>
    </li>`;
  }

  _generateImgMarkup(imgData, i) {
    return `
    <li class="game__images--item" data-position="${i}" style="transform: translateX(${
      100 * i
    }%)">
      <img class="game__image" src="${imgData.image}">
    </li>
    `;
  }

  _fillEmptyBookmarkIcon(bookmarked) {
    if (bookmarked) {
      this._parentElement.querySelector(
        '.bookmark'
      ).innerHTML = `<i class="fas fa-bookmark"></i>`;
    } else {
      this._parentElement.querySelector(
        '.bookmark'
      ).innerHTML = `<i class="far fa-bookmark"></i>`;
    }
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => {
      window.addEventListener(ev, handler);
    });
  }

  addHandlerSlider(handler) {
    this._parentElement.addEventListener('click', function (e) {
      handler(e);
    });
  }

  addHandlerSliderCircles(handler) {
    window.addEventListener('load', function (e) {
      handler(e);
    });
  }

  addHandlerDescription(handler) {
    this._parentElement.addEventListener('click', function (e) {
      handler(e);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      handler(e);
    });

    window.addEventListener('load', function (e) {
      handler(e);
    });
  }
}

export default new GameView();
