// popup
document.querySelectorAll('.container img').forEach(images => {
  images.onclick =() => {
      document.querySelector('.popup-container').style.display = 'block';
      document.querySelector('.popup-container img').src = images.getAttribute('src');
      document.body.style.cssText = 'overflow:hidden';
      let parent = images.parentNode.parentNode.parentNode;
      let placeName = parent.childNodes[1].childNodes[3].childNodes[1].innerHTML;
      let hiddenData = parent.childNodes[1].childNodes[3].childNodes[3].childNodes;
      let latitude = hiddenData[1].innerHTML;
      let longitude = hiddenData[3].innerHTML;
      let location = hiddenData[5].innerHTML;
      let temperature = hiddenData[7].innerHTML;
      let turbidity = hiddenData[9].innerHTML;
      let totalDissolvedSolids = hiddenData[11].innerHTML;
      let electricalConductivity = hiddenData[13].innerHTML;
      let pH = hiddenData[15].innerHTML;
      let date = hiddenData[17].innerHTML;
      let level = hiddenData[19].innerHTML;
      document.getElementById("popup-placeName").innerHTML = placeName;
      document.getElementById("popup-location").innerHTML = "Location: " + location;
      document.getElementById("popup-latitude-longitude").innerHTML = "(" + latitude + ", " + longitude + ")";
      document.getElementById("popup-temperature").innerHTML = temperature;
      document.getElementById("popup-tu").innerHTML = turbidity;
      document.getElementById("popup-tds").innerHTML = totalDissolvedSolids;
      document.getElementById("popup-ec").innerHTML = electricalConductivity;
      document.getElementById("popup-pH").innerHTML = pH;
      document.getElementById("popup-date").innerHTML = date;
      document.getElementById("popup-level").innerHTML = "Water Quality Level: " + level;
  }
});

document.querySelector('.popup #close').onclick = () => {
  document.querySelector('.popup-container').style.display = 'none';
  document.body.style.cssText = 'overflow:auto';
}



// type clssification
(function ($) {

    $('.filter ul li').click(function(){
      $('.filter ul li').removeClass('active');
      $(this).addClass('active');
      
      var data = $(this).attr('data-filter');
      $grid.isotope({
        filter: data
      })
    });

    var $grid = $(".grid").isotope({
      itemSelector: ".all",
      percentPosition: true,
      masonry: {
        columnWidth: ".all"
      }
    })

})(window.jQuery);