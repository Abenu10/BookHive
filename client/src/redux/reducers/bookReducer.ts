import { BookActions } from '../actions/bookActions';

interface BookState {
  books: any[];
}

const initialState: BookState = {
  books: [],
};

const bookReducer = (state = initialState, action: BookActions) => {
  switch (action.type) {
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.book] };
    case 'REMOVE_BOOK':
      return { ...state, books: state.books.filter((book) => book.id !== action.bookId) };
    default:
      return initialState;
  }
};

export default bookReducer;
