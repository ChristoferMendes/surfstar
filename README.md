<div align="center">

  # 🏄‍♂️ Surfstar 🏄‍♀️
</div>

![surfstar](https://github.com/ChristoferMendes/surfstar/assets/107426464/165060de-cf7e-427c-a4f4-7cba5d00e63e)

### Requirements

- [Bun](https://bun.sh/) installed


## 🌊 Ride the Wave of Efficiency with Surfstar 🌊

Welcome to Surfstar, your dynamic template engine for Node.js and TypeScript. Surfstar enables you to seamlessly integrate dynamic content into your templates, making it easy to generate HTML, emails, or any text-based content with a focus on simplicity and flexibility.

### Surfstar is heavily inspired by [Handlebars](https://github.com/handlebars-lang/handlebars.js/)! Please go there to take a look.

### Why Surfstar?

Surfstar is designed to make templating a breeze. Just like riding the perfect wave, our template engine provides a fluid and intuitive experience. Whether you're a beginner or an experienced developer, Surfstar is here to streamline your templating process and keep your projects flowing smoothly.

### Key Features 🚀

- **Simple Syntax:** Surfstar uses a simple and intuitive syntax for embedding variables in your templates.
- **Modular Design:** The template engine is modular, allowing you to extend and customize its functionality.
- **Iteration Support:** Easily iterate over arrays with the `#each` helper.
- **Context Access:** Access array indices and nested properties within loops.

### Getting Started 🌊

Ready to ride the wave?

### Installation 🌐

```bash
bun install surfstar
```

### Usage ✨

#### Basic Variables

`template.surf`
```handlebars
Aloha, {{ name }}! Catch some waves with Surfstar! 🌊
```

```typescript
import { compileTemplate } from 'surfstar';

const result = compileTemplate('path/to/template.surf', { name: 'Dude' });
console.log(result);
// Output: Aloha, Dude! Catch some waves with Surfstar! 🌊
```

#### Nested Properties

`template.surf`
```handlebars
Aloha, {{ surfer.name }}! Your favorite beach is {{ surfer.beach }}.
```

```typescript
import { compileTemplate } from 'surfstar';

const result = compileTemplate('path/to/template.surf', { 
  surfer: { 
    name: 'Kelly', 
    beach: 'Pipeline' 
  } 
});
// Output: Aloha, Kelly! Your favorite beach is Pipeline.
```

#### Iterating with #each

`template.surf`
```handlebars
Your surf gear:
{{#each gear}}
  - {{this}} (priority: {{@index}})
{{/each}}
```

```typescript
import { compileTemplate } from 'surfstar';

const result = compileTemplate('path/to/template.surf', { 
  gear: ['surfboard', 'wetsuit', 'wax'] 
});
// Output:
// Your surf gear:
//   - surfboard (priority: 0)
//   - wetsuit (priority: 1)
//   - wax (priority: 2)
```

#### Iterating with Objects in Arrays

`template.surf`
```handlebars
Best surf spots:
{{#each spots}}
  - {{this.name}} has {{this.waveSize}} waves
{{/each}}
```

```typescript
import { compileTemplate } from 'surfstar';

const result = compileTemplate('path/to/template.surf', { 
  spots: [
    { name: 'Pipeline', waveSize: 'massive' },
    { name: 'Malibu', waveSize: 'mellow' },
    { name: 'Teahupo\'o', waveSize: 'monster' }
  ]
});
// Output:
// Best surf spots:
//   - Pipeline has massive waves
//   - Malibu has mellow waves
//   - Teahupo'o has monster waves
```
