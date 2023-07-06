// Get the required elements
var switchPartners = document.getElementById("switch_partners");
var partnersPage = document.getElementById("partners_page");
var map = document.getElementById("map");
var tableLegend = document.getElementById("tableLegend");
var graph = document.getElementById("graph");

// Add a click event listener to the "switch_partners" element
switchPartners.addEventListener("click", function () {
  // Remove the "display: none" style from the "partners_page" element
  partnersPage.style.display = "";

  // Add the "display: none" style to the "map", "tableLegend", and "graph" elements
  map.style.display = "none";
  tableLegend.style.display = "none";
  graph.style.display = "none";
});

