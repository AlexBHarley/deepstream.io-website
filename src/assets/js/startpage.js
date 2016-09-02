$(function(){
	var nameInput = $( '#book-a-meeting input.name' );
	var companyInput = $( '#book-a-meeting input.company' );
	var timeInput = $( '#book-a-meeting input.time' );
	var emailInput = $( '#book-a-meeting input.email' );
	var eventName = $( '#book-a-meeting span.event-name' );
	var data = $( '#book-a-meeting span.date' );
	var nameOutput = $( '#book-a-meeting span.name' );

	nameInput.keyup(function(){
		nameOutput.text( nameInput.val() );
	})
});

// $.ajax({
//   type: 'POST',
//   url: 'https://mandrillapp.com/api/1.0/messages/send.json',
//   data: {
//     key: 'whOPZ8jtpI1ZPE9EmCA6dw',
//     message: {
//       from_email: 'info@deepstream.io',
//       to: [
//           {
//             email: 'info@deepstreamhub.com',
//             type: 'to'
//           }
//         ],
//       autotext: true,
//       subject: 'event meeting request',
//       html: 'testcontent'
//     }
//   }
//  }).done(function(response) {
//    console.log(response); // if you're into that sorta thing
//  });