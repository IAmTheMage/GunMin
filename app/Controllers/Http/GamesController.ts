import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GamesController {
    public async index(ctx: HttpContextContract) {
        const { view } = ctx;
        return view.render('publish_game')
    }
}
