// Redirect to the index.html page if the user data is not found in the sessionStorage
if (sessionStorage.getItem("user") === null) {
  window.location.href = "/index.html";
}
// Get the logged-in user data from sessionStorage
let userInfo = JSON.parse(sessionStorage.getItem("user"));
// Check if the user data exists and has a hotel name
if (userInfo && userInfo.hotelName) {
  // Get a reference to the navbar brand element
  const navbarBrand = document.querySelector(".navbar-brand");
  // Update the navbar brand text to display the logged-in user's hotel name
  navbarBrand.textContent = userInfo.hotelName;
}
// Add an event listener to the logout button
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  // Update the button text to indicate processing
  logoutButton.textContent = "Please wait...";

  // Wait for 3 seconds before logging out and redirecting
  setTimeout(() => {
    // Clear the sessionStorage to log the user out
    sessionStorage.clear();
    // Redirect to the index.html page after logging out
    window.location.href = "/index.html";
  }, 3000);
});
