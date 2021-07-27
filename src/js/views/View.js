export default class View {
  render(data) {
    const html = this._generateMarkup(data);
    this._parentElement.insertAdjacentHTML('beforeend', html);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    this._parentElement.innerHTML = `
    <div class="loading__spinner">
      <i class="fas fa-spinner fa-3x spinner__icon"></i>
    </div>
    `;
  }

  renderError() {
    this._parentElement.innerHTML = `
    <div class="error">
      <i class="fas fa-exclamation-triangle fa-2x error__icon"></i>
      <p class="error__message">${this._errorMessage}</p>
    </div>
    `;
  }
}
