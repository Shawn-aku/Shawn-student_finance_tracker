import { getRecords, getSettings } from './state.js';
import { compileRegex, highlight, recordMatches } from './search.js';

function sortRecords(list, how) {
    const sorted = list.slice();
    if (how === 'date-new') {
        sorted.sort(function (a, b) {return b.date.localeCompare(a.date);});
    } else if (how === 'date-old') {
        sorted.sort(function (a, b) {return a.date.localeCompare(b.date); });
    } else if (how === 'desc-az') {
        sorted.sort(function (a, b) { return a.description.localeCompare(b.description); });
    }else if (how === 'desc-za') {
        sorted.sort(function (a, b) { return b.description.localeCompare(a.description); });
    } else if (how === 'amount-low') {
        sorted.sort(function (a, b) { return a.amount - b.amount; });
    } else if (how === 'amount-high') {
        sorted.sort(function (a, b) { return b.amount - a.amount; });
    }
    return sorted;
}

export function renderTable(searchText, ignoreCase, sortBy) {
    const result = compileRegex(searchText, ignoreCase);
    const regex = result.regex;
    document.getElementById('search-error').textContent = result.error;

    let list = getRecords().filter(function (r) { return recordMatches (r, regex); });
    list = sortRecords(list, sortBy);

    const body = document.getElementById('records-body');
    body.innerHTML = '';

    if (list.length === 0) {
        body.innerHTML = '<tr><td colspan="5">No records to show.</td></tr>';
    }

    for (const r of list) {
        const row = document.createElement('tr');
        row.innerHTML =
        '<td data-label="Date">' + highlight(r.date, regex) + '</td>' +
        '<td data-label="Description">' + highlight(r.description, regex) + '</td>' +
        '<td data-label="Amount">' + highlight(Number(r.amount).toFixed(2), regex) + '</td>' +
        '<td data-label="Category">' + highlight(r.category, regex) + '</td>' +
        '<td data-label="Actions">' + 
        '<button type="button" data-action="edit" data-id="' + r.id + '">Edit</button>' +
        '<button type="button" data-action="delete" data-id="' + r.id + '">Delete</button>' +
        '</td>';
        body.appendChild(row);
    }

    document.getElementById('search-status').textContent = list.length + ' record(s) shown.';
}

function localDateString(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
}
 
export function renderStats() {
    const records = getRecords();
    const settings = getSettings();

    let total = 0;
    const counts = {};
    for (const r of records) {
        total += Number(r.amount);
        counts[r.category] = (counts[r.category] || 0) + 1;
    }

    let topCategory = 'none';
    let topCount = 0;
    for (const name in counts) {
        if (counts[name] > topCount) {
            topCount = counts[name];
            topCategory = name;
        }
    }

    document.getElementById('stat-count').textContent = records.length;
    document.getElementById('stat-top').textContent = topCategory
    document.getElementById('stat-total').textContent =
       total.toFixed(2) + ' ' + settings.baseCurrency + ' (' +
       (total * settings.cur2Rate).toFixed(2) + ' ' + settings.cur2Name + ', ' +
       (total * settings.cur3Rate).toFixed(2) + ' ' + settings.cur3Name + ') ';
        
        // cap message: polite when under, assertive when over
  const message = document.getElementById('cap-message');
  const left = settings.cap - total;
  if (left < 0) {
    message.setAttribute('aria-live', 'assertive');
    message.textContent = 'You are over your cap by ' + Math.abs(left).toFixed(2) + ' ' + settings.baseCurrency + '.';
  } else {
    message.setAttribute('aria-live', 'polite');
    message.textContent = 'You have ' + left.toFixed(2) + ' ' + settings.baseCurrency + ' left under your cap';
  }

  // last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    days.push({ key: localDateString(day), label: localDateString(day).slice(5), sum: 0 });
  }
  for (const r of records) {
    for (const d of days) {
        if (d.key === r.date) {
            d.sum += Number(r.amount)
        }
    }
  }
  let biggest = 1;
  for (const d of days) {
    if (d.sum > biggest) {
        biggest = d.sum;
    }
  }
  const list = document.getElementById('trend-list');
  list.innerHTML = '';
  for (const d of days) {
    const item = document.createElement('li');
    const height = (d.sum / biggest) * 100;
    item.innerHTML =
    '<span class="sum">' + d.sum.toFixed(0) + '</span>' +
    '<span class="bar" syle="height:' + height + '%"></span>' +
    '<span class="day">' + d.label + '</span>';
    list.appendChild(item);
  }
}