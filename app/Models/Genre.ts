import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid';

export default class Genre extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string;

  @column()
  public slug: string;
  
  @beforeCreate()
  public static async createUUID (model: Genre) {
    model.id = uuid()
  }
}
