$(document).ready(function () {

    
   
    $('#submit').on('click', function (event) {
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
          // location.reload(true);
        });
        console.log("Form Data Sent");
  
      });

      //select the edit button to change an event
      $(document).on('click','#edit', function(){
        console.log("Edit Selected!");
        // //get the event's db ID
        // var thisId = $(this).event.id;

        // //create input fields for each field of the event
        // $.ajax({
        //   method: "GET",
        //   url: "api/events" + thisId
        // }).then(function(data){
        //   console.log("You clicked this event", data.title)
        });
        //select the delete button to remove a event
    });
  
  
  
  
  
  
  