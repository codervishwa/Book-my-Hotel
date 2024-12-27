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

// ------------------------------------------------------------------------------------Datatable------------------------------------------------------------------------------------------------------
// Common tables for booking and In house Data with different data and different storage keys

// Function to format dates into dd-mm-yyyy
const formatDate = (date) => {
  if (!date) return ""; // Handle cases where the date is missing
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Initialize user information

const currentUser = userInfo.email.split("@")[0]; // Unique identifier for the user

// Generic function to render a table
const renderTable = (data, tableBody, editFn, deleteFn) => {
  tableBody.innerHTML = ""; // Clear table
  data.forEach((item, index) => {
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
        <button class="btn btn-primary" onclick="${editFn}(${index})">
          <i class="fa fa-edit"></i>
        </button>
        <button class="btn btn-info">
           <i class="fa fa-check"></i>
         </button>
        <button class="btn btn-danger" onclick="${deleteFn}(${index})">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
};

// Generic function to validate form fields
const validateForm = (form) => {
  let isValid = true;
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.style.border = "2px solid red";
      isValid = false;
    } else {
      input.style.border = "";
    }
  });
  if (!isValid) alert("Please fill out all required fields!");
  return isValid;
};

// Generic function to handle form submission
const handleFormSubmit = (
  e,
  form,
  data,
  storageKey,
  renderFn,
  modalCloseBtn
) => {
  e.preventDefault();
  if (!validateForm(form)) return;

  const formData = new FormData(form);
  const newData = {
    location: formData.get("location"),
    fullname: formData.get("fullname"),
    roomNo: formData.get("roomNo"),
    totalPeople: formData.get("totalPeople"),
    checkIn: formData.get("checkIn") || null,
    checkOut: formData.get("checkOut") || null,
    price: formData.get("price"),
    mobile: formData.get("mobile"),
    notice: formData.get("notice"),
    createdAt: new Date(),
  };

  data.push(newData);
  localStorage.setItem(storageKey, JSON.stringify(data));
  renderFn();
  form.reset();
  modalCloseBtn.click();
};

// Generic function to delete data
const deleteData = (index, data, storageKey, renderFn) => {
  data.splice(index, 1);
  localStorage.setItem(storageKey, JSON.stringify(data));
  renderFn();
};

// Generic function to edit data
const editData = (index, data, form, modal, storageKey, renderFn) => {
  const item = data[index];
  Object.keys(item).forEach((key) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = item[key];
  });

  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();

  const submitButton = form.querySelector('button[type="submit"]');
  const updateButton = form.querySelector('button[type="button"]');
  submitButton.classList.add("d-none");
  updateButton.classList.remove("d-none");

  updateButton.onclick = () => {
    if (!validateForm(form)) return;

    const updatedData = new FormData(form);
    Object.keys(item).forEach((key) => {
      if (updatedData.has(key)) item[key] = updatedData.get(key);
    });
    item.createdAt = new Date();

    data[index] = item;
    localStorage.setItem(storageKey, JSON.stringify(data));
    renderFn();
    form.reset();
    updateButton.classList.add("d-none");
    submitButton.classList.remove("d-none");
    bootstrapModal.hide();
  };
};

// ----------------- Booking Tab -----------------
const bookingData =
  JSON.parse(localStorage.getItem(`${currentUser}_bookingData`)) || [];
const bookingForm = document.querySelector(".booking-form");
const bookingTbody = document.getElementById("bookingData");
const bookingModal = document.getElementById("registerModal");
const bookingCloseBtn = document.querySelector(".b-modal-close-btn");

const renderBookingTable = () => {
  renderTable(bookingData, bookingTbody, "editBooking", "deleteBooking");
};

bookingForm.addEventListener("submit", (e) =>
  handleFormSubmit(
    e,
    bookingForm,
    bookingData,
    `${currentUser}_bookingData`,
    renderBookingTable,
    bookingCloseBtn
  )
);
const deleteBooking = (index) =>
  deleteData(
    index,
    bookingData,
    `${currentUser}_bookingData`,
    renderBookingTable
  );
const editBooking = (index) =>
  editData(
    index,
    bookingData,
    bookingForm,
    bookingModal,
    `${currentUser}_bookingData`,
    renderBookingTable
  );

renderBookingTable();

// ----------------- InHouse Tab -----------------
const inHouseData =
  JSON.parse(localStorage.getItem(`${currentUser}_inHouseData`)) || [];
const inHouseForm = document.querySelector(".in-house-form");
const inHouseTbody = document.getElementById("inHouseData");
const inHouseModal = document.getElementById("inHouseModal");
const inHouseCloseBtn = document.querySelector(".in-house-modal-close-btn");

const renderInHouseTable = () => {
  renderTable(inHouseData, inHouseTbody, "editInHouse", "deleteInHouse");
};

inHouseForm.addEventListener("submit", (e) =>
  handleFormSubmit(
    e,
    inHouseForm,
    inHouseData,
    `${currentUser}_inHouseData`,
    renderInHouseTable,
    inHouseCloseBtn
  )
);
const deleteInHouse = (index) =>
  deleteData(
    index,
    inHouseData,
    `${currentUser}_inHouseData`,
    renderInHouseTable
  );
const editInHouse = (index) =>
  editData(
    index,
    inHouseData,
    inHouseForm,
    inHouseModal,
    `${currentUser}_inHouseData`,
    renderInHouseTable
  );

renderInHouseTable();
