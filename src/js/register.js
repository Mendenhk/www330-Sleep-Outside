import Alert from "./Alert.js";
import ExternalServices from "./ExternalServices.mjs";
import {
  alertMessage,
  loadHeaderFooter,
  removeAllAlerts,
  setLocalStorage,
} from "./utils.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const user = {};

  formData.forEach((value, key) => {
    if (!(value instanceof File)) {
      user[key] = value.trim();
    }
  });

  return user;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function showFormError(message) {
  removeAllAlerts();
  alertMessage(message);
}

function cleanServiceError(error) {
  if (!error || !error.message) return "Please try again.";

  return typeof error.message === "string"
    ? error.message
    : JSON.stringify(error.message);
}

const services = new ExternalServices();
const accountAlert = new Alert();
const accountForm = document.querySelector(".account-form");
const avatarInput = document.querySelector("#avatar");
const avatarPreview = document.querySelector(".avatar-preview__image");
let avatarFile = null;

loadHeaderFooter();

avatarInput.addEventListener("change", async (event) => {
  const [file] = event.target.files;

  if (!file) {
    avatarFile = null;
    avatarPreview.src = "../images/category-backpacks.svg";
    return;
  }

  if (!file.type.startsWith("image/")) {
    showFormError("Please choose an image file for your avatar.");
    avatarInput.value = "";
    return;
  }

  try {
    avatarFile = file;
    avatarPreview.src = await fileToDataUrl(file);
  } catch (error) {
    showFormError("We could not load that avatar image.");
  }
});

accountForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  removeAllAlerts();

  if (!accountForm.checkValidity()) {
    accountForm.reportValidity();
    return;
  }

  const formData = formDataToJSON(accountForm);

  if (formData.password !== formData["confirm-password"]) {
    showFormError("Passwords must match.");
    return;
  }

  const user = {
    fname: formData["first-name"],
    lname: formData["last-name"],
    email: formData.email,
    password: formData.password,
    street: formData["street-address"],
    city: formData.city,
    state: formData.state,
    zip: formData.zip,
  };

  if (avatarFile) {
    user.avatar = {
      name: avatarFile.name,
      type: avatarFile.type,
    };
  }

  try {
    const createdUser = await services.createUser(user);
    setLocalStorage("so-user", createdUser);
    accountForm.reset();
    avatarFile = null;
    avatarPreview.src = "../images/category-backpacks.svg";
    accountAlert.renderAlerts([
      {
        message: "Account created successfully. You can now shop faster.",
        background: "#e7f5d8",
        color: "#303030",
        type: "success",
      },
    ]);
  } catch (error) {
    showFormError(
      `There was a problem creating your account: ${cleanServiceError(error)}`,
    );
  }
});
