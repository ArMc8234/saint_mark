/*This page contains all of the javascript functions for all of the pages
  1. Main page event display
  2. Event page
  3. Image upload */


  $(function(){

//================== Image Gallery =====================

  /*Create the ability for an authorized user to delete images from the image gallery.
    The images will be loaded to cards with an a-tag to open a larger version for viewing and a button to delete.
    The delete function must destroy the database record containing the url and use File System's unlink function
    to delete the image from the public folder. Maybe create a separate view for this?*/

    //select the delete button to remove an image

    $(document).on('click','#imageDelete', function(){
      console.log("Image Delete Selected!");
      //get the image's db ID
      const thisId = $(this).val();
      const thisURL = $(this).attr('attr');
      console.log("Image ID:", thisId);
      console.log("Image URL:", thisURL);
      // Send delete request to database
      //Delete image in the public folder
      removeFile(thisURL);
      removeGalleryRef(thisId);
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

  function removeFile(fileName){
    $.ajax({
      method: "DELETE",
      url: "api/upload/" + fileName
    }).then(function(data){
      console.log("You selected this S3 object for deletion: ", data);
   });
  }
    

  
});