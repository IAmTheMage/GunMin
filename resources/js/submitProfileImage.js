const submitButton_ = document.getElementById('submitButton');

submitButton_.addEventListener('click', async () => {
    const form = new FormData()
    form.append("profile_image", global_uploaded_file)
    await axios.post('/users/profile_image/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    window.location.replace('http://127.0.0.1:3333/homepage')
})