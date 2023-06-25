import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id')
      table.string('name').unique()
      table.uuid('genre_id').references('id').inTable('genres')
      table.uuid('dev_id').references('id').inTable('users')
      table.text('description')
      table.boolean('banned').defaultTo(false)
      table.enum('parental_rating', ['free', '7', '12', '14', '16', '18']).defaultTo('free')
      table.enum('type', ['play_in', 'play_out']).defaultTo('play_in')
      table.text('image_path')
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
