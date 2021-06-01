//- This page contains all of the javascript functions for all of the Event page

$(function(){

  //==================== Main Page Parallax Display ===================
  const images=new Array('../images/StMarkBldg4.jpg','../images/smiling_group.jpg','../images/pexels-photo-4622580.jpeg');
  let nextimage=0;
  doSlideshow();
  
  function doSlideshow(){
      if(nextimage>=images.length){nextimage=0;}
      $('.parallax')
      .css('background-image','url("'+images[nextimage++]+'")')
      .fadeIn(5000,function(){
          setTimeout(doSlideshow,5000);
      });
  };
  //==================== Event Display ======================
      //MODAL DISPLAY
      //set  document to listen for <td> hyperlink click and call for the event description linked to the same ID as the event title"
      $(document).on('click', "#eventLink",  function(){
        let currentTitle = $(this).html();
        let currentDescription = $(this).attr('data-attr');
      
        $(".modal-title").empty();
        $(".modal-body").empty();
        $(".modal-title").append($('<h4>', {text: currentTitle}));
        $(".modal-body").append($('<p>', {text: currentDescription}));
      }); 

//==================== Event Edit Features ===========================

      //Get updated event data and display to the Saved Events table after a CRUD operation
      function getResults(){
        let html = "";
        $('#newEvents').append('<tr><th> Date </th><th> Start Time </th><th> End Time <th> Title </th><th></th>');
        $.ajax({
          method: "GET",
          url: "api/events",
        }).then(function(data){
          console.log("Getting Results!");
          console.table(data);
          for (let i = 0; i < data.length; i++) {
           //Create row for the event to add to the Saved Events table
            let announcement = (`
              <tr>
                <td>${data[i].date}</td>
                <td>${data[i].start}</td>
                <td>${data[i].end}</td>
                <td>${data[i].title}</td>
                <td><button class="btn btn-outline-primary" id="edit" type="#" value="${data[i]._id}"> Update </button>
                <span> </span>
                <button class="btn btn-outline-danger" id="delete" type="#" value="${data[i]._id}"> Delete </button>
              </tr>
            `);
            console.log(`announcements ${i}:, ${announcement}`);
            
            //append new event
            html += announcement;
            // $('#newEvents').append(announcement);
          }
          // console.log("HTML to add:", html)
          document.querySelector('#newEvents').innerHTML = html;
        });
      }

    //Clear the Event entry form fields after adding or updating an event
        function clearEventForm(){
          // Clear the inputs
          $('#title').val("");
          $('#date').val("");
          $('#start').val("");
          $('#end').val("");
          $('#description').val("");
        // Revert action button to submit
        $("#action-button").html("<button class='btn-primary' id='eventSubmit'>Submit</button>");
        // Grab the results from the db again, to populate the DOM
  
      }
  

  //Add new event from event form    
  $(document).on('click','#eventSubmit', function (event) {
    event.preventDefault();
    //Capture form data in an object
    const newEvent = {
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
      location.reload();
      console.log("Form Data Sent: ", data);
    });
  }); 



      //select the edit button to change an event
       $(document).on('click','#edit', function(){
        console.log("Edit Selected!");
        //get the event's db ID
        var thisId = $(this).val();
        console.log("ThisID:", thisId);
        // create input fields for each field of the event
        $.ajax({
          method: "GET",
          url: "api/events/" + thisId
        }).then(function(data){
          console.log("You clicked this event", data._id);
          //Changed format of date back to MM/DD/YY for display 
          let date = new Date(data.date);
          let newDate = new Intl.DateTimeFormat('en-Us', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          }).format(date);
          console.log("Date Control Date:", newDate);
          //Change date field type from 'date' to 'text' to inject the date field
          $('#date').attr('type', "text");
          $('#title').val(data.title);
          $('#date').val(newDate);
          $('#start').val(data.start);
          $('#end').val(data.end);
          $('#description').val(data.description);
          $('#action-button').html("<button id='updater' data-id='" + data._id + "'>Update</button>")
        });
      });


    
      // When user click's update button, update the specific note
  $(document).on("click", "#updater", function() {
    // Save the selected element
    const selected = $(this);
    // Make an AJAX POST request
    // This uses the data-id of the update button,
    // which is linked to the specific note title
    // that the user clicked before
    console.log("Update this ID:", selected.attr("data-id"));
    $.ajax({
      type: "PUT",
      url: "api/events/" + selected.attr("data-id"),
      dataType: "json",
      data: {
          title: $('#title').val().trim(),
          date: $('#date').val().trim(),
          start: $('#start').val().trim(),
          end: $('#end').val().trim(),
          description: $('#description').val().trim(),
        
      },
        // On successful call
        success: function(data) {
          //empties the Event form fields
          location.reload()
        }
      });
    });
  
      //select the delete button to remove an event
      $(document).on('click','#delete', function(){
        console.log("Delete Selected!");
        //get the event's db ID
        const thisId = $(this).val();
        console.log("ThisID:", thisId);
        // create input fields for each field of the event
        $.ajax({
          method: "DELETE",
          url: "api/events/" + thisId
        }).then(function(data){
          console.log("You deleted this event", data._id);
       });
      //  $('#newEvents').empty();
      //  getResults();
       location.reload()
      });

});