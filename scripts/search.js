export function compileRegex(pattern, ignoreCase) {
    if (pattern == '') {
        return { regex: null, error: ''};
    }
    try {
        const flags = ignoreCase ? 'gi' : 'g';
        return { regex: new RegExp(pattern, flags), error:'' };
    } catch (error) {
        return { regex: null, error: 'That pattern is not valid: ' + error.message };
    }
}

export function escapeHtml(text) {
    return String(text)
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
}

// Wraps matches in <mark>. Everything else is escaped so it is safe.
export function highlight(text, regex) {
    text = String(text);
    if (regex === null) {
        return escapeHtml(text);
    }
    let result = '';
    let last = 0;
    for (const match of text.matchAll(regex)) {
        if (match[0] === '') {
            continue;
        }
        result += escapeHtml(text.slice(last, match.index));
        result += '<mark>' + escapeHtml(match[0]) + '</mark>';
        last = match.index + match[0].length;
    }
    result += escapeHtml(text.slice(last));
    return result;
}

export function recordMatches(record, regex) {
    if (regex === null) {
        return true;
    }
    const parts = [record.description, record.category, String(record.amount), record.date];
    for (const part of parts) {
        if (String(part).search(regex) !== -1) {
            return true;
        }
    }
    return false;
}