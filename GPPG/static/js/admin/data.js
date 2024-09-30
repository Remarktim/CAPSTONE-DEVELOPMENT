(function () {
  const { dataTable } = new HSDataTable("#hs-datatable-with-export");
  const buttons = document.querySelectorAll("#hs-dropdown-datatable-with-export .hs-dropdown-menu button");
  //
  const { dataTables } = new HSDataTable("#hs-datatable-with-column-filter");
  const personEl = document.querySelector("#hs-select-column-name");

  dataTables.search.fixed("range", function (searchStr, data, index) {
    const person = personEl.value === "all" ? "" : personEl.value;
    const name = data[1] || "";

    if (person === name || person === "") {
      return true;
    }
  });

  personEl.addEventListener("change", () => dataTable.draw());

  buttons.forEach((btn) => {
    const type = btn.getAttribute("data-hs-datatable-action-type");

    btn.addEventListener("click", () => dataTable.button(`.buttons-${type}`).trigger());
  });
})();
