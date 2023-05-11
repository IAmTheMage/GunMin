import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Genre from 'App/Models/Genre';
import Bull from '@ioc:Rocketseat/Bull'
import Job from 'App/Jobs/UploadGame'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import User from 'App/Models/User';
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');


export default class GamesController {
    public async index(ctx: HttpContextContract) {
        const { view } = ctx;
        const findedGenres = await Genre.query().where('id', '>', '0');
        let processedGenres: any = [];
        findedGenres.forEach(genre => {
            processedGenres.push({
                name: genre.name,
                slug: genre.slug,
                id: genre.id
            })
        })
        return view.render('publish_game', {
            genres: processedGenres
        })
    }

    public async publish(ctx: HttpContextContract) {
        const { request } = ctx;
        const game = request.file('game', {
            extnames: ['zip']
        })
        if(game) {
            await game.move(path.join(Application.tmpPath('uploads'), 'games_zipped'))
            const final_name = path.join(Application.tmpPath('uploads'), 'games_zipped') + "/" + game.fileName
            const output = path.join(Application.tmpPath('uploads'), 'games/') + game.fileName?.split('.')[0]

            if (!fs.existsSync(output)) {
                fs.mkdirSync(output, { recursive: true });
                console.log('Diretório de saída criado:', output);
            }

            fs.readFile(final_name, (err, data) => {
                if (err) throw err;
              
                // cria um objeto JSZip a partir do conteúdo do arquivo zip
                JSZip.loadAsync(data).then((zip) => {
                  // procura pelo arquivo index.html na raiz da pasta zipada
                  const indexFile = zip.file('TestGame/index.html');
              
                  // verifica se o arquivo index.html existe
                  if (!indexFile) {
                    console.error('Erro: arquivo index.html não encontrado na pasta zipada.');
                    return;
                  }
              
                  // extrai o arquivo index.html
                  const indexContent = indexFile.async('text');
                  fs.writeFileSync(output + 'index.html', indexContent);
              
                  // extrai os diretórios css e js
                  zip.folder('css').forEach((relativePath, file) => {
                    file.async('nodebuffer').then((content) => {
                      const filePath = path.join(output, 'TestGame/css', relativePath);
                      fs.writeFileSync(filePath, content);
                      console.log('Arquivo extraído:', filePath);
                    });
                  });
              
                  zip.folder('js').forEach((relativePath, file) => {
                    file.async('nodebuffer').then((content) => {
                      const filePath = path.join(output, 'TestGame/js', relativePath);
                      fs.writeFileSync(filePath, content);
                      console.log('Arquivo extraído:', filePath);
                    });
                  });
                }).catch((err) => {
                  console.error('Erro ao ler arquivo zip:', err);
                });
            });
        }
    }
}
