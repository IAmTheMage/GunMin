import { JobContract } from '@ioc:Rocketseat/Bull'
import BillingAddress from 'App/Models/BillingAddress'
import Plan from 'App/Models/Plan'

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

export default class CreatePlansAndBillingAddress implements JobContract {
  public key = 'CreatePlansAndBillingAddress'

  public async handle(job) {
    const { data } = job
    setTimeout(async () => {
      const config_plans = {
        "payment_type": "Monthly",
        "cost": 9.99,
        "storage": 100.00,
        "games_limit": 5,
        "name": "Basic Plan"
      }
      const config_billing = {
        "road": "Rua das Flores",
        "number": 123,
        "complement": "Apto 101",
        "city": "São Paulo",
        "state": "SP",
        "country": "Brasil"
      }
      const plan = new Plan()
      plan.payment_type = config_plans.payment_type
      plan.cost = config_plans.cost;
      plan.storage = config_plans.storage;
      plan.games_limit = config_plans.games_limit;
      plan.name = config_plans.name;
      await plan.save()
      const billing = new BillingAddress()
      billing.road = config_billing.road
      billing.number = config_billing.number
      billing.complement = config_billing.road
      billing.city = config_billing.city
      billing.state = config_billing.state
      billing.country = config_billing.country
      await billing.save()
    }, 3000)
    // Do somethign with you job data
  }
}
