import View from './View';
import previewView from './previewView';

class BookmarkView extends View {
  _parentElement = document.getElementById('saved__deals');
  _errorMessage = 'No saved deals yet!';

  _generateMarkup(data) {
    return previewView._generateMarkup(data);
  }
}

export default new BookmarkView();
