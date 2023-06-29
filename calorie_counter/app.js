// We'll initialize this later
var supabase;

window.createSupabaseClient = function() {
  supabase = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  updateEntries();
};

const { createClient } = supabase;
const form = document.getElementById('calorie-form');
const list = document.getElementById('calorie-list');
const summary = document.getElementById('calorie-summary');
const calorieLimit = 2000; // Set your daily calorie limit here

form.addEventListener('submit', addCalorieEntry);

async function addCalorieEntry(event) {
  event.preventDefault();
  const calorieInput = document.getElementById('calorie-input');
  const calories = parseInt(calorieInput.value);
  if (isNaN(calories)) {
    return;
  }updateEntries
  const time = new Date();
  const { data, error } = await supabase
    .from('calorieentries')
    .insert([{ calories, time }])
  if (error) console.error("Error adding document: ", error);
  calorieInput.value = '';
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
    let day = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
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
  let todayString = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}`;

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


// updateEntries();
