  ///// Hexagrid Parameters /////
  var hexSize = 40; // Taille d'un hexagone en pixels
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  var gridSizeX = Math.floor(screenWidth / hexSize)+1;
  var gridSizeY = Math.floor(screenHeight / hexSize);
console.log(gridSizeX);
  // Create hexagrid //
  var hexContainer = document.getElementById('hex-container');
  console.log(document);
  for (var i = 0; i < gridSizeY; i++) {
    var row = document.createElement('div');
    row.className = 'row';
    for (var j = 0; j < gridSizeX; j++) {
      var hex = document.createElement('div');
      hex.className = 'hex';
      row.appendChild(hex);
    }
    if (i % 2 === 1) {
      row.style.marginLeft = hexSize / 2 + 'px';
    }
    hexContainer.appendChild(row);
  }
///// Mouse cursor /////
  var cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', function(event) {
cursor.style.left = event.clientX + 'px';
cursor.style.top = event.clientY + 'px';
});


///// Tools /////
// const menuIcon = document.getElementById("toolbox");
//   const sidebar = document.getElementById("menu-icon");

//   menuIcon.addEventListener("click", toggleSidebar);

//   function toggleSidebar() {
//       sidebar.classList.toggle("sidebar-visible");
//   }
//   /// Show Table


