/*This page contains all of the javascript functions for all of the pages
  1. Main page event display
  2. Event page
  3. Image upload */

  // import { createRequire } from 'module';
  // const require = createRequire(import.meta.url);
  // const fs = require('fs');

  //$(Document).ready(function(){}) has been deprecated and replaced with the following...
  $(function(){

  //==================== Main Page Parallax Display ===================
  var images=new Array('../images/StMarkBldg4.jpg','../images/smiling_group.jpg','../images/pexels-photo-4622580.jpeg');
  var nextimage=0;
  doSlideshow();
  
  function doSlideshow(){
      if(nextimage>=images.length){nextimage=0;}
      $('.parallax')
      .css('background-image','url("'+images[nextimage++]+'")')
      .fadeIn(5000,function(){
          setTimeout(doSlideshow,5000);
      });
  }
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
        let html = "";
        $('#newEvents').append('<tr><th> Date </th><th> Start Time </th><th> End Time <th> Title </th><th></th>');
        $.ajax({
          method: "GET",
          url: "api/events",
        }).then(function(data){
          console.log("Getting Results!");
          console.table(data);
          for (let i = 0; i < data.length; i++) {
            //create event row
            // let date = new Date(data[i].date);
            // let newDate = new Intl.DateTimeFormat('en-Us').format(date);
            // console.log("time from database:", data[i].start);
            // let startTime = new Date('2020-01-01T'+ data[i].start );
            // let newStartTime = new Intl.DateTimeFormat('default', { 
            //   hour: 'numeric',
            //   minute: 'numeric',
            // }).format(startTime); 
            // console.log("newStartTime:", newStartTime);
  
            // // //Convert the date and time format for display
            // let endTime = new Date('2020-01-01T'+ data[i].end );
            // let newEndTime = new Intl.DateTimeFormat('default', { 
            //   hour: 'numeric',
            //   minute: 'numeric',
            // }).format(endTime); 
            // console.log("newStartTime:", newStartTime);
            // console.log("newEndTime:", newEndTime);
            
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
      location.reload();
      console.log("Form Data Sent: ", data);
      // clearEventForm();
      // //empties the table where events are displayed
      // $('#newEvents').empty();
      // //clears the event entry form
      // //Adds updated event data from the database and appends to the events table
      // getResults();
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
          // clearEventForm();
          // getResults()
          location.reload()
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
      //  $('#newEvents').empty();
      //  getResults();
       location.reload()
      });
  
    //================== Image Gallery =====================

  /*Create the ability for an authorized user to delete images from the image gallery.
    The images will be loaded to cards with an a-tag to open a larger version for viewing and a button to delete.
    The delete function must destroy the database record containing the url and use File System's unlink function
    to delete the image from the public folder. Maybe create a separate view for this?*/

    //select the delete button to remove an image

    $(document).on('click','#imageDelete', function(){
      console.log("Image Delete Selected!");
      //get the image's db ID
      var thisId = $(this).val();
      var thisURL = $(this).attr('attr');
      console.log("Image ID:", thisId);
      console.log("Image URL:", thisURL);
      // Send delete request to database
      //Delete image in the public folder
      removeGalleryRef(thisId);
      removeFile(thisURL);
      location.reload();
    });
   function removeGalleryRef(thisId){
     $.ajax({
       method: "DELETE",
       url: "api/galleries/" + thisId
     }).then(function(data){
       console.log("You deleted this image", data._id);
    });

   } 

  function removeFile(thisURL){
      $.ajax({
          method: "DELETE",
          url:  "api/upload" + thisURL,
        }).then(function(data){
         });
        console.log("You deleted this url");
    

  }
    

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
                   var img = $(`<img class="myImg-${i} rounded float-left" height='250' width='250'>`);
                   img.src = URL.createObjectURL(this.files[i]); // set src to blob url
                   $(img).attr("src", img.src);
                   var nameToAdd = "../images/uploads/" + this.files[i].name; //The image path must include relative path (../) to work in Heroku
                   imageArray.push(nameToAdd);
                   newCard = $('<div>');
                   newCard.append(img);
                   $('#previewGallery').append(newCard);
                   console.log(JSON.stringify(this.files[i]));
                   console.log(nameToAdd);
             }
             gallery.style.opacity = 1;
             $("#imageButton").html("<button id='make-new' class='btn btn-primary'>Submit</button>");
          }
      });
    });


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
  $("#previewGallery").empty();
  
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
  //+++++++++++++++++++++++++ S3 Image Upload +++++++++++++++++++
      /*
      Function to carry out the actual PUT request to S3 using the signed request from the app.
  //   */
  //  function uploadFile(file, signedRequest, url){
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('PUT', signedRequest);
  //   xhr.onreadystatechange = () => {
  //     if(xhr.readyState === 4){
  //       if(xhr.status === 200){
  //         document.getElementById('preview').src = url;
  //         document.getElementById('avatar-url').value = url;
  //       }
  //       else{
  //         alert('Could not upload file.');
  //       }
  //     }
  //   };
  //   xhr.send(file);
  // }

  // /*
  //   Function to get the temporary signed request from the app.
  //   If request successful, continue to upload the file using this signed
  //   request.
  // */
  // function getSignedRequest(file){
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  //   galleryCollection(`/sign-s3?file-name=${file.name}&file-type=${file.type}`)
  //   xhr.onreadystatechange = () => {
  //     if(xhr.readyState === 4){
  //       if(xhr.status === 200){
  //         const response = JSON.parse(xhr.responseText);
  //         uploadFile(file, response.signedRequest, response.url);
          
  //         console.log("Response url: ", response.url)
  //       }
  //       else{
  //         alert('Could not get signed URL.');
  //       }
  //     }
  //   };
  //   xhr.send();
  // }

  // /*
  //  Function called when file input updated. If there is a file selected, then
  //  start upload procedure by asking for a signed request from the app.
  // */
  // function initUpload(){
  //   const files = document.getElementById('file-input').files;
  //   const file = files[0];
  //   if(file == null){
  //     return alert('No file selected.');
  //   }
  //   getSignedRequest(file);
  // }

  // /*
  //  Bind listeners when the page loads.
  // */
  // (() => {
  //     document.getElementById('file-input').onchange = initUpload;
  // })();
  
  // //My code to save the url to the mongo db for retrieval
  // function galleryCollection(newUpload){
  //   $.ajax({
  //     method: "POST",
  //     url: "/api/galleries",
  //     data: newUpload,
  //   }).then(function (data) {
  //     console.table(data);
  //     // location.reload(true);
  //   });
  //   console.log("Gallery Data Sent");

  // }
  let imageKeys =[];
  var params = {
    Bucket: "stmarkfiles7", 
    MaxKeys: 100
  };
  s3.listObjectsV2(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data); 
    let imageInfo = data;
    imageKeys.push(imageInfo);
  });
  console.log("S3 data", imageKeys)
});