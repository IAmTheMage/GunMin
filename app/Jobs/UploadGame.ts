import { JobContract } from '@ioc:Rocketseat/Bull'
import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');


/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class UploadGame implements JobContract {
  public key = 'UploadGame'

  public async handle(job) {
    const { data } = job
    const inputPath = data.game;
    
  }
}
