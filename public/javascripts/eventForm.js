$(document).ready(function () {

    
   
    $('.btn').on('click', function (event) {
        event.preventDefault();

        
        var newEvent = {
          title: $('#title').val().trim(),
          date: $('#date').val().trim(),
          start: $('#start').val().trim(),
          end: $('#end').val().trim(),
          description: $('#description').val().trim(),
        }
        console.log(newEvent);
        $.ajax({
          method: "POST",
          url: "/api/events",
          data: newEvent,
        }).then(function (data) {
          console.log(data);
          location.reload(true);
        });
        console.log("Form Data Sent");
  
  
    });
  
  
  
  
  
  
  });