window.addEventListener("load", () => {
  const patches = [
    {actual: true, predicted: true},
    {actual: true, predicted: false},
    {actual: false, predicted: true}
  ];
  var tab_list = document.querySelector(".tab_list");
  var lis = tab_list.querySelectorAll("li");

  for (var i = 0; i < lis.length; i++) {
    lis[i].setAttribute("index", i);
    lis[i].onclick = (i => function() {
      for (let x = 0; x < lis.length; x++) {
        lis[x].className = "";
      }
      this.className = "current";
      mainState = { ...mainState, ...patches[i] };
      updatePlot(mainState);
    })(i);
  }
});
