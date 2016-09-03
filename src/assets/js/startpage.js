$(function(){
	$('#events a button' ).click(function( e ){
		e.stopPropagation();
		e.preventDefault();
		$('.typeform-share').click()
	});
});
