// popup
document.querySelectorAll('.container img').forEach(images => {
  images.onclick =() => {
      document.querySelector('.popup-container').style.display = 'block';
      document.querySelector('.popup-container img').src = images.getAttribute('src');
      document.body.style.cssText = 'overflow:hidden';
      let parent = images.parentNode.parentNode.parentNode;
      let placeName = parent.childNodes[1].childNodes[3].childNodes[1].innerHTML;
      let shortIntroduction = parent.childNodes[1].childNodes[3].childNodes[3].innerHTML;
      let hiddenData = parent.childNodes[1].childNodes[3].childNodes[5].childNodes;
      let location = hiddenData[1].innerHTML;
      let temperature = hiddenData[3].innerHTML;
      let turbidity = hiddenData[5].innerHTML;
      let totalDissolvedSolids = hiddenData[7].innerHTML;
      let electricalConductivity = hiddenData[9].innerHTML;
      let pH = hiddenData[11].innerHTML;
      let date = hiddenData[13].innerHTML;
      document.getElementById("popup-placeName").innerHTML = placeName;
      document.getElementById("popup-location").innerHTML = "Location: " + location;
      document.getElementById("popup-shortIntroduction").innerHTML = shortIntroduction;
      document.getElementById("popup-temperature").innerHTML = temperature;
      document.getElementById("popup-tu").innerHTML = turbidity;
      document.getElementById("popup-tds").innerHTML = totalDissolvedSolids;
      document.getElementById("popup-ec").innerHTML = electricalConductivity;
      document.getElementById("popup-pH").innerHTML = pH;
      document.getElementById("popup-date").innerHTML = date;
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