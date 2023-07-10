import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').index().primary()
      table.string('name').unique()
      table.string('client_name')
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
