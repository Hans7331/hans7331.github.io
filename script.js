// Greeting
const greetingEl = document.getElementById("greeting");
const hour = new Date().getHours();

let greeting = "Welcome, Guest 👋";

if (hour < 12) greeting = "Good morning, Guest 🌅";
else if (hour < 18) greeting = "Good afternoon, Guest ☀️";
else greeting = "Good evening, Guest 🌙";

greetingEl.textContent = greeting;

// Footer year
document.getElementById("year").textContent =
  new Date().getFullYear();
