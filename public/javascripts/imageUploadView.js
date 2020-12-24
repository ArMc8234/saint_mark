/*This page contains all of the javascript functions for all of the pages
  1. Main page event display
  2. Event page
  3. Image upload */

  // import { createRequire } from 'module';
  // const require = createRequire(import.meta.url);
  // const fs = require('fs');

  //$(Document).ready(function(){}) has been deprecated and replaced with the following...
  $(function(){


   //======================== Image Upload Page ================================== 
 
   //Selects the form input field, then makes it invisible
    const gallery = document.querySelector('#previewGallery');
    // gallery.style.opacity = 0; 

    window.addEventListener('load', function() {
      document.querySelector('input[type="file"]').addEventListener('change', function() {
          console.table("files:", this.files);

          if (this.files){
            
             for(i=0; i < this.files.length; i++){
                   var img = $(`<img class="myImg-${i} rounded float-left" height='250' width='250'>`);
                   img.src = URL.createObjectURL(this.files[i]); // set src to blob url
                   $(img).attr("src", img.src);
                  //  var nameToAdd = "../images/uploads/" + this.files[i].name; //The image path must include relative path (../) to work in Heroku
                  //  imageArray.push(nameToAdd);
                   newCard = $('<div>');
                   newCard.append(img);
                   $('#previewGallery').append(newCard);
                   console.log(JSON.stringify(this.files[i]));
                  //  console.log(nameToAdd);
             }
             gallery.style.opacity = 1;
             $("#imageButton").html("<button id='make-new' class='btn btn-primary'>Submit</button>");
          }
      });
    });


  // const imageArray = [];
  
  const form = document.getElementsByTagName('form')[0];
  
  form.addEventListener('submit', function() {
    $("#previewGallery").empty();
  
  });
  
});