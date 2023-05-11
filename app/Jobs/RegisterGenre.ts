import { JobContract } from '@ioc:Rocketseat/Bull'
import Genre from 'App/Models/Genre';

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class RegisterGenre implements JobContract {
  public key = 'RegisterGenre'

  public async handle(job) {
    const { data } = job
    const gameGenres = [
      {name: 'First Person Shooters (FPS Games)', slug: 'fps-games'},
      {name: 'Role Playing Games (RPG Games)', slug: 'rpg-games'},
      {name: 'Adventure', slug: 'adventure'},
      {name: 'Simulation', slug: 'simulation'},
      {name: 'Strategy', slug: 'strategy'},
      {name: 'Sports & Fitness', slug: 'sports-fitness'},
      {name: 'Fighting', slug: 'fighting'},
      {name: 'Platformers', slug: 'platformers'},
      {name: 'Survival & Horror', slug: 'survival-horror'},
      {name: 'Stealth', slug: 'stealth'},
      {name: 'Interactive Movie', slug: 'interactive-movie'},
      {name: 'Puzzlers & Party Games', slug: 'puzzlers-party-games'},
      {name: 'Social Deduction', slug: 'social-deduction'},
      {name: 'Educational', slug: 'educational'},
      {name: 'Augmented Reality', slug: 'augmented-reality'}
    ];
    const count = (await Genre.query().where('id', '>', '0')).length
    if(count == 0) {
      gameGenres.map(async genr => {
        const genre = new Genre()
        genre.name = genr.name;
        genre.slug = genr.slug;
        await genre.save()
      })  
    }
  }
}
