import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import User from 'App/Models/User';
const path = require('path'); 

export default class ProfileImagesController {
    public async upload(ctx: HttpContextContract) {
        const { auth, request, response } = ctx; 
        const user_id = auth.user?.id;
        const user = await User.findBy('id', user_id) || new User()
        const profile_image = request.file('profile_image')
        if(profile_image) {
            await profile_image.move(path.join(Application.tmpPath('uploads'), 'profile_images'))
            user.profile_image_path = profile_image.filePath || ''
            await user.save()
        }
        return true
    }
}
