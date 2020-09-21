// const mongoose = require("mongoose");
// const eventsController = require("../../controllers/eventsController");

$(document).ready(function(){
    //set  document to listen for <td> hyperlink click and call for the event description linked to the same ID as the event title"
   $(document).on('click', "#eventLink",  function(){
      let currentTitle = $(this).html();
      let currentDescription = $(this).attr('data-attr');
     
      $(".modal-title").empty();
      $(".modal-body").empty();
      $(".modal-title").append("<h4>" + currentTitle + "</h4>");
      $(".modal-body").append("<p>" + currentDescription + "</p>");
    //   eventsController.findById()
      // .then(function(data) {
      //     console.log("Got the data:", data);
      //     $(".modal-body").append("<p>" + data.title +"</p>")
      // })

    //   $.ajax({
    //     url: "/api/events/:" + req.params.id,
    //     method: "GET"
    //   }).then(function(response) {
    //     console.log(response);
    //   });
  
    }); 

    window.addEventListener('load', function() {
      document.querySelector('input[type="file"]').addEventListener('change', function() {
          if (this.files && this.files[0]) {
              var img = document.querySelector("#myImg");  // $('img')[0]
              img.src = URL.createObjectURL(this.files[0]); // set src to blob url
              img.onload = imageIsLoaded;
          }
      });
    });

    function imageIsLoaded() { 
      alert(this.src);  // blob url
      // update width and height ...
  }

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
        $('#title').val(data.title);
        $('#date').val(data.date);
        $('#start').val(data.start);
        $('#end').val(data.end);
        $('#description').val(data.description);
        $('#action-button').html("<button id='updater' data-id='" + data._id + "'>Update</button>")
      });
    });

    // When user click's update button, update the specific note
$(document).on("click", "#updater", function() {
  // Save the selected element
  var selected = $(this);
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
      // Clear the inputs
       $('#title').val("");
       $('#date').val("");
       $('#start').val("");
       $('#end').val("");
       $('#description').val("");
      // Revert action button to submit
      $("#action-button").html("<button id='make-new'>Submit</button>");
      // Grab the results from the db again, to populate the DOM
      // getResults();
    }
  });

});
      //select the delete button to remove a event
      


  
});