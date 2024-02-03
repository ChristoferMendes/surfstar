<div align="center">

  # 🏄‍♂️ Surfstar 🏄‍♀️
</div>

## 🌊 Ride the Wave of Efficiency with Surfstar 🌊

Welcome to Surfstar, your dynamic template engine for Node.js and TypeScript. Surfstar enables you to seamlessly integrate dynamic content into your templates, making it easy to generate HTML, emails, or any text-based content with a focus on simplicity and flexibility.

### Why Surfstar?

Surfstar is designed to make templating a breeze. Just like riding the perfect wave, our template engine provides a fluid and intuitive experience. Whether you're a beginner or an experienced developer, Surfstar is here to streamline your templating process and keep your projects flowing smoothly.

### Key Features 🚀

- **Simple Syntax:** Surfstar uses a simple and intuitive syntax for embedding variables in your templates.
- **Modular Design:** The template engine is modular, allowing you to extend and customize its functionality.
- **TypeScript Support:** Written in TypeScript, Surfstar provides type safety and autocompletion in your TypeScript projects.

### Getting Started 🌊

Ready to ride the wave? Dive into our [documentation](link-to-docs) to get started with Surfstar. Whether you're a beginner or an experienced developer, we've got you covered with easy-to-follow guides and examples.

### Installation 🌐

```bash
bun install surfstar
```

### Usage ✨

`path/to/your/surf.template`
```handlebars
Hello, {{ name }}! Welcome to Surfstar! 🌊
``````

```typescript
import { compileTemplate } from 'surfstar';

const result = compileTemplate('path/to/your/template.surf', { name: 'Surfer' });
console.log(result);
// Output: Hello, Surfer! Welcome to Surfstar! 🌊
```