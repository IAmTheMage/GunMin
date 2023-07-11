import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'devs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').index().primary()
      table.string('cpf', 11)
      table.string("name", 32)
      table.string("email").unique()
      table.string("username", 32).unique()
      table.decimal("reviewRelevance", 16).defaultTo(1.0)
      table.uuid('billing_address_id').references('id').inTable('billing_address')
      table.uuid('plan_id').references('plan_id').inTable('plans')
      table.string("password")
      table.string("image_url")
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
