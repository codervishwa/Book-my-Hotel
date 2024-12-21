let allUsersInfo = [];
let regForm = document.querySelector(".reg-form");
let allInput = document.querySelectorAll("input");

if (localStorage.getItem("allUsersInfo") !== null) {
  allUsersInfo = JSON.parse(localStorage.getItem("allUsersInfo"));
}

regForm.onSubmit = (e) => {
  e.preventDefault();
  let checkEmail = allUsersInfo.find(
    (data) => data.email === allInput[4].value
  );
  if (checkEmail === undefined) {
    let data = {};
    for (let el of allInput) {
      let key = el.name;
      data[key] = el.value;
    }
    allUsersInfo.push(data);
    localStorage.setItem("allUsersInfo", JSON.stringify(allUsersInfo));
    swal("Good Job!", "Registration Success", "success");
  } else {
    swal("Failed !", "Email already registered !", "warning");
  }
};
