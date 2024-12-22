// Initialize an empty array to store user information
let allUsersInfo = [];

// Get references to the registration form, all input fields, and the registration button
let regForm = document.querySelector(".reg-form");
let allInput = regForm.querySelectorAll("input");
let regBtn = regForm.querySelector("button");

// Load existing users from localStorage, if any
if (localStorage.getItem("allUsersInfo") !== null) {
  // Parse the stored data and assign it to the allUsersInfo array
  allUsersInfo = JSON.parse(localStorage.getItem("allUsersInfo"));
}
console.log(allUsersInfo); // Log the loaded user data for debugging purposes

// Handle form submission
regForm.addEventListener("submit", (e) => {
  // Prevent default form submission behavior
  e.preventDefault();

  // Get the email input field by its name attribute
  let emailInput = regForm.querySelector("input[name='email']");

  // Check if the entered email already exists in the user data
  let checkEmail = allUsersInfo.find((data) => data.email === emailInput.value);

  if (checkEmail === undefined) {
    // If the email is not already registered, create a new user data object
    let data = {};

    // Iterate over all input fields and collect their values
    allInput.forEach((el) => {
      // Use the input field's name attribute as the key for the data object
      let key = el.name;
      data[key] = el.value; // Collect all form data
    });

    // Update the registration button's text to indicate processing
    regBtn.innerText = "Processing....";

    // After a short delay, update the button text and add the new user data to the list
    setTimeout(() => {
      regBtn.innerText = "Register";
      allUsersInfo.push(data); // Add new user data to the list
      localStorage.setItem("allUsersInfo", JSON.stringify(allUsersInfo)); // Save updated list to localStorage
      swal("Registration Success!", "Good job!", "success"); // Alert success message

      // Clear all input fields
      allInput.forEach((el) => {
        el.value = ""; // Clear input field value
      });
    }, 2000);
  } else {
    // If the email already exists, display an error message
    swal("Failed!", "Email already exists.", "warning");
  }
});
