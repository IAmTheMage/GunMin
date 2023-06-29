import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Genre from './Genre'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public banned: boolean

  @column()
  public parental_rating: string

  @column()
  public type: string

  @column()
  public image_path: string

  @belongsTo(() => User, {foreignKey: 'dev_id'})
  public dev: BelongsTo<typeof User>

  @belongsTo(() => Genre, {foreignKey: 'genre_id'})
  public genre: BelongsTo<typeof Genre>

  @column({columnName: 'dev_id'})
  public dev_id: number

  @column({columnName: 'genre_id'})
  public genre_id: number

  @column({columnName: "client_name"})
  public client_name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
