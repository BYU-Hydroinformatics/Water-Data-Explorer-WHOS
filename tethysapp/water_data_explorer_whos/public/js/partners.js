// Get the required elements
var switchPartners = document.getElementById("switch_partners");
var partnersPage = document.getElementById("p_page");

// Add a click event listener to the "switch_partners" element
switchPartners.addEventListener("click", function () {
  // Remove the "display: none" style from the "partners_page" element
  partnersPage.style.zIndex = "10000";
  // Add the "display: none" style to the "map", "tableLegend", and "graph" elements

});

