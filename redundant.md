// Function to format dates into dd-mm-yyyy
/\*\*

- @param {Date} date The date object to format
- @returns {string} The formatted date string
  \*/
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
const modal = document.getElementById("registerModal");
const closeBtn = document.querySelector(".b-modal-close-btn");

// Initialize or fetch booking data for the logged-in user
/\*_ @type {string} _/
const currentUser = userInfo.email.split("@")[0];

/\*_ @type {Array<Object>} _/
let allBookingData = JSON.parse(localStorage.getItem(`${currentUser}_bookingData`)) || [];

// Function to render the table
/\*\*

- Renders the table body with the booking data
  \*/
  const renderTable = () => {
  tbody.innerHTML = "";
  allBookingData.forEach((item, index) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `      <td>${index + 1}</td>
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
/\*\*

- @returns {boolean} true if all fields are valid, false otherwise
  \*/
  const validateForm = () => {
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
  return isValid;
  };

// Function to handle form submission for adding new bookings
form.addEventListener("submit", (e) => {
e.preventDefault();
if (!validateForm()) return;
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
allBookingData.push(data);
localStorage.setItem(`${currentUser}_bookingData`, JSON.stringify(allBookingData));
renderTable();
form.reset();
closeBtn.click();
});

// Function to delete a booking
/\*\*

- @param {number} index The index of the booking to delete
  \*/
  const deleteBooking = (index) => {
  swal({
  title: "Are you sure?",
  text: "Once deleted, you will not be able to recover this booking.",
  icon: "warning",
  buttons: true,
  dangerMode: true,
  }).then((willDelete) => {
  if (willDelete) {
  allBookingData.splice(index, 1);
  localStorage.setItem(`${currentUser}_bookingData`, JSON.stringify(allBookingData));
  renderTable();
  swal("Deleted!", "Your booking has been deleted successfully.", "success");
  }
  });
  };

// Function to edit a booking
/\*\*

- @param {number} index The index of the booking to edit
  \*/
  const editBooking = (index) => {
  const booking = allBookingData[index];
  Object.keys(booking).forEach((key) => {
  const input = form.querySelector(`[name="${key}"]`);
  if (input) input.value = booking[key];
  });
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.classList.add("d-none");
  const updateButton = form.querySelector('button[type="button"]');
  updateButton.classList.remove("d-none");
  updateButton.onclick = () => {
  if (!validateForm()) return;
  const updatedData = new FormData(form);
  Object.keys(booking).forEach((key) => {
  if (updatedData.has(key)) booking[key] = updatedData.get(key);
  });
  booking.createdAt = new Date();
  allBookingData[index] = booking;
  localStorage.setItem(`${currentUser}_bookingData`, JSON.stringify(allBookingData));
  renderTable();
  form.reset();
  updateButton.classList.add("d-none");
  submitButton.classList.remove("d-none");
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.hide();
  };
  };
