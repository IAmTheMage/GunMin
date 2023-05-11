import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User';

export default class UsersController {
    public async index(ctx: HttpContextContract) {
        const { view, auth, response } = ctx;
        const isAuth = await auth.check();
        if(isAuth) {
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
        return ctx.view.render('profile_image')
    }

    public async logout(ctx: HttpContextContract) {
        const { auth, view } = ctx;
        await auth.logout();
        return view.render("login")
    }
}
