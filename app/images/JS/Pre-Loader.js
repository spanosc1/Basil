// makes sure the whote site is loaded
$(window).on('load', function() {
   // will first fade out the loading animation 
   $('#Loader').delay(400).fadeOut('slow');
   // then will fade out the DIV that covers the website.
   $('#PreLoader').delay(1000).fadeOut('slow');  
   // after page loads this will make the navbar visible and fade it in
   $('#Navbar.hidden').fadeIn(1500).removeClass('hidden');
   // after page loaded this will add the in-view class to animation-element
   $('.first-animation').addClass('in-view'); 
})


