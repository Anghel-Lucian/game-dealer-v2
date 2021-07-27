import View from './View';

class FilterView extends View {
  _parentElement = document.querySelector('.search__filters');
  _showFilterBtn = document.querySelector('.search__filters--btn');

  addHandlerApplyFilter(handler) {
    const applyFilterBtn = this._parentElement.querySelector('.apply--btn');

    applyFilterBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const formData = [...new FormData(document.querySelector('.search'))];
      const data = Object.fromEntries(formData);

      handler(data);
    });
  }

  addHandlerResetFilter(handler) {
    const resetFilterBtn = this._parentElement.querySelector('.reset--btn');

    resetFilterBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const form = document.querySelector('.search__filters');

      const inputs = form.querySelectorAll('input');
      const select = form.querySelector('select');

      const allInputs = [select, ...inputs];
      allInputs.forEach(input => (input.value = ''));

      handler();
    });
  }

  showHideFilter() {
    this._showFilterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('.search__filters').classList.toggle('dropped');
      document.querySelector('.search__filters').classList.toggle('raised');
    });
  }
}

export default new FilterView();
