import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'billing_addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').index().primary()

      table.string('road', 255).notNullable()
      table.integer('number').notNullable()
      table.string('complement', 100)
      table.string('city', 100).notNullable()
      table.string('state', 100).notNullable()
      table.string('country', 100).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
