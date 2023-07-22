// Replace with your Supabase URL and public anon key
const SUPABASE_URL = 'https://fdufvbfhmcahufwagkzh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdWZ2YmZobWNhaHVmd2Fna3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MjEyOTIsImV4cCI6MjAwMzE5NzI5Mn0.OpC-bwxefICd_7oqodemrrkdljQV_jyLM2zMIlybOBI';

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('calorie-form');
const list = document.getElementById('calorie-list');
const summary = document.getElementById('calorie-summary');
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

  // Iterate over entries by date
  for (let day in entriesByDate) {
    let dailyCalories = entriesByDate[day].reduce((sum, entry) => sum + entry.calories, 0);

    // For today's entries, append to the top of the list and add to the total
    if (day === todayString) {
      entriesByDate[day].forEach(({ calories, time }) => {
        totalCalories += calories;
        totalCaloriesForToday += calories;
        entriesHTML = `<li>${new Date(time).toLocaleString()}: ${calories} calories</li>` + entriesHTML;
      });
      // If no entries for today, set default message
      if (entriesHTML === '') {
        entriesHTML = '<li>0 calories consumed today.</li>';
      }
    } else {
      totalCalories += dailyCalories;
      previousDaySummariesHTML += `<p>${day}: Consumed ${dailyCalories} calories. ${Math.max(0, calorieLimit - dailyCalories)} calories left.</p>`;
    }

  }

  list.innerHTML = entriesHTML;

  const previousDaySummariesDiv = document.getElementById('previous-day-summaries');
  previousDaySummariesDiv.innerHTML = previousDaySummariesHTML;

  const remainingCaloriesForToday = Math.max(0, calorieLimit - totalCaloriesForToday);
  summary.innerHTML = `Today you have consumed ${totalCaloriesForToday} calories. You have ${remainingCaloriesForToday} calories left.`;
}


updateEntries();