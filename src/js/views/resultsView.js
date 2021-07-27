import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.search__results');
  _errorMessage = "Sorry! We couldn't find that game.";

  _generateMarkup(data) {
    return previewView._generateMarkup(data);
  }
}

export default new ResultsView();
