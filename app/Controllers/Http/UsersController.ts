import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User';

export default class UsersController {
    public async index(ctx: HttpContextContract) {
        const { view } = ctx;
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

    public async profile_image(ctx: HttpContextContract) {
        return ctx.view.render('profile_image')
    }
}
