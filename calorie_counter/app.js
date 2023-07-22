// Replace with your Supabase URL and public anon key
const SUPABASE_URL = 'https://fdufvbfhmcahufwagkzh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdWZ2YmZobWNhaHVmd2Fna3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MjEyOTIsImV4cCI6MjAwMzE5NzI5Mn0.OpC-bwxefICd_7oqodemrrkdljQV_jyLM2zMIlybOBI';

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('calorie-form');
const list = document.getElementById('calorie-list');
const summary = document.getElementById('calorie-summary');
// const body = document.getElementById('body');
const calorieLimit = 2000; // Set your daily calorie limit here

form.addEventListener('submit', addCalorieEntry);

window.onload = function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1);
  const date = (now.getDate() < 10 ? '0' : '') + now.getDate();
  const hours = (now.getHours() < 10 ? '0' : '') + now.getHours();
  const minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

  const datetimeLocal = `${year}-${month}-${date}T${hours}:${minutes}`;
  document.getElementById('calorie-date').value = datetimeLocal;
}

async function addCalorieEntry(event) {
  event.preventDefault();
  const calorieInput = document.getElementById('calorie-input');
  const calorieDateInput = document.getElementById('calorie-date');
  const calories = parseInt(calorieInput.value);
  if (isNaN(calories)) {
    return;
  }

  let time;
  if (calorieDateInput.value) {
    time = new Date(calorieDateInput.value);
  } else {
    time = new Date();
  }

  const { data, error } = await supabase
    .from('calorieentries')
    .insert([{ calories, time }])
  if (error) console.error("Error adding document: ", error);
  calorieInput.value = '';
  calorieDateInput.value = '';
  updateEntries();
}

async function updateEntries() {
  const { data, error } = await supabase
    .from('calorieentries')
    .select('*')
    .order('time', { ascending: false })

  if (error) console.error("Error getting entries: ", error);

  // Group entries by date
  let entriesByDate = {};
  data.forEach(({ calories, time }) => {
    let date = new Date(time);
    let day = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    if (!entriesByDate[day]) {
      entriesByDate[day] = [];
    }
    entriesByDate[day].push({ calories, time });
  });

  let entriesHTML = '';
  let previousDaySummariesHTML = '';
  let totalCalories = 0;
  let totalCaloriesForToday = 0;

  // Get today's date in 'YYYY/MM/DD' format
  let today = new Date();
  let todayString = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

  // Check if dark mode is active
  let isDark = body.classList.contains('dark');

  // Define color classes based on the mode
  let tableBgColor = isDark ? 'bg-gray-800' : 'bg-gray-100';
  let tableBorderColor = isDark ? 'border-gray-600' : 'border-gray-200';

  // Iterate over entries by date
  for (let day in entriesByDate) {
    let dailyCalories = entriesByDate[day].reduce((sum, entry) => sum + entry.calories, 0);

    // For today's entries
    if (day === todayString) {
      entriesHTML = `<h2 class="text-2xl font-semibold mb-4">Today</h2>
    <table class="w-full text-left border-collapse font-sans">
      <thead>
        <tr>
          <th class="w-1/3 py-2 px-4 border-b ${tableBorderColor} ${tableBgColor} font-semibold text-sm text-center">Time</th>
          <th class="w-1/3 py-2 px-4 border-b ${tableBorderColor} ${tableBgColor} font-semibold text-sm text-center">Item</th>
          <th class="w-1/3 py-2 px-4 border-b ${tableBorderColor} ${tableBgColor} font-semibold text-sm text-center">Calories</th>
        </tr>
      </thead>
      <tbody>
`;

      entriesByDate[day].forEach(({ calories, time }) => {
        totalCalories += calories;
        totalCaloriesForToday += calories;
        entriesHTML += `
      <tr>
        <td class="py-2 px-4 border-b ${tableBorderColor} text-center">${new Date(time).toLocaleTimeString()}</td>
        <td class="py-2 px-4 border-b ${tableBorderColor} text-center"></td>
        <td class="py-2 px-4 border-b ${tableBorderColor} text-center">${calories}</td>
      </tr>
    `;
      });

      entriesHTML += `</tbody></table>`;
    } else {
      totalCalories += dailyCalories;
      previousDaySummariesHTML = `<h2 class="text-2xl font-semibold mb-4">Past</h2>
      <table class="w-full text-left border-collapse font-sans">
        <thead>
          <tr>
            <th class="w-1/3 py-2 px-4 border-b ${tableBorderColor} ${tableBgColor} font-semibold text-sm text-center">Date</th>
            <th class="w-1/3 py-2 px-4 border-b ${tableBorderColor} ${tableBgColor} font-semibold text-sm text-center">Consumed Calories</th>
            <th class="w-1/3 py-2 px-4 border-b ${tableBorderColor} ${tableBgColor} font-semibold text-sm text-center">Calories Left</th>
          </tr>
        </thead>
        <tbody>
`;

      // Iterate over entries by date
      for (let day in entriesByDate) {
        let dailyCalories = entriesByDate[day].reduce((sum, entry) => sum + entry.calories, 0);

        // For previous day's entries
        if (day !== todayString) {
          totalCalories += dailyCalories;
          previousDaySummariesHTML += `
        <tr>
          <td class="py-2 px-4 border-b ${tableBorderColor} text-center">${day}</td>
          <td class="py-2 px-4 border-b ${tableBorderColor} text-center">${dailyCalories}</td>
          <td class="py-2 px-4 border-b ${tableBorderColor} text-center">${Math.max(0, calorieLimit - dailyCalories)}</td>
        </tr>
      `;
        }
      }

      previousDaySummariesHTML += `</tbody></table>`;
    }

  }

  // If no entries for today, set default message
  if (!entriesByDate[todayString]) {
    entriesHTML = '<li>0 calories consumed today.</li>' + entriesHTML;
  }

  list.innerHTML = entriesHTML;

  const previousDaySummariesDiv = document.getElementById('previous-day-summaries');
  previousDaySummariesDiv.innerHTML = previousDaySummariesHTML;

  const remainingCaloriesForToday = Math.max(0, calorieLimit - totalCaloriesForToday);
  summary.innerHTML = `<p class="py-1 text-center">Today you have consumed ${totalCaloriesForToday} calories. You have ${remainingCaloriesForToday} calories left.</p>`;
}

updateEntries();
