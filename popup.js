const foregroundInput = document.getElementById("foreground");
const backgroundInput = document.getElementById("background");
const checkButton = document.getElementById("checkContrast");
const contrastRatioOutput = document.getElementById("contrastRatio");
const modeFilterBtns = document.querySelectorAll("#mode-filter button");
const divAuto = document.getElementById("auto");
const divManual = document.getElementById("manual");
const contributeBtn = document.getElementById("contribute");
const autoForegroundInput = document.getElementById("autoForeground");
const autoBackgroundInput = document.getElementById("autoBackground");
const autoContrastRatioOutput = document.getElementById("autoContrastRatio");
const autoComplianceOutput = document.getElementById("autoCompliance");

console.log(modeFilterBtns);

// Function to toggle extension modes
modeFilterBtns.forEach(button => {
  button.addEventListener("click", () => {
    modeFilterBtns.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    divManual.classList.toggle("hidden");
    divAuto.classList.toggle("hidden");

    console.log("Active mode:", button.textContent);

    if (button.textContent.toLowerCase() === "auto") {
      autoAnalyzeColorContrast();
    }
  });
});

// Redirect to GitHub
contributeBtn.addEventListener("click", () => {
  window.open("https://github.com/Dvles/ColorContrastHelper", "_blank");
});

// Function to calculate relative luminance
function getLuminance(color) {
  const rgb = color.match(/\w\w/g).map((c) => parseInt(c, 16) / 255);
  const adjusted = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2];
}

// Function to calculate contrast ratio
function getContrastRatio(foreground, background) {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// Function to get the computed color styles of the page's body and background
function getColorFromPage() {
  const bodyColor = window.getComputedStyle(document.body).color;
  const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;

  console.log("Body color: ", rgbToHex(bodyColor)); // Log the foreground color (text color)
  console.log("Body background color: ", rgbToHex(bodyBackgroundColor)); // Log the background color

  return { 
    foreground: rgbToHex(bodyColor), 
    background: rgbToHex(bodyBackgroundColor)
  };
}

// Function to convert RGB color to Hex format
function rgbToHex(rgb) {
  let result = rgb.match(/\d+/g);  // Get the numbers from the RGB string
  if (result) {
    return `#${((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1)}`;
  }
  return "#000000"; // Return black as fallback if conversion fails
}

// Function to automatically fetch and analyze color contrast for auto mode
function autoAnalyzeColorContrast() {
  const { foreground, background } = getColorFromPage();
  if (foreground && background) {
    // Set the values of the inputs (this will reflect in the UI)
    autoForegroundInput.value = foreground;
    autoBackgroundInput.value = background;

    // Calculate contrast ratio
    const contrastRatio = getContrastRatio(foreground.replace("#", ""), background.replace("#", "")).toFixed(2);
    autoContrastRatioOutput.textContent = contrastRatio;

    // Provide WCAG compliance feedback
    const compliance = contrastRatio >= 4.5 ? "Pass" : "Fail";
    autoComplianceOutput.textContent = `Compliance: ${compliance}`;
  } else {
    console.error("Could not extract valid colors from the page.");
  }
}

// Automatically trigger color analysis when switching to 'auto' mode
if (divAuto && !divAuto.classList.contains('hidden')) {
  autoAnalyzeColorContrast();
}
