import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'game_genres'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('game_id').index().primary().references('id').inTable('games')
      table.uuid('genre_id').index().primary().references('id').inTable('genres')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
