/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

import Bull from '@ioc:Rocketseat/Bull'
import Job from 'App/Jobs/RegisterGenre'

Bull.add(new Job().key, {
  
})

Route.get('/', async ({ view, response }) => {
  return response.redirect('/users/login')
})

Route.get("/users/login", "UsersController.index")
Route.get("/users/signup", "UsersController.create")
Route.post("/users/create", "UsersController.create_user")
Route.post('/users/login', 'UsersController.login')




Route.group(() => {
  Route.get('/users/profile_image', "UsersController.profile_image")
  Route.post('/users/profile_image/upload', 'ProfileImagesController.upload')
  Route.get('/homepage', 'HomePagesController.index')
  Route.get('/users/publish_game', 'GamesController.index')
  Route.post('/games/publish_game', 'GamesController.publish')
}).middleware(['auth'])

Route.get("/users/logout", "UsersController.logout")

