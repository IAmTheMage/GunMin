import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import ProfileImage from './ProfileImage'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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

  @hasMany(() => ProfileImage)
  public profile_image: HasMany<typeof ProfileImage>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
