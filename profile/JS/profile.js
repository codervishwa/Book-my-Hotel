// Redirect to the index.html page if the user data is not found in the sessionStorage
if (sessionStorage.getItem("user") === null) {
  window.location.href = "/index.html";
}
// Get the logged-in user data from sessionStorage
const userInfo = JSON.parse(sessionStorage.getItem("user"));
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

// Function to format dates into dd-mm-yyyy
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Reference to the form, table body, modal, and modal close button

const form = document.querySelector(".booking-form");
const tbody = document.getElementById("bookingData");
const modal = document.getElementById("registerModal"); // Modal reference
const closeBtn = document.querySelector(".b-modal-close-btn");

// Initialize or fetch booking data for the logged-in user
/**
 * Unique identifier for the user (email address without domain)
 */
const currentUser = userInfo.email.split("@")[0];

/**
 * Array to store all booking data for the logged-in user
 */
let allBookingData =
  JSON.parse(localStorage.getItem(`${currentUser}_bookingData`)) || [];

// Function to render the table
/**
 * Renders the table body with the booking data
 */
const renderTable = () => {
  tbody.innerHTML = ""; // Clear table before rendering
  allBookingData.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.location}</td>
      <td>${item.roomNo}</td>
      <td>${item.fullname}</td>
      <td>${formatDate(item.checkIn)}</td>
      <td>${formatDate(item.checkOut)}</td>
      <td>${item.totalPeople}</td>
      <td>${item.mobile}</td>
      <td>${item.notice}</td>
      <td>${item.price}</td>
      <td>${formatDate(item.createdAt)}</td>
      <td>
        <button class="btn btn-primary" onclick="editBooking(${index})">
          <i class="fa fa-edit"></i>
        </button>
        <button class="btn btn-info">
          <i class="fa fa-check"></i>
        </button>
        <button class="btn btn-danger" onclick="deleteBooking(${index})">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// Render the table initially

renderTable();

// Function to validate form fields

const validateForm = () => {
  let isValid = true;
  const inputs = form.querySelectorAll("input, textarea"); // Get all form inputs and textarea
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.style.border = "2px solid red"; // Highlight empty field
      isValid = false;
    } else {
      input.style.border = ""; // Reset border if field is valid
    }
  });

  if (!isValid) {
    swal("Error!", "Please fill in all required fields.", "error"); // Show error message
  }
  return isValid;
};

// Function to handle form submission for adding new bookings

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate form fields
  if (!validateForm()) {
    return; // Exit if validation fails
  }

  // Collect form data
  const formData = new FormData(form);
  const data = {
    location: formData.get("location"),
    fullname: formData.get("fullname"),
    roomNo: formData.get("roomNo"),
    totalPeople: formData.get("totalPeople"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    price: formData.get("price"),
    mobile: formData.get("mobile"),
    notice: formData.get("notice"),
    createdAt: new Date(),
  };

  // Add data to the array and save to localStorage
  allBookingData.push(data);
  localStorage.setItem(
    `${currentUser}_bookingData`,
    JSON.stringify(allBookingData)
  );

  // Re-render the table, reset the form, and close the modal
  renderTable();
  form.reset();
  closeBtn.click();
});

// Function to delete a booking
const deleteBooking = (index) => {
  allBookingData.splice(index, 1); // Remove the selected booking
  localStorage.setItem(
    `${currentUser}_bookingData`,
    JSON.stringify(allBookingData)
  ); // Update localStorage
  renderTable(); // Re-render the table
};

// Function to edit a booking

const editBooking = (index) => {
  const booking = allBookingData[index];

  // Populate form fields with the booking data
  Object.keys(booking).forEach((key) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = booking[key];
  });

  // Show the modal programmatically
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();

  // Change button logic to update instead of add
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.classList.add("d-none");

  const updateButton = form.querySelector('button[type="button"]');
  updateButton.classList.remove("d-none");

  updateButton.onclick = () => {
    // Validate form fields
    if (!validateForm()) {
      return; // Exit if validation fails
    }

    // Update the booking data
    const updatedData = new FormData(form);
    Object.keys(booking).forEach((key) => {
      if (updatedData.has(key)) booking[key] = updatedData.get(key);
    });
    booking.createdAt = new Date(); // Update the timestamp

    // Update localStorage and re-render table
    allBookingData[index] = booking;
    localStorage.setItem(
      `${currentUser}_bookingData`,
      JSON.stringify(allBookingData)
    );
    renderTable();

    // Reset form and switch buttons
    form.reset();
    updateButton.classList.add("d-none");
    submitButton.classList.remove("d-none");
    bootstrapModal.hide(); // Hide modal after update
  };
};
