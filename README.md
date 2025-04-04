<div align="center">

# 🏄‍♂️ Surfstar 🏄‍♀️

</div>

![surfstar](https://github.com/ChristoferMendes/surfstar/assets/107426464/165060de-cf7e-427c-a4f4-7cba5d00e63e) 

Hey there\! 👋 Welcome to Surfstar, a straightforward template engine for Node.js and TypeScript.

Need to generate HTML, emails, or other text-based content dynamically? Surfstar aims to make it simple by letting you easily mix data into your text templates.

### Note
*(Psst... we're big fans of [Handlebars](https://github.com/handlebars-lang/handlebars.js/) and took a lot of inspiration from it\! Check them out too\!)*

### ✅ Requirements

  * You'll need [Bun](https://bun.sh/) installed to use Surfstar.

### Why Give Surfstar a Try? ✨

  * **Simple Syntax:** Uses familiar `{{variable}}` placeholders. Easy to pick up\!
  * **Looping Made Easy:** Iterate over arrays effortlessly with the `#each` helper.
  * **Access Nested Data:** Easily grab data from nested objects (`{{user.profile.name}}`) and get the current index in loops (`{{@index}}`).

### Ready to Dive In? 🌊

Let's get you set up\!

### 📦 Installation

```bash
bun install surfstar
```

### 💡 Usage Examples

Here's how you can use Surfstar:

#### Basic Variables

Just pop your variables into double curly braces.

`template.surf`

```handlebars
Aloha, {{ name }}! Let's catch some waves! 🤙
```

```typescript
import { compileTemplate } from 'surfstar';

const templatePath = 'path/to/template.surf';
const data = { name: 'Kai' };

const result = compileTemplate(templatePath, data);
console.log(result);
// Output: Aloha, Kai! Let's catch some waves! 🤙
```

#### Nested Properties

Access object properties using dot notation.

`template.surf`

```handlebars
Hey {{ surfer.name }}! See you at {{ surfer.beach }}. 🏖️
```

```typescript
import { compileTemplate } from 'surfstar';

const templatePath = 'path/to/template.surf';
const data = {
  surfer: {
    name: 'Moana',
    beach: 'Sunset Beach'
  }
};

const result = compileTemplate(templatePath, data);
console.log(result);
// Output: Hey Moana! See you at Sunset Beach. 🏖️
```

#### Looping with `#each` (Simple Arrays)

Use `#each` to loop over arrays. `{{this}}` refers to the current item, and `{{@index}}` gives you the zero-based index.

`template.surf`

```handlebars
Packing List:
{{#each gear}}
  {{@index}}. {{this}}
{{/each}}
```

```typescript
import { compileTemplate } from 'surfstar';

const templatePath = 'path/to/template.surf';
const data = {
  gear: ['Board', 'Leash', 'Wax']
};

const result = compileTemplate(templatePath, data);
// Output:
// Packing List:
//   0. Board
//   1. Leash
//   2. Wax
```

#### Looping with `#each` (Array of Objects)

You can access properties of objects within the loop too.

`template.surf`

```handlebars
Local Spots:
{{#each spots}}
  - {{this.name}} (Waves: {{this.waveQuality}})
{{/each}}
```

```typescript
import { compileTemplate } from 'surfstar';

const templatePath = 'path/to/template.surf';
const data = {
  spots: [
    { name: 'Pipeline', waveQuality: 'Expert' },
    { name: 'Waikiki', waveQuality: 'Fun' },
    { name: 'Jaws', waveQuality: 'Giant' }
  ]
};

const result = compileTemplate(templatePath, data);
// Output:
// Local Spots:
//   - Pipeline (Waves: Expert)
//   - Waikiki (Waves: Fun)
//   - Jaws (Waves: Giant)
```
