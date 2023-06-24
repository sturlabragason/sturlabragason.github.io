// Replace with your Supabase URL and public anon key
const SUPABASE_URL = 'https://fdufvbfhmcahufwagkzh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdWZ2YmZobWNhaHVmd2Fna3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MjEyOTIsImV4cCI6MjAwMzE5NzI5Mn0.OpC-bwxefICd_7oqodemrrkdljQV_jyLM2zMIlybOBI';

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  }
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
  let entriesHTML = '';
  let totalCalories = 0;
  data.forEach(({ calories, time }) => {
    totalCalories += calories;
    entriesHTML += `<li>${new Date(time).toLocaleString()}: ${calories} calories</li>`;
  });
  list.innerHTML = entriesHTML;
  const remainingCalories = Math.max(0, calorieLimit - totalCalories);
  summary.innerHTML = `Today you have consumed ${totalCalories} calories. You have ${remainingCalories} calories left.`;
}

updateEntries();
