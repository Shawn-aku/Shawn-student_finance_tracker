const KEY = 'finance-tracker-data';

export function saveData(data) {
    try {
    localStorage.setItem(KEY, JSON.stringify(data));
    } catch (error) {
        console.log('could not save data:', error);
    }
}

export function loadData() {
    try {
        const text = localStorage.getItem(KEY);
        if (text === null) {
            return null;
        }
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
}

export function exportJSON(records) {
    const text = JSON.stringify(records, null, 2);
    const blob = new Blob([text], { type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = d0cument.createElement('a');
    link.href = url;
    link.download = 'finance-records.json';
    link.click();
    URL.revokeObjectURL(url);
}