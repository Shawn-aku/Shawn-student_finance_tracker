# Shawn-student_finance_tracker
# Student Finance Tracker

A simple app to track student spending. Built with plain HTML, CSS and JavaScript.

- Live site:  https://shawn-aku.github.io/Shawn-student_finance_tracker/
- Demo video: https://youtu.be/rKVX8G2FMAA?si=96waWsThnTJr4Pgd
- Contact: github.com/Shawn-aku, s.bamigboye@alustudent.com

## Theme
Student Finance Tracker

## Features
- Add, edit and delete records
- Regex validation on the form
- Regex search with highlighting, and sorting
- Dashboard with totals, top category and a 7 day chart
- Spending cap message
- Currency and cap settings
- Saves to localStorage
- JSON import and export
- Sample data from seed.json

## Regex catalog
| Field | Pattern | Example |
|---|---|---|
| Description | `^\S(?:.*\S)?$` | "Lunch" passes, " Lunch" fails |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | "12.50" passes, "012" fails |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | "2025-09-29" passes |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | "Eating-out" passes, "Food2" fails |
| Repeated word | `\b(\w+)\s+\1\b` | "the the" is rejected |

## Keyboard map
- Tab / Shift+Tab: move between items
- Enter or Space: press a button
- Enter in a form: submit

## Accessibility
- Skip-to-content link and semantic landmarks
- Labels on every input, errors linked to the fields
- Visible focus outline
- Status messages use aria-live
- Works at about 360px, 768px and 1024px widths

## How to run
Open the folder in VS Code, right-click `index.html` and choose "Open with Live Server".

## How to run the tests
Open `tests.html` with Live Server. Each test shows PASS or FAIL.
