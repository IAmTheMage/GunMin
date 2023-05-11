import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo,
  BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class ProfileImage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public path: string

  @belongsTo(() => User, {foreignKey: 'user_id'})
  public user: BelongsTo<typeof User>

  @column({columnName: 'user_id'})
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
