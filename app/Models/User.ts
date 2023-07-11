import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, beforeCreate, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid';
import Plan from './Plan';
import BillingAddress from './BillingAddress';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({columnName: 'cpf'})
  public cpf: string

  @column({columnName: "name"})
  public name: string

  @column({columnName: "email"})
  public email: string

  @column({columnName: "password"})
  public password: string

  @column({columnName: "username"})
  public username: string


  @column({columnName: 'image_url'})
  public profile_image_path: string

  @column({columnName: 'plan_id'})
  public plan_id: string

  @column({columnName: 'billing_address_id'})
  public billing_address_id: string

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async createUUID (model: User) {
    model.id = uuid()
    model.plan_id = ( await Plan.first() || new Plan()).plan_id
    model.billing_address_id = (await BillingAddress.first() || new BillingAddress()).id
    const cpfNumbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
      
    // Calcula o primeiro dígito verificador
    let sum = cpfNumbers.reduce((acc, value, index) => acc + value * (10 - index), 0);
    let firstDigit = sum % 11;
    firstDigit = firstDigit < 2 ? 0 : 11 - firstDigit;
    
    cpfNumbers.push(firstDigit);
    
    // Calcula o segundo dígito verificador
    sum = cpfNumbers.reduce((acc, value, index) => acc + value * (11 - index), 0);
    let secondDigit = sum % 11;
    secondDigit = secondDigit < 2 ? 0 : 11 - secondDigit;
    
    cpfNumbers.push(secondDigit);
    model.cpf = cpfNumbers.join('');
  }


  static get table () {
    return 'devs'
  }
}
