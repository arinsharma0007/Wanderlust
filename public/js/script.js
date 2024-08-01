(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Tax-toggle switch

let taxSwitch = document.getElementById("flexSwitchCheckDefault");
let taxInfo = document.getElementsByClassName("tax-info");
let orgPrice = document.getElementsByClassName("orgPrice");

taxSwitch.addEventListener("click", () => {
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
  for (price of orgPrice) {
    if (price.style.display != "none") {
      price.style.display = "none";
    } else {
      price.style.display = "inline";
    }
  }
});
