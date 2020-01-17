# Simple JavaScript Class I18N
Simple class for translation through predefined dictionaries

## Installation
This is a Node.js module available through the npm registry.

Installation is done using the npm install command:
```
    $ npm install fyyb-i18n
```

## Examples

##### Simple Use:  
Used to translate texts.

html
```html
<html lang="en">
<head> ... </head>
<body>
    <div>
        <button i18nChange='default' href="#">EN</button>
        <button i18nChange='pt-br' href="#">PT-BR</button>
        <button i18nChange='es' href="#">ES</button>
    </div>
    
    <h1 i18n='test'>teste</h1>
...
```

javascript
```javascript
    const i18n = require('fyyb-i18n');

    i18n.addInDictionary({
        'pattern': 1,
        'dicts': {
            'pt-br': {
                'test': 'titulo de teste',
            },
            'es': {
                'test': 'título de prueba'
            }
        }
    });

```

##### Advanced Use:
used for translation of code blocks or even entire pages

html
```html
<html lang="en">
<head> ... </head>
<body>
    <div>
        <button i18nChange='default' href="#">EN</button>
        <button i18nChange='pt-br' href="#">PT-BR</button>
        <button i18nChange='es' href="#">ES</button>
    </div>
    
     <div i18n='div-test'>
        <h1> Test Title </h1>
        <p> Test paragraph 1</p>
        <p> Test paragraph 2</p>
        <button> more </button>
    </div>
...
```

javascript
```javascript
    const i18n = require('fyyb-i18n');

    let ptDivTest = `<h1> Titulo de Teste </h1>
                     <p> Parágrafo de teste 1</p>
                     <button> + Mais </button>`;

    let esDivTest = ` `;

    i18n.addInDictionary({
        'pattern': 1,
        'dicts': {
            'pt-br': {
                'div-test': ptDivTest,
            },
            'es': {
                'div-test': esDivTest
            }
        }
    });

```