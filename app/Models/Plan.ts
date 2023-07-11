import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid';

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  public plan_id: string

  @column()
  public payment_type: string

  @column()
  public cost: number

  @column()
  public storage: number

  @column()
  public games_limit: number

  @column()
  public name: string

  @beforeCreate()
  public static async createUUID (model: Plan) {
    model.plan_id = uuid()
  }
}
