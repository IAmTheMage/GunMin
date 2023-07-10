const Sentencer = require('sentencer')

function generateRandomDate(startDate, endDate) {
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp;
  return new Date(randomTimestamp);
}

function formatarDataSQL(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const knex = require('knex') ({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 15432,
        user: 'postgres',
        password: 'Postgres2019!',
        database: 'test_3'
    }
})

let kp;

size = process.argv[2] || 100


function generateRandomCNPJ() {
    var n = [];
    for (var i = 0; i < 12; i++) {
      n.push(Math.floor(Math.random() * 10));
    }
  
    var d1 = n[11] * 2 + n[10] * 3 + n[9] * 4 + n[8] * 5 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) {
      d1 = 0;
    }
  
    var d2 = d1 * 2 + n[11] * 3 + n[10] * 4 + n[9] * 5 + n[8] * 6 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) {
      d2 = 0;
    }
  
    n.push(d1, d2);
  
    return n.join('');
  }

function generateRandomCPF() {
    const cpfNumbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    // Calcula o primeiro dígito verificador
    let sum = cpfNumbers.reduce((acc, value, index) => acc + value * (10 - index), 0);
    let firstDigit = sum % 11;
    firstDigit = firstDigit < 2 ? 0 : 11 - firstDigit;
    
    cpfNumbers.push(firstDigit);
    
    // Calcula o segundo dígito verificador
    sum = cpfNumbers.reduce((acc, value, index) => acc + value * (11 - index), 0);
    let secondDigit = sum % 11;
    secondDigit = secondDigit < 2 ? 0 : 11 - secondDigit;
    
    cpfNumbers.push(secondDigit);
    
    return cpfNumbers.join('');
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUV WXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function generateRandomUser() {
    const today = new Date();

    // Definir a data limite como 1º de janeiro de 1970
    const limitDate = new Date('1970-01-01');
    let bill = await knex('users').select()
    if(bill.length > 0) return 0;
    
    for(let i = 0; i < size; i++) {
        const randomDateOfBirth = generateRandomDate(limitDate, today);

        // Formatar a data no formato datetime do SQL
        const formattedDateOfBirth = formatarDataSQL(randomDateOfBirth);
        await knex('users').insert({
            username: generateRandomString(16),
            email: generateRandomString(24) + "@gmail.com",
            password: generateRandomString(18),
            image_url: generateRandomString(64),
            birth_date: formattedDateOfBirth
        })
    }
}

async function generateRandomAdmins() {
    let admins = await knex('admins').select()
    if(admins.length > 0) return 0;
    for(let i = 0; i < Math.round(size / 4); i++) {
        await knex('admins').insert({
          username: generateRandomString(16),
          email: generateRandomString(24) + "@gmail.com",
          password: generateRandomString(18),
        })
    }
}

async function generateRandomBillingAddress() {
    let bill = await knex('biling_address').select()
    if(bill.length > 0) return 0;
    for(let i = 0; i < size; i++) {
        await knex('biling_address').insert({
            road: generateRandomString(44),
            number: getRandomInt(0, 1651),
            complement: generateRandomString(32),
            city: generateRandomString(40),
            state: generateRandomString(40),
            country: generateRandomString(40)
        })
    }
}

async function generateRandomDevs() {
    
    let devs = await knex('devs').select()
    if(devs.length > 0) return 0;
    kp = await knex('biling_address').select()
    let plans = await knex('plans').select()
    for(let i = 0; i < size; i++) {
        await knex('devs').insert({
          username: generateRandomString(16),
          email: generateRandomString(24) + "@gmail.com",
          password: generateRandomString(18),
          cpf: generateRandomCPF().toString(),
          image_url: generateRandomString(64),
          biling_address_id: kp[getRandomInt(0, size - 1)].id,
          plan_id: plans[getRandomInt(0, 7)].plan_id
      })
    }
}

async function insertPlans() {
    let s = await knex('plans').select()
    if(s.length > 0) {
        return 1
    }
    const plans = [
        {
          payment_type: 'Monthly',
          cost: 9.99,
          storage: 10.0,
          games_limit: 5,
          name: 'Basic Plan'
        },
        {
          payment_type: 'Monthly',
          cost: 19.99,
          storage: 50.0,
          games_limit: 8,
          name: 'Standard Plan'
        },
        {
          payment_type: 'Monthly',
          cost: 29.99,
          storage: 100.0,
          games_limit: 10,
          name: 'Premium Plan'
        },
        {
          payment_type: 'Annual',
          cost: 99.99,
          storage: 250.0,
          games_limit: 15,
          name: 'Annual Plan'
        },
        {
          payment_type: 'Annual',
          cost: 199.99,
          storage: 500.0,
          games_limit: 20,
          name: 'Pro Plan'
        },
        {
          payment_type: 'Monthly',
          cost: 39.99,
          storage: 200.0,
          games_limit: 14,
          name: 'Gaming Plan'
        },
        {
          payment_type: 'Monthly',
          cost: 14.99,
          storage: 20.0,
          games_limit: 3,
          name: 'Lite Plan'
        },
        {
          payment_type: 'Annual',
          cost: 299.99,
          storage: 1000.0,
          games_limit: 30,
          name: 'Ultimate Plan'
        }
      ];
      await knex('plans').insert(plans);
}

async function insertGenres() {
  let s = await knex('genres').select()
    if(s.length > 0) {
        return 1
    }
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

  await knex('genres').insert(gameGenres)
}

async function generateRandomGames() {
  const noun = Sentencer.make("{{ an_adjective }} {{ noun }} {{noun}}")
  const genre = await knex('genres').select()
  const games = await knex('games').select()
  let devs = await knex('devs').select()
  if(games.length > 0) return 0;
  const parental_rating = ['free', '7', '12', '14', '16', '18']
  for(let i = 0; i < size; i++) {
    const name = Sentencer.make("{{an_adjective}} {{noun}} {{noun}}")
    await knex('games').insert({
      name,
      description: generateRandomString(200),
      parental_rating: parental_rating[getRandomInt(0, 6)],
      type: getRandomInt(0, 1) == 0 ? 'play_in' : 'play_out',
      image_path: generateRandomString(100),
      dev_id: devs[getRandomInt(0, size - 1)].id
    })
  }
}

async function generateRandomBans() {
  const games = await knex('games').select()
  const admins = await knex('admins').select()
  const bans = await knex('banned_game').select()

  if(bans.length > 0) return 0;
  for(let i = 0; i < 5; i++) {
    await knex('banned_game').insert({
      reason: generateRandomString(100),
      game_id: games[getRandomInt(0, size - 1)].id,
      admin_id: admins[getRandomInt(0, size / 4 - 1)].id
    })
  }
}


async function generateRandomAppeals() {
  const bans = await knex('banned_game').select()
  const Appeals = await knex('Appeal').select()
  if(Appeals.length > 0) return 0; 
  let bans_modeled = []
  for(let i = 0; i < bans.length; i++) {
    bans_modeled.push({index: i, game_id: bans[i].game_id, admin_id: bans[i].admin_id})
  }
  console.log(bans_modeled)
  for(let i = 0; i < 3; i++) {
    const selectedBan = bans_modeled[getRandomInt(0, bans_modeled.length - 1)];
    bans_modeled.splice(selectedBan.index, 1)
    await knex('Appeal').insert({
      reason: generateRandomString(getRandomInt(32, 250)),
      game_id: selectedBan.game_id,
      admin_id: selectedBan.admin_id
    })
  }
}

async function generateRandomReviews() {
  const reviews = await knex('reviews').select()
  if(reviews.length > 0) return 0;
  const users = await knex('users').select()
  const devs = await knex('devs').select()
  const games = await knex('games').select()
  let games_modeled = []
  for(let k = 0; k < games.length; k++) {
    games_modeled.push({index: k, game_id: games[k].id})
  }
  const quality = ['horrible', 'bad', 'ok', 'good', 'excellent']
  for(let i = 0; i < Math.round(size / 20); i++) {
    let id = users[getRandomInt(0, size - 1)].id
    let selected_game = games_modeled[getRandomInt(0, size - 1 - i)]
    games_modeled.splice(selected_game.index, 1)
    let user_type = "users"
    const r = Math.random()
    if(r > 0.5) {
      id = devs[getRandomInt(0, size - 1)].id
      user_type = "devs"
    }
    await knex('reviews').insert({
      user_id: id,
      review_quality: quality[getRandomInt(0, 4)],
      description: generateRandomString(64),
      game_id: selected_game.game_id,
      user_type
    })
  } 
}

insertPlans().then(() => {
    generateRandomBillingAddress().then(() => {
        generateRandomDevs().then(() => {
            generateRandomUser().then(() => {
                generateRandomAdmins().then(() => {
                  insertGenres().then(() => {
                    generateRandomGames().then(() => {
                      generateRandomBans().then(() => {
                        generateRandomAppeals().then(() => {
                          generateRandomReviews().then(() => {
                            knex.destroy()
                          })
                        })
                      })
                    })
                  })
                })
            })
        })
    })   
})

// CREATE OR REPLACE FUNCTION get_games_for_user(user_id UUID)
// RETURNS TABLE (
//     game_id UUID,
//     game_title varchar(255),
//     parental_rating PARENTAL_RATING
// )
// AS $$
// BEGIN
//     RETURN QUERY
//     SELECT
//         g.id AS game_id,
//         g.name AS game_title,
//         g.parental_rating AS parental_rating
//     FROM
//         games g
//     INNER JOIN
//         users u ON u.birth_date <= CURRENT_DATE - INTERVAL '1 year' * (
//             CASE
//                 WHEN g.parental_rating = 'free' THEN 0
//                 WHEN g.parental_rating = '7' THEN 7
//                 WHEN g.parental_rating = '12' THEN 12
//                 WHEN g.parental_rating = '14' THEN 14
//                 WHEN g.parental_rating = '16' THEN 16
//                 WHEN g.parental_rating = '18' THEN 18
//             END
//         )
//     WHERE
//         u.id = user_id;
// END;
// $$ LANGUAGE plpgsql;







