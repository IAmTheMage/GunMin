const submitButton_ = document.getElementById('submitButton');
var dropzone = document.getElementById('dropzone');
var dropzone_input = dropzone.querySelector('#game_content');
var multiple = dropzone_input.getAttribute('multiple') ? true : false;

let dropzone_img_is_over = false

let global_uploaded_file;
let global_uploaded_img;

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
  dropzone.addEventListener(event, function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropzone.addEventListener('dragover', function(e) {
  this.classList.add('dropzone-dragging');
  document.querySelector(".dropzone > #drag_text").style.color = "#fd2e7c";
  document.querySelector(".dropzone > #game_icon").style.color = "#fd2e7c";
}, false);

dropzone.addEventListener('dragleave', function(e) {
  this.classList.remove('dropzone-dragging');
  document.querySelector(".dropzone > #drag_text").style.color = "white";
  document.querySelector(".dropzone > #game_icon").style.color = "white";
}, false);

dropzone.addEventListener('drop', function(e) {
  this.classList.remove('dropzone-dragging');
  var files = e.dataTransfer.files;
  var dataTransfer = new DataTransfer();
  
  const uploaded_file = files[0]
  dropzone.querySelector("#game_icon").remove()
  dropzone.querySelector("#drag_text").textContent = "Perfeito!!! Arquivo adicionado"
  const html = `<i class="fa-solid fa-circle-check fa-2xl" style="color: #fd2e7c;"></i>`
  dropzone.insertAdjacentHTML("afterbegin", html)
  global_uploaded_file = uploaded_file
  const submitButton_ = document.getElementById('submitButton');
  submitButton_.style.display = "flex";
  submitButton_.style.width = "20%";
}, false);

dropzone.addEventListener('click', function(e) {
  dropzone_input.click();
});



var dropzone_img = document.getElementById('dropzone_img');
var dropzone_input_img = dropzone.querySelector('#game_image');

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
  dropzone_img.addEventListener(event, function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropzone_img.addEventListener('dragover', function(e) {
  if(!dropzone_img_is_over) {
    this.classList.add('dropzone-dragging');
    document.querySelector("#dropzone_img > #drag_text_img").style.color = "#fd2e7c";
    document.querySelector("#dropzone_img > #game_icon_img").style.color = "#fd2e7c";
  }
}, false);

dropzone_img.addEventListener('dragleave', function(e) {
  if(!dropzone_img_is_over) {
    this.classList.remove('dropzone-dragging');
    document.querySelector("#dropzone_img > #drag_text_img").style.color = "white";
    document.querySelector("#dropzone_img > #game_icon_img").style.color = "white";
  }
}, false);

function removeChildrenExceptInput(element) {
  var children = element.children;

  for (var i = children.length - 1; i >= 0; i--) {
    var child = children[i];
    if (child.tagName.toLowerCase() !== 'input') {
      element.removeChild(child);
    }
  }
}


dropzone_img.addEventListener('drop', function(e) {
  e.preventDefault()
  
  this.classList.remove('dropzone-dragging');
  let files = e.dataTransfer.files;
  let dataTransfer = new DataTransfer();
  const uploaded_file = files[0]
  /*dropzone_img.querySelector("#game_icon_img").remove()
  dropzone_img.querySelector("#drag_text_img").textContent = "Perfeito!!! Arquivo adicionado"
  const html = `<i class="fa-solid fa-circle-check fa-2xl" style="color: #fd2e7c;"></i>`
  dropzone_img.insertAdjacentHTML("afterbegin", html)*/
  if(!dropzone_img_is_over) {
    removeChildrenExceptInput(dropzone_img)
  }
  dropzone_img_is_over = true
  global_uploaded_img = uploaded_file
  const file_url = URL.createObjectURL(uploaded_file)
  console.log(file_url)
  
  dropzone_img.style.backgroundImage = `url('${file_url}')`;
  dropzone_img.style.backgroundSize = 'cover';
}, false);

dropzone_img.addEventListener('click', function(e) {
  dropzone_input_img.click();
});


submitButton_.addEventListener('click', async (e) => {
  e.preventDefault()
  document.getElementById('loader').style.display = 'flex'
  submitButton_.style.display = 'none'
  const form = new FormData()
  console.log(global_uploaded_file)
  form.append("game", global_uploaded_file)
  form.append("game_image", global_uploaded_img)
  form.append("game_name", document.getElementById('game_name').value)
  form.append("genre", document.getElementById('genre_values').value)
  form.append("description", document.getElementById('description').value)
  form.append("parental_rating", document.getElementById('parental_rating').value)
  form.append("type", document.getElementById('game_inside_type').value)
  const res = await axios.post('/games/publish_game', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
  console.log(res)
})