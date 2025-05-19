import { differenceInCalendarDays } from 'date-fns';

const dateForm = document.getElementById('dateForm');
const startDateInput = document.getElementById('startDate');
const dayCount = document.getElementById('dayCount');
const toggleDark = document.getElementById('toggleDark');

function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function updateDayCount(startDateStr) {
  if (!startDateStr) {
    dayCount.textContent = '—';
    return;
  }
  const startDate = new Date(startDateStr);
  if (isNaN(startDate)) {
    dayCount.textContent = '—';
    return;
  }
  const today = getToday();
  const days = differenceInCalendarDays(today, startDate) + 1;
  dayCount.textContent = days >= 0 ? days : '—';
}

function scheduleMidnightUpdate(startDateStr) {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const msUntilMidnight = nextMidnight - now;
  setTimeout(() => {
    updateDayCount(startDateStr);
    scheduleMidnightUpdate(startDateStr);
  }, msUntilMidnight + 100);
}

dateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const startDateStr = startDateInput.value;
  updateDayCount(startDateStr);
  scheduleMidnightUpdate(startDateStr);
});

startDateInput.addEventListener('input', () => {
  updateDayCount(startDateInput.value);
});

// Autofocus on load
window.addEventListener('DOMContentLoaded', () => {
  startDateInput.focus();
  // If query param exists (progressive enhancement)
  const params = new URLSearchParams(window.location.search);
  const start = params.get('start');
  if (start) {
    startDateInput.value = start;
    updateDayCount(start);
    scheduleMidnightUpdate(start);
  }
});

// Dark mode toggle
function setDarkMode(enabled) {
  document.documentElement.classList.toggle('dark', enabled);
  localStorage.setItem('darkMode', enabled ? '1' : '0');
}

toggleDark.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark');
  setDarkMode(!isDark);
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === '1' ||
    (localStorage.getItem('darkMode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  setDarkMode(true);
}
