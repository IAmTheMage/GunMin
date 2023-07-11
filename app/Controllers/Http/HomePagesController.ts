import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game';
import Drive from '@ioc:Adonis/Core/Drive'
import Encryption from '@ioc:Adonis/Core/Encryption'

export default class HomePagesController {

    public async index(ctx: HttpContextContract) {
        const { view } = ctx;
        const games = await Game.all()
        let games_object: any = [];
        games.forEach(async game => {
            const _href = Encryption.encrypt({id: game.id, name: game.name})
            const href = "http://localhost:3333/game/play/" + _href
            games_object.push({
                name: game.name, 
                description: game.description.substring(0, 100), 
                image_url: game.image_path,
                parental_rating: game.parental_rating == "free" ? "Livre" : game.parental_rating + " anos",
                type: game.type,
                href: game.type == 'play_in' ? href : `http://localhost:3333/uploads/games_zipped/${game.client_name}`,
                download: game.type == 'play_out' ? true : false,
                zip: game.client_name
            });
        })
        return view.render('homepage', {games: games_object})
    }

}
