var dropzone = document.getElementById('dropzone');
var dropzone_input = dropzone.querySelector('.dropzone-input');
var multiple = dropzone_input.getAttribute('multiple') ? true : false;

let global_uploaded_file;

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
  dropzone.addEventListener(event, function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropzone.addEventListener('dragover', function(e) {
  this.classList.add('dropzone-dragging');
  document.querySelector(".dropzone > span").style.color = "#fd2e7c";
  document.querySelector(".dropzone > i").style.color = "#fd2e7c";
}, false);

dropzone.addEventListener('dragleave', function(e) {
  this.classList.remove('dropzone-dragging');
  document.querySelector(".dropzone > span").style.color = "white";
  document.querySelector(".dropzone > i").style.color = "white";
}, false);

dropzone.addEventListener('drop', function(e) {
  this.classList.remove('dropzone-dragging');
  var files = e.dataTransfer.files;
  var dataTransfer = new DataTransfer();
  
  const uploaded_file = files[0]
  if(uploaded_file.type.match('image.*')) {
    global_uploaded_file = uploaded_file
    const url = URL.createObjectURL(uploaded_file)
    const dropzone_icon = document.querySelector('.dropzone-icon')
    dropzone_icon.src = url;
    dropzone_icon.style.borderRadius = '100px';
    
  }
  const submitButton_ = document.getElementById('submitButton');
  submitButton_.style.display = "flex";
  submitButton_.style.width = "20%";
}, false);

dropzone.addEventListener('click', function(e) {
  dropzone_input.click();
});

