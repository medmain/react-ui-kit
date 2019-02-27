import isNil from 'lodash/isNil';

export const englishLocale = {
  $id: 'en',
  $name: 'English',

  // === General ===

  firstDayOfWeek: 1, // Monday

  // === List component ===

  listNoItemsFound: 'No items found.',

  // === Input fields ===

  formatTextInput(string) {
    return string ? string : '';
  },

  parseTextInput(string) {
    return string ? string : null;
  },

  formatNumberInput(number) {
    if (isNil(number)) {
      return '';
    }
    return String(number);
  },

  // Returns a number, NaN or null
  parseNumberInput(string) {
    string = string.trim();
    if (!string) {
      return null;
    }
    const number = Number(string);
    if (this.formatNumberInput(number) !== string) {
      return NaN;
    }
    return number;
  },

  numberInputInvalidityMessage: 'Please enter a valid number.',

  formatDateInput(date) {
    if (isNil(date)) {
      return '';
    }
    const year = String(date.getUTCFullYear()).padStart(4, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return year + '/' + month + '/' + day;
  },

  parseDateInput(string) {
    string = string.trim();
    if (!string) {
      return null;
    }
    if (string.length !== 10) {
      return null;
    }
    const date = new Date(
      string.slice(0, 4) + '-' + string.slice(5, 7) + '-' + string.slice(8, 10)
    );
    if (isNaN(date.valueOf())) {
      return null;
    }
    return date;
  },

  dateInputInvalidityMessage: 'Please enter a valid date',

  dateInputPlaceholder: 'YYYY/MM/DD'
};
