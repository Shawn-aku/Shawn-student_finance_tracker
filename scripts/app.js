import { loadState, getRecords, setRecords, getSettings, updateRecord, addRecord, deleteRecord, setSettings } from "./state.js";
import { checkDescription, checkAmount, checkDate, checkCategory, checkCurrency, validateRecordsFile } from "./validators.js";
import { exportJSON } from "./storage.js";
import { renderTable, renderStats } from "./ui.js";

let editingId = null;

const form = document.getElementById('record-form');
const searchText = document.getElementById('search-text');
const searchCase = document.getElementById('search-case');
const sortBy = document.getElementById('sort-by');

function refreshAll() {
    renderTable(searchText.value, searchCase.checked, sortBy.value);
    renderStats();
}
// ----- pages -----
function showPage(name) {
  const pages = document.querySelectorAll('.page');
  for (const page of pages) {
    page.hidden = page.id !== name;
  }
  const buttons = document.querySelectorAll('nav button');
  for (const button of buttons) {
    if (button.dataset.page === name) {
        button.setAttribute('aria-current', 'page');
    }else {
        button.removeAttribute('aria-current');
    }
  }
}

document.querySelector('nav').addEventListener('click', function (event) {
    if (event.target.dataset.page) {
        showPage(event.target.dataset.page);
    }
});

// ----- add / edit form -----
function resetForm() {
  form.reset();
  editingId = null;
  document.getElementById('form-title').textContent = 'Add record';
  document.getElementById('save-btn').textContent = 'Add record';
  document.getElementById('cancel-btn').hidden = true;
  for (const name of ['description', 'amount', 'category', 'date']) {
    document.getElementById(name + '-error').textContent = '';
  }
}
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const description = form.elements.description.value;
    const amount = form.elements.amount.value;
    const category = form.elements.category.value;
    const date = form.elements.date.value;

    const errors = {
        description: checkDescription(description),
        amount: checkAmount(amount),
        category: checkCategory(category),
        date: checkDate(date)
    };

    let allGood = true;
    for (const name in errors) {
        document.getElementById(name + '-error').textContent = errors[name];
        if (errors[name] !== '') {
            allGood = false;
        }
    }

    const status = document.getElementById('form-status')
    if (!allGood) {
        status.textContent = 'Please fix the errors above.';
        return;
    }

    const data = {
        description: description.replace(/\s{2,}/g, ' '),
        amount: Number(amount),
        category: category,
        date: date
    };

    if (editingId === null) {
        addRecord(data);
        status.textContent = 'Record added.';
    } else {
        updateRecord(editingId, data);
        status.textContent = 'Record updated'
    }
    document.getElementById('cancel-btn').addEventListener('click', function () {
  resetForm();
  document.getElementById('form-status').textContent = 'Edit cancelled.';
  showPage('records');
});
    resetForm();
    refreshAll();
    showPage('records');
});

// ----- edit and delete buttons in the table -----
document.getElementById('records-body').addEventListener('click', function (event) {
   const action = event.target.dataset.action;
   const id = event.target.dataset.id;
   if (!action) {
    return;
   }
   if (action === 'delete') {
    if (confirm('Delete this record?')) {
        deleteRecord(id);
        refreshAll();
    }
}
  if ( action === 'edit') {
    const record = getRecords().find(function (r) { return r.id === id});
    form.elements.description.value = record.description;
    form.elements.amount.value = record.amount;
    form.elements.category.value = record.category;
    form.elements.date.value = record.date;
    editingId = id;
    document.getElementById('form-title').textContent = 'Edit record';
    document.getElementById('save-btn').textContent = 'Save changes';
    document.getElementById('cancel-btn').hidden = false;
    showPage('add');
    form.elements.description.focus();
    }
});

// ----- search and sort -----
searchText.addEventListener('input', refreshAll);
searchCase.addEventListener('change', refreshAll);
sortBy.addEventListener('change', refreshAll);

// ----- settings -----
function fillSettingsForm() {
    const s = getSettings();
    document.getElementById('set-base').value = s.baseCurrency;
    document.getElementById('set-cur2').value = s.cur2Name;
    document.getElementById('set-rate2').value = s.cur2Rate;
    document.getElementById('set-cur3').value = s.cur3Name;
    document.getElementById('set-rate3').value = s.cur3Rate;
    document.getElementById('set-cap').value = s.cap;
}

document.getElementById('settings-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const base = document.getElementById('set-base').value;
    const cur2 = document.getElementById('set-cur2').value;
    const cur3 = document.getElementById('set-cur3').value;
    const rate2 = Number(document.getElementById('set-rate2').value);
    const rate3 = Number(document.getElementById('set-rate3').value);
    const cap = document.getElementById('set-cap').value;
    const status = document.getElementById('settings-status')

    const problem = checkCurrency(base) || checkCurrency(cur2) || checkCurrency(cur3) ||
    (rate2 > 0 ? '' : 'The second rate must be a number above 0.') ||
    (rate3 > 0 ? '' : 'The third rate must be a number above 0.') ||
    checkAmount(cap);
    if (problem) {
        status.textContent = 'Settings not saved ' + problem;
        return;
    }

    setSettings({
        baseCurrency: base,
        cur2Name: cur2,
        cur2Rate: rate2,
        cur3Name: cur3,
        cur3Rate: rate3,
        cap: Number(cap)
    });
    status.textContent = 'Settings saved. ';
    refreshAll()
} );

// ----- import / export -----
function loadRecordsFromData(data) {
    const status = document.getElementById('settings-status');
    const problem = validateRecordsFile(data);
    if (problem) {
        status.textContent = 'Import failed. ' + problem;
        return;
    }
    for (const r of data) {
        r.amount = Number(r.amount);
    }
    setRecords(data);
    refreshAll();
    status.textContent = 'Loaded ' + data.length + ' records.';
}

document.getElementById('export-btn').addEventListener('click', function () {
  exportJSON(getRecords());
  document.getElementById('settings-status').textContent = 'Records exported.';
});

document.getElementById('import-file').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    try {
      loadRecordsFromData(JSON.parse(reader.result));
    } catch (error) {
      document.getElementById('settings-status').textContent = 'Import failed. That file is not valid JSON.';
    }
  };
  reader.readAsText(file);
});

document.getElementById('sample-btn').addEventListener('click', function () {
    fetch('seed.json')
    .then(function (response) { return response.json(); })
    .then(function (data) { loadRecordsFromData(data); })
    .catch(function () {
        document.getElementById('settings-status').textContent = 'Could not load seed.json.';
    });
});

// ----- start -----
loadState();
fillSettingsForm();
refreshAll();
showPage('about');
