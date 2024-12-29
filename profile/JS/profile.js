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
  if (!date) return ""; // Handle cases where the date is missing
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
const currentUser = userInfo.email.split("@")[0];

// Shared utility functions
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

// Generic function to get form data
const getFormData = (form) => {
  const formData = new FormData(form);
  return {
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
};

// Generic table render function
const renderTable = (data, tableBody, editFn, deleteFn) => {
  tableBody.innerHTML = "";
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
        <button class="btn btn-danger" onclick="${deleteFn}(${index})">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
};

// Generic function to handle form submission
const handleSubmit = (e, form, data, storageKey, renderFn, modalCloseBtn) => {
  e.preventDefault();
  if (!validateForm(form)) return;

  data.push(getFormData(form));
  localStorage.setItem(storageKey, JSON.stringify(data));
  renderFn();
  form.reset();
  modalCloseBtn.click();
};

// Generic function to handle edit
const handleEdit = (index, data, form, modal, submitBtn, updateBtn) => {
  const item = data[index];
  Object.keys(item).forEach((key) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input && item[key]) input.value = item[key];
  });

  submitBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");

  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
  return item;
};

// Generic function to handle update
const handleUpdate = (
  form,
  data,
  index,
  storageKey,
  renderFn,
  modal,
  submitBtn,
  updateBtn
) => {
  if (!validateForm(form)) return;

  data[index] = getFormData(form);
  localStorage.setItem(storageKey, JSON.stringify(data));
  renderFn();

  form.reset();
  submitBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
  bootstrap.Modal.getInstance(modal).hide();
};

// Generic function to handle delete
const handleDelete = (index, data, storageKey, renderFn) => {
  if (confirm("Are you sure you want to delete this record?")) {
    data.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(data));
    renderFn();
  }
};

// ----------------- Booking Tab -----------------
const bookingData =
  JSON.parse(localStorage.getItem(`${currentUser}_bookingData`)) || [];
const bookingForm = document.querySelector(".booking-form");
const bookingTbody = document.getElementById("bookingData");
const bookingModal = document.getElementById("registerModal");
const bookingCloseBtn = document.querySelector(".b-modal-close-btn");
const bookingSubmitBtn = bookingForm.querySelector('button[type="submit"]');
const bookingUpdateBtn = bookingForm.querySelector('button[type="button"]');
let currentBookingIndex = -1;

const renderBookingTable = () =>
  renderTable(bookingData, bookingTbody, "editBooking", "deleteBooking");

bookingForm.addEventListener("submit", (e) =>
  handleSubmit(
    e,
    bookingForm,
    bookingData,
    `${currentUser}_bookingData`,
    renderBookingTable,
    bookingCloseBtn
  )
);

const deleteBooking = (index) =>
  handleDelete(
    index,
    bookingData,
    `${currentUser}_bookingData`,
    renderBookingTable
  );

const editBooking = (index) => {
  currentBookingIndex = index;
  handleEdit(
    index,
    bookingData,
    bookingForm,
    bookingModal,
    bookingSubmitBtn,
    bookingUpdateBtn
  );
};

bookingUpdateBtn.addEventListener("click", () =>
  handleUpdate(
    bookingForm,
    bookingData,
    currentBookingIndex,
    `${currentUser}_bookingData`,
    renderBookingTable,
    bookingModal,
    bookingSubmitBtn,
    bookingUpdateBtn
  )
);

// ----------------- InHouse Tab -----------------
const inHouseData =
  JSON.parse(localStorage.getItem(`${currentUser}_inHouseData`)) || [];
const inHouseForm = document.querySelector(".in-house-form");
const inHouseTbody = document.getElementById("inHouseData");
const inHouseModal = document.getElementById("inHouseModal");
const inHouseCloseBtn = document.querySelector(".in-house-modal-close-btn");
const inHouseSubmitBtn = inHouseForm.querySelector('button[type="submit"]');
const inHouseUpdateBtn = inHouseForm.querySelector('button[type="button"]');
let currentInHouseIndex = -1;

const renderInHouseTable = () =>
  renderTable(inHouseData, inHouseTbody, "editInHouse", "deleteInHouse");

inHouseForm.addEventListener("submit", (e) =>
  handleSubmit(
    e,
    inHouseForm,
    inHouseData,
    `${currentUser}_inHouseData`,
    renderInHouseTable,
    inHouseCloseBtn
  )
);

const deleteInHouse = (index) =>
  handleDelete(
    index,
    inHouseData,
    `${currentUser}_inHouseData`,
    renderInHouseTable
  );

const editInHouse = (index) => {
  currentInHouseIndex = index;
  handleEdit(
    index,
    inHouseData,
    inHouseForm,
    inHouseModal,
    inHouseSubmitBtn,
    inHouseUpdateBtn
  );
};

inHouseUpdateBtn.addEventListener("click", () =>
  handleUpdate(
    inHouseForm,
    inHouseData,
    currentInHouseIndex,
    `${currentUser}_inHouseData`,
    renderInHouseTable,
    inHouseModal,
    inHouseSubmitBtn,
    inHouseUpdateBtn
  )
);

// Reset forms when modals are closed
bookingModal.addEventListener("hidden.bs.modal", () => {
  bookingForm.reset();
  bookingSubmitBtn.classList.remove("d-none");
  bookingUpdateBtn.classList.add("d-none");
  currentBookingIndex = -1;
});

inHouseModal.addEventListener("hidden.bs.modal", () => {
  inHouseForm.reset();
  inHouseSubmitBtn.classList.remove("d-none");
  inHouseUpdateBtn.classList.add("d-none");
  currentInHouseIndex = -1;
});

// Initial render
renderBookingTable();
renderInHouseTable();
