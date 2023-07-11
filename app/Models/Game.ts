import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, ManyToMany, beforeCreate, belongsTo, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Genre from './Genre'
import { v4 as uuid } from 'uuid';

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: string

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

  @manyToMany(() => Genre, {
    localKey: 'id',
    pivotTable: 'game_genres',
    relatedKey: 'id',
    pivotForeignKey: 'game_id',
    pivotRelatedForeignKey: 'genre_id'
  })
  public genres: ManyToMany<typeof Genre>


  @column({columnName: 'dev_id'})
  public dev_id: string

  @beforeCreate()
  public static async createUUID (model: Game) {
    model.id = uuid()
  }


  @column({columnName: "client_name"})
  public client_name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
