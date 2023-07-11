import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Genre from 'App/Models/Genre';
import User from 'App/Models/User';

export default class UsersController {
    public async index(ctx: HttpContextContract) {
        const { view, auth, response } = ctx;
        console.log(auth.user?.id)
        if(auth.user?.id) {
            return response.redirect('/users/profile_image')
        }
        return view.render("login")
    }

    public async create(ctx: HttpContextContract) {
        const { view } = ctx;
        return view.render("create_user")
    }

    public async create_user(ctx: HttpContextContract) {
        const create_schema = schema.create({
            email: schema.string([
                rules.email(),
            ]),
            password: schema.string([
                rules.minLength(8)
            ])
        })
        const { request } = ctx
        try {
            await request.validate({
                schema: create_schema
            })
        }
        catch(err) {
            return err;
        }
        const data = request.body()
        const user = new User()
        user.email = data.email;
        user.password = data.password;
        user.username = data.username;
        await user.save()
        user.password = ""
        return user
    }

    public async login(ctx: HttpContextContract) {
        const { request, auth } = ctx;
        const data = request.body();
        await auth.attempt(data.email, data.password);
        return ctx.response.redirect("/users/profile_image")
    }

    public async profile_image(ctx: HttpContextContract) {
        const { auth } = ctx;
        const profile_image = (await User.findBy('id', auth.user?.id) || new User()).profile_image_path
        
        if(profile_image != null) {
            console.log(profile_image)
            const id = auth.user?.id
            const user = await User.findBy('id', id) || new User()
            const findedGenres = await Genre.query().where('id', '>', '0');
            let processedGenres: any = [];
            findedGenres.forEach(genre => {
                processedGenres.push({
                    name: genre.name,
                    slug: genre.slug,
                    id: genre.id
                })
            })
            return ctx.view.render('publish_game', {
                genres: processedGenres,
                username: user.username,
                email: user.email
            })
        }
        return ctx.view.render('profile_image')
    }

    public async logout(ctx: HttpContextContract) {
        const { auth, view } = ctx;
        await auth.logout();
        return view.render("login")
    }
}
