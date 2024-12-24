// Initialize an empty array to store user information
let allUsersInfo = [];

// Get references to the registration form, all input fields, and the registration button
const regForm = document.querySelector(".reg-form");
const allInput = regForm.querySelectorAll("input");
const regBtn = regForm.querySelector("button");

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
  const emailInput = regForm.querySelector("input[name='email']");

  // Check if the entered email already exists in the user data
  const existingUser = allUsersInfo.find(
    (data) => data.email === emailInput.value
  );

  if (!existingUser) {
    // If the email is not already registered, create a new user data object
    const data = {};

    // Iterate over all input fields and collect their values
    allInput.forEach((el) => {
      // Use the input field's name attribute as the key for the data object
      const key = el.name;
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

// Login Form

// Get the login form element
let loginForm = document.querySelector(".login-form");
// Get all input fields within the login form
let allLoginInput = loginForm.querySelectorAll("input");
// Get the login button element
let loginBtn = loginForm.querySelector("button");

// Add an event listener for the form submission
loginForm.addEventListener("submit", (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get the email input field
  let emailInput = loginForm.querySelector("input[name='email']");
  // Get the password input field
  let passwordInput = loginForm.querySelector("input[name='password']");

  // Check if input fields are empty
  if (emailInput.value.trim() === "" || passwordInput.value.trim() === "") {
    swal("Error!", "Please fill in both email and password.", "error");
    return;
  }

  // Check if the entered email exists in the user data
  let checkEmail = allUsersInfo.find((data) => data.email === emailInput.value);

  if (checkEmail !== undefined) {
    // Check if the entered password matches the stored password
    let checkPassword = allUsersInfo.find(
      (data) => data.password === passwordInput.value
    );

    if (checkPassword !== undefined) {
      // Update the login button's text to indicate processing
      loginBtn.innerText = "Processing....";

      // After a short delay, update the button text and display success message
      setTimeout(() => {
        loginBtn.innerText = "Login";
        swal("Login Success!", "Good job!", "success").then(() => {
          // Redirect to profile page
          window.location.href = "/profile/profile.html";
          // Remove the password from the user data before storing it in sessionStorage
          // for security reasons
          checkEmail.password = null;
          // Store the logged-in user data in sessionStorage
          sessionStorage.setItem("user", JSON.stringify(checkEmail));
        });

        // Clear all input fields
        allLoginInput.forEach((el) => {
          el.value = "";
        });

        // If you want redirect to profile page without using swal, uncomment the line below
        // window.location.href = "profile.html";
      }, 2000);
    } else {
      // Display an error message for incorrect password
      swal("Failed!", "Incorrect password.", "warning");
    }
  } else {
    // Display an error message if the email is not found
    swal("Failed!", "Email not found.", "warning");
  }
});
