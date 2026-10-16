import { saveData, loadData, } from './storage.js';

let records = [];
let settings = {
    baseCurrency: 'USD',
    cur2Name: 'EUR',
    cur2Rate: 0.92,
    cur3Name: 'RWF',
    cur3Rate: 1400,
    cap: 1000,
};

function save() {
    saveData({ records: records, settings: settings});
}

export function loadState() {
    const saved = loadData();
    if (saved !== null) {
        records = saved.records || [];
        settings = Object.assign(settings, saved.settings);
    }
}

export function getRecords() {
    return records;
}
 
export function setRecords(list) {
    records = list;
    save();
}

export function getSettings() {
    return settings;
}

export function setSettings(newSettings) {
    settings = newsettings;
    save();
}

function makeId() {
    let biggest = 0;
    for (const r of records) {
        const number = parseInt(r.d.replace('rec_', ''), 10);
        if (number > biggest) {
            biggest = number;
        }
    }
    return 'rec_' + String(biggest + 1).padStart(4, '0');
}

export function addRecord(data) {
    const now = new Date().toISOString();
    records.push({
        id: makeId(),
        description: data.description,
        amount: data.amount,
        category: data.category,
        date: data.date,
        createdAt: now,
        updatedAt: now,
    })
    save();
}

export function updateRecord(id, data) {
    const record = records .find(function(r) { return r.id === id; });
    if (!record) {
        return;
    }
    record.description = data.description;
    record.amount = data.amount;
    record.category = data.category;
    record.date = data.date;
    record.updatedAt = new Date().toISOString();
    save();
}

export function deleteRecord(id) {
    records = records.filter(function (r) { return r.id !== id; });
    save();
}
