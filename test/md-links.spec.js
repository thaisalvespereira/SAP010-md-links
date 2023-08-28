import { describe, it, expect,} from '@jest/globals';
import { mdLinks, extractElements, validateLinks } from '../src/md-links';

describe('extractElements', () => {
  it('should be a function', () => {
    expect(typeof extractElements).toBe('function');
  });

  it('Should correctly extract the elements', () => {
    const file = 'arquivos.md';
    const string = '[Exemplo](https://teste.com.br)';
    const result = extractElements(string, file);
    expect(result.file).toEqual(file);
    expect(result.text).toEqual('Exemplo');
    expect(result.links).toEqual('https://teste.com.br')
  });
});

describe('validateLinks', () => {
  it('should return status "ok" after validate a valid link', () => {
    const links = [
      { link: 'https://exemplo.com/valido' },
      { link: 'https://exemplo.com/invalido' },
    ];
    validateLinks(links)
    .then((response) => {
      expect(response).toEqual([
        {
          link: 'https://exemplo.com/valido',
          status: 200,
          ok: 'OK',
        },
        {
          link: 'https://exemplo.com/invalido',
          status: 404,
          ok: 'FAIL',
        }
      ]);
    })
    .catch((error) => {
      error.message;
    });
  });
});


describe('mdLinks', () => {
  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('should return properties of a valid diretory', () => {
   const path = './src/file'
   const options = {};
   const result = mdLinks(path, options);
   return result.then((links) => {
    links.forEach((link) => {
      expect(link).toHaveProperty('links');
      expect(link).toHaveProperty('text');
      expect(link).toHaveProperty('file');
    });
   });
  });
    
  it('should return a message "Nenhum arquivo md encontrado" if file doesnt have the .md extension', async () => {
    const fakePath = './src/file/file.txt';
    const fakeOptions = {
      validate: false,
      stats: false
    };
    
    const logs = [];
    console.log = (...args) => {
      logs.push(args);
    };
    
    await mdLinks(fakePath, fakeOptions);
    expect(logs[0][0]).toEqual('Nenhum arquivo md encontrado');
  });

  it('should return links informations when its --validate', async () => {
    const resultExpected = [
      {
        file: './src/file/file.md',
        text: 'GitHub',
        links: 'https://github.com/',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/file/file.md',
        text: 'Google',
        links: 'https://www.google.com.br/?hl=pt-BR',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/file/file.md',
        text: 'GitHub',
        links: 'https://github./',
        status: 404,
        ok: 'FAIL',
      },
      {
        file: './src/file/file.md',
        text: 'Google',
        links: 'https://www.google.',
        status: 404,
        ok: 'FAIL',
      },
    ];
    const result = await mdLinks('./src/file/file.md', {validate: true});
    expect(result).toEqual(resultExpected);
  });
  
  it('should return informations about total and unique links when its --stats', async () => {
    const resultexpected = { stats: { total: 6, unique: 6 }};
    const result = await mdLinks('./src/file/file.md', {stats: true});
    expect(result).toEqual(resultexpected);
  });

  it('should return informations about total, unique and broken links when its --validade and --stats', async () => {
    const resultExpected = [
      {
        file: './src/file/file.md',
        text: 'GitHub',
        links: 'https://github.com/',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/file/file.md',
        text: 'Google',
        links: 'https://www.google.com.br/?hl=pt-BR',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/file/file.md',
        text: 'GitHub',
        links: 'https://github./',
        status: 404,
        ok: 'FAIL',
      },
      {
        file: './src/file/file.md',
        text: 'Google',
        links: 'https://www.google.',
        status: 404,
        ok: 'FAIL',
      },
      ];
    const result = await mdLinks('./src/file/file.md', {validate: true, stats: true});
    expect(result).toEqual(resultExpected);
  });
}); 