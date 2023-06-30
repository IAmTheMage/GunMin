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

size = process.argv[2]

console.log(size)


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
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
    let bill = await knex('users').select()
    if(bill.length > 0) return 0;
    for(let i = 0; i < size; i++) {
        await knex('users').insert({
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
        let rand = Math.random()
        if(rand < 0.5) {
            await knex('devs').insert({
                username: generateRandomString(16),
                email: generateRandomString(24) + "@gmail.com",
                password: generateRandomString(18),
                cpf: generateRandomCPF().toString(),
                biling_address_id: kp[getRandomInt(0, size - 1)].id,
                plan_id: plans[getRandomInt(0, 7)].plan_id
            })
        }
        else {
            await knex('devs').insert({
                username: generateRandomString(16),
                email: generateRandomString(24) + "@gmail.com",
                password: generateRandomString(18),
                cnpj: generateRandomCNPJ(),
                biling_address_id: kp[getRandomInt(0, size - 1)].id,
                plan_id: plans[getRandomInt(0, 7)].plan_id
            })
        }
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

insertPlans().then(() => {
    generateRandomBillingAddress().then(() => {
        generateRandomDevs().then(() => {
            generateRandomUser().then(() => {
                knex.destroy()
            })
        })
    })
    
})





