import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, beforeCreate, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({columnName: "name"})
  public name: string

  @column({columnName: "email"})
  public email: string

  @column({columnName: "password"})
  public password: string

  @column({columnName: "username"})
  public username: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({columnName: 'profile_image_path'})
  public profile_image_path: string

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async createUUID (model: User) {
    model.id = uuid()
  }
}
