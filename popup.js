const fileBtn = document.forms.form.elements.fileBtn;
const form = document.forms.form;

const popupWindow = document.querySelector(".popup-window");
const progressLine = document.querySelector(".progress-line");
const progressText = document.querySelector(".progress-text");
const startBtn = document.querySelector(".startBtn i");
const progressInfo = document.querySelector(".progress-info");


form.addEventListener("submit", (e) => {
  e.preventDefault();
});

fileBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  if (!e.target.value) return;

  popupWindow.classList.add("show");
});



