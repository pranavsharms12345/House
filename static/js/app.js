const form = document.getElementById("predictionForm");
const errorBox = document.getElementById("errorBox");
const button = document.getElementById("predictBtn");
const emptyState = document.getElementById("emptyState");
const resultState = document.getElementById("resultState");

const fields = {
  size: document.getElementById("houseSize"),
  bedrooms: document.getElementById("bedrooms"),
  bathrooms: document.getElementById("bathrooms"),
  floors: document.getElementById("floors")
};

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.add("show");
}
function clearError() {
  errorBox.textContent = "";
  errorBox.classList.remove("show");
}
function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const values = {
    "House Size (sqft)": Number(fields.size.value),
    "Number of Bedrooms": Number(fields.bedrooms.value),
    "Number of Bathrooms": Number(fields.bathrooms.value),
    "Number of Floors": Number(fields.floors.value)
  };

  if (Object.values(values).some(v => !Number.isFinite(v) || v <= 0)) {
    showError("Please enter valid values greater than 0 for all fields.");
    return;
  }

  button.classList.add("loading");
  button.querySelector("span:first-child").textContent = "Calculating...";
  button.disabled = true;

  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(values)
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Prediction failed.");
    }

    document.getElementById("price").textContent = formatINR(data.prediction);
    document.getElementById("summarySize").textContent = `${values["House Size (sqft)"].toLocaleString("en-IN")} sqft`;
    document.getElementById("summaryBedrooms").textContent = values["Number of Bedrooms"];
    document.getElementById("summaryBathrooms").textContent = values["Number of Bathrooms"];
    document.getElementById("summaryFloors").textContent = values["Number of Floors"];

    emptyState.classList.add("hidden");
    resultState.classList.remove("hidden");
  } catch (error) {
    showError(error.message);
  } finally {
    button.classList.remove("loading");
    button.querySelector("span:first-child").textContent = "Predict House Price";
    button.disabled = false;
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
  clearError();
  resultState.classList.add("hidden");
  emptyState.classList.remove("hidden");
  fields.size.focus();
});
