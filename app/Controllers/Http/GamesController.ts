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
        const { view, auth } = ctx;
        const findedGenres = await Genre.query().where('id', '>', '0');
        let processedGenres: any = [];
        findedGenres.forEach(genre => {
            processedGenres.push({
                name: genre.name,
                slug: genre.slug,
                id: genre.id
            })
        })
        const id = auth.user?.id
        const user = await User.findBy('id', id) || new User()
        return view.render('publish_game', {
            genres: processedGenres,
            username: user.username,
            email: user.email
        })
    }

    public async unzipFile(caminhoArquivoZip, diretorioOutput) {
      const outputDir = path.resolve(diretorioOutput);
    
      fs.readFile(caminhoArquivoZip, function(err, data) {
        if (err) {
          console.error('Erro ao ler o arquivo zip:', err);
          return;
        }
    
        JSZip.loadAsync(data).then(function(zip) {
          zip.forEach(function(relPath, zipEntry) {
            const caminhoCompleto = path.join(outputDir, path.basename(relPath));
            if (zipEntry.dir) {
              // Cria uma pasta se o caminho representa um diretório
              fs.mkdirSync(caminhoCompleto, { recursive: true });
            } else {
              // Extrai o arquivo
              zipEntry.async('nodebuffer').then(function(content) {
                fs.writeFileSync(caminhoCompleto, content);
              });
            }
          });
          console.log('Descompactação concluída!');
        }).catch(function(err) {
          console.error('Erro ao descompactar o arquivo zip:', err);
        });
      });
    }

    public async copyRecursive(input) {
      const destination = path.join('..', input);
      
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
      }
      
      const files = fs.readdirSync(input);
      
      files.forEach(file => {
        const currentPath = path.join(input, file);
        const newPath = path.join(destination, file);
        const isDirectory = fs.lstatSync(currentPath).isDirectory();
        
        if (isDirectory) {
          this.copyRecursive(currentPath);
        } else {
          fs.copyFileSync(currentPath, newPath);
        }
      });
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

            this.unzipFile(final_name, output)
            return "Game publicado"
        }
    }

    public async play(ctx: HttpContextContract) {
        const { params } = ctx;
        const game_id = params.id;
        return game_id
    }
}
