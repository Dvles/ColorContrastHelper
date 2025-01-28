const foregroundInput = document.getElementById("foreground");
const backgroundInput = document.getElementById("background");
const checkButton = document.getElementById("checkContrast");
const contrastRatioOutput = document.getElementById("contrastRatio");

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

// Add event listener for button
checkButton.addEventListener("click", () => {
  const foreground = foregroundInput.value.replace("#", "");
  const background = backgroundInput.value.replace("#", "");
  const contrastRatio = getContrastRatio(foreground, background).toFixed(2);
  contrastRatioOutput.textContent = contrastRatio;

  // Provide WCAG compliance feedback
  const compliance = contrastRatio >= 4.5 ? "Pass" : "Fail";
  contrastRatioOutput.textContent += ` (${compliance})`;
});
