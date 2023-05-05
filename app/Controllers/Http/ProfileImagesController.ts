import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProfileImage from 'App/Models/ProfileImage';
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import User from 'App/Models/User';
const path = require('path'); 

export default class ProfileImagesController {
    public async upload(ctx: HttpContextContract) {
        const { auth, request, response } = ctx; 
        const user_id = auth.user?.id;
        const user = await User.findBy('id', user_id)
        const profile = new ProfileImage()
        const profile_image = request.file('profile_image')
        if(profile_image) {
            await profile_image.move(path.join(Application.tmpPath('uploads'), 'profile_images'))
            profile.path = profile_image.filePath || ""
            await profile.save()
            await profile.related('user').associate(user || new User())
        }
        return true
    }
}
