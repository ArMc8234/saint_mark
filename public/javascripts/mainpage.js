/*This page contains all of the javascript functions for all of the pages
  1. Main page event display
  2. Event page
  3. Image upload */
  
  $(document).ready(function(){

  //==================== Main Page Event Display ======================
      //MODAL DISPLAY
      //set  document to listen for <td> hyperlink click and call for the event description linked to the same ID as the event title"
      $(document).on('click', "#eventLink",  function(){
        let currentTitle = $(this).html();
        let currentDescription = $(this).attr('data-attr');
      
        $(".modal-title").empty();
        $(".modal-body").empty();
        $(".modal-title").append("<h4>" + currentTitle + "</h4>");
        $(".modal-body").append("<p>" + currentDescription + "</p>");
      }); 

//==================== Event Page ===========================

      //Get updated event data and display to the Saved Events table after a CRUD operation
      function getResults(){
        $.ajax({
          method: "GET",
          url: "api/events",
        }).then(function(data){
          console.log("Data after deletion!");
          console.table(data);
          $('#newEvents').append('<tr><th> Date </th><th> Start Time </th><th> End Time <th> Title </th><th></th>');
          for (i = 0; i < data.length; i++) {
            //create event row
            let date = new Date(data[i].date);
            let newDate = new Intl.DateTimeFormat('en-Us').format(date);
            console.log("time from database:", data[i].start);
            let startTime = new Date('2020-01-01T'+ data[i].start );
            let newStartTime = new Intl.DateTimeFormat('default', { 
              hour: 'numeric',
              minute: 'numeric',
            }).format(startTime); 
            console.log("newStartTime:", newStartTime);
  
            //Convert the date and time format for display
            let endTime = new Date('2020-01-01T'+ data[i].end );
            let newEndTime = new Intl.DateTimeFormat('default', { 
              hour: 'numeric',
              minute: 'numeric',
            }).format(endTime); 
            console.log("newStartTime:", newStartTime);
            console.log("newEndTime:", newEndTime);
            
            //Create row for the event to add to the Saved Events table
            let announcement = $('<tr><td>'+ newDate +'</td>'+'<td>'+ newStartTime +'</td>'+'<td>'+ newEndTime +'</td>'+'<td>'+data[i].title+'</td>'+'<td>'+'<button class="btn btn-outline-primary" id="edit" type="#" value="'+data[i]._id+'"> Update </button><span> </span> <button class="btn btn-outline-danger" id="delete" type="#" value="'+data[i]._id+'"> Delete </button></tr>');
            //append new event
          $('#newEvents').append(announcement);
          }
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
        $("#action-button").html("<button id='make-new'>Submit</button>");
        // Grab the results from the db again, to populate the DOM
  
      }
  

  //Add new event from event form    
  $('#submit').on('click', function (event) {
    event.preventDefault();
    //Capture form data in an object
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
      console.log("Form Data Sent");
      //empties the table where events are displayed
      $('#newEvents').empty();
      //clears the event entry form
      clearEventForm();
      //Adds updated event data from the database and appends to the events table
      getResults();
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
          //empties the Event form fields
          clearEventForm();
          getResults()
        }
      });
    });
  
      //select the delete button to remove an event
      $(document).on('click','#delete', function(){
        console.log("Delete Selected!");
        //get the event's db ID
        var thisId = $(this).val();
        console.log("ThisID:", thisId);
        // create input fields for each field of the event
        $.ajax({
          method: "DELETE",
          url: "api/events/" + thisId
        }).then(function(data){
          console.log("You deleted this event", data._id);
       });
       $('#newEvents').empty();
       getResults();
      });
  
  

    
  
  
    

   //======================== Image Upload Page ================================== 
    //Selects the form input field, then makes it invisible
    const gallery = document.querySelector('#previewGallery');
    // gallery.style.opacity = 0; 

    window.addEventListener('load', function() {
      document.querySelector('input[type="file"]').addEventListener('change', function() {
          console.table("files:", this.files);
          // if (this.files && this.files[0]) {
          //     var img = document.querySelector("#myImg");  // $('img')[0]
          //     img.src = URL.createObjectURL(this.files[0]); // set src to blob url
          //     img.onload = imageIsLoaded;
          //     $("#imageButton").html("<button id='make-new'>Submit</button>");
          // }
          if (this.files){
            
            for(i=0; i < this.files.length; i++){
              var img = document.querySelector(".myImg-" + i);  // $('img')[0]
                  img.src = URL.createObjectURL(this.files[i]); // set src to blob url
                  img.style.opacity = 1; 
                  var nameToAdd = "/images/uploads/" + this.files[i].name;
                  imageArray.push(nameToAdd);
                  console.log(JSON.stringify(this.files[i]));
                  // img.onload = imageIsLoaded;
                  // $("#imageButton").html("<button id='make-new'>Submit</button>");
              
            //   newPic = $("<img class='myImg' height='250' width='250'>");
              
            //   newPic.src = URL.createObjectURL(this.files[i]);
            //   $(newPic).attr("src", newPic.src);
            //   // newPic.onload = imageIsLoaded;
            //   console.log("Image" + [i] + ": ", newPic.src);
            //   imageArray.push(newPic.src);
            //   fileArray.push(this.files[i]);
            //   newCard = $("<div>");
            //   (newCard).append(newPic);
            //   $("#previewGallery").append(newCard);
            //   imageIsLoaded(newPic.src);
             }
             gallery.style.opacity = 1;
             $("#imageButton").html("<button id='make-new'>Submit</button>");
          }
      });
    });

  //   function imageIsLoaded(item) { 
  //     confirm("Would you like to upload " +  item);  // blob url
  //     // update width and height ...
  // }
  
  const imageArray = [];
  
  const form = document.getElementsByTagName('form')[0];
  form.addEventListener('submit', function() {
    for(i=0; i< imageArray.length; i++){
          var newUpload = {
            imageURL: imageArray[i]
            // date: date.now()
            
          }
          $.ajax({
            method: "POST",
            url: "/api/galleries",
            data: newUpload,
          }).then(function (data) {
            console.table(data);
            // location.reload(true);
          });
          console.log("Gallery Data Sent");
  }
});
  // const fileArray = [];

  // $(document).on('click', '#make-new', function (event) {
  //   event.preventDefault();

   
  //   // console.log("Ready to upload: ", newUpload);
  //   for(i=0; i< imageArray.length; i++){
  //     var newUpload = {
  //       imageURL: imageArray[i]
  //       // date: date.now()
        
  //     }
  //     $.ajax({
  //       method: "POST",
  //       url: "/api/galleries",
  //       data: newUpload,
  //     }).then(function (data) {
  //       console.table(data);
  //       // location.reload(true);
  //     });
  //     console.log("Gallery Data Sent");

  //   }

  //   for(j=0; j < fileArray.length; j++) {
  //     var newFile = fileArray[j];
  //   let newFile = $('#newImages').val().trim();

  //     $.ajax({
  //       method: "POST",
  //       url: "api/upload",
  //       data:  newFile ,
  //       processData: false,
  //       contentType: false,
  //       name: "image",
  //       encType: "multipart/form-data",
  //     }).then(function (data) {
  //       console.table(data);
  //       // location.reload(true);
  //     });
  //     console.log("Upload Data Sent", newFile);
  //   }
    
  // }); 


 



  
});