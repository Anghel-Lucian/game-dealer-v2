import View from './View';

class PreviewView extends View {
  _generateMarkup(data) {
    const html = `
      <li class="game__preview  ${this.highlightPreview(
        data.cheapestDealID
      )}" data-id="${data.cheapestDealID}">
        <a class="game__preview--link" href="#${data.cheapestDealID}">
          <div class="game__preview--info">
            <h3 class="game__preview--title">
              ${data.title}
            </h3>
          </div>
          <p class="game__preview--price">${data.cheapest}$</p>
        </a>
      </li>
    `;

    return html;
  }

  highlightPreview(id) {
    if (id === window.location.hash.slice(1)) {
      return 'selected';
    } else {
      return 'unselected';
    }
  }

  addHandlerHighlight(handler) {
    window.addEventListener('hashchange', function (e) {
      handler(e);
    });
  }
}

export default new PreviewView();
