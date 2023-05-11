import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomePagesController {

    public async index(ctx: HttpContextContract) {
        const { view } = ctx;
        return view.render('homepage')
    }

}
