// Get the required elements
var switchPartners = document.getElementById("switch_partners");
var partnersPage = document.getElementById("p_page");
var back_button = document.getElementById("back-map")
// Add a click event listener to the "switch_partners" element
switchPartners.addEventListener("click", function () {
  partnersPage.style.zIndex = "10000";
  partnersPage.style.display = "block";

});

back_button.addEventListener("click", function () {
  partnersPage.style.zIndex = "0";
  partnersPage.style.display = "none";

});