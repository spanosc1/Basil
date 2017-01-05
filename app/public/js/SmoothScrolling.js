$(document).ready(function() {
	
	var NavbarHeight = $('nav').outerHeight();
	
	$('.slide-section').click(function(e) {
		
		var linkHref = $(this).attr('href');
		
		$('html, body').animate( {
		   scrollTop: $(linkHref).offset().top - 60
	    }, 1500);
	    
		e.preventDefault();
	
	});

});