import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'plans'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('plan_id').index().primary()
      table.string('payment_type', 100).notNullable()
      table.decimal('cost', 10, 2)
      table.decimal('storage', 10, 2)
      table.integer('games_limit')
      table.string('name', 50)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
