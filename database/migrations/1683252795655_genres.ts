import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'genres'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').index().primary()
      table.string('name')
      table.string('slug')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
