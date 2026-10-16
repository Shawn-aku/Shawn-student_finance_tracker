export const rules = {
    description: /^\S(?:.*\S)?$/,
    amount:  /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category:  /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    currency: /^[A-Z]{3}$/,
  // advanced rule: back-reference catches a repeated word like "the the"
  duplicateWord: /\b(\w+)\s+\1\b/i
};

export function checkDescription(text) {
    if (!rules.description.test(text)) {
        return 'Cannot be empty or start/end with a space.';
    }
    if (rules.duplicateWord.test(text)) {
        return 'A word is repeated twice. Please check.';

    }
    return '';
}

export function checkAmount(text) {
    if (!rules.amount.test(text)) {
        return 'Use a number like 12 or 12.50 (max 2 decimals).';
    }
    return '';
}

export function checkDate(text) {
    if (!rules.date.test(text)) {
        return 'Use the format YYYY-MM-DD, for example 2024-08-29.';
    }
    return ''
}

export function checkCategory(text) {
  if (!rules.category.test(text)) {
    return 'Use letters only. Single spaces or hyphens are allowed between words.';
  }
  return '';
}

export function checkCurrency(text) {
  if (!rules.currency.test(text)) {
    return 'Use 3 capital letters, like USD.';
  }
  return '';
}

// Checks an imported file. Returns an error message, or '' if it is fine.
export function validateRecordsFile(data) {
    if (!Array.isArray(data)) {
        return 'The file must contain a list of records.';
    }
    for (let i = 0; i < data.length; i++) {
        const r = data[i];
        const number = i + 1;
         if (typeof r !== 'object' || r === null) {
      return 'Record ' + number + ' is not an object.';
    }
        if (!r.id || !r.createdAt || !r.updatedAt) {
            return 'Record ' + number + ' is missing an id or timestamps.';
        }
        const problem =
         checkDescription(String(r.description)) ||
         checkAmount(String(r.amount)) ||
         checkDate(String(r.date)) ||
         checkCategory(String(r.category));
    if (problem) {
        return 'Record ' + number + ': ' + problem;
    }
}
 return '';

}


