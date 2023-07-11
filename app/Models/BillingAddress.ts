import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid';

export default class BillingAddress extends BaseModel {

  @column({ isPrimary: true })
  public id: string

  @column()
  public road: string

  @column()
  public number: number

  @column()
  public complement: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public country: string

  @beforeCreate()
  public static async createUUID (model: BillingAddress) {
    model.id = uuid()
  }

  static get table () {
    return 'biling_address'
  }
}
