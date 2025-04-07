import { join } from 'node:path';
import { compileTemplate } from '..';

const templatePath = join(import.meta.dir, 'hello-world.surf');

function getPersonInfo() {
  const bornDate = new Date('1990-01-01');

  return {
    name: 'John Doe',
    age: new Date().getFullYear() - bornDate.getFullYear(),
    hobbies: ['surfing', 'coding', 'reading'],
    foods: [
      { name: 'Pizza', price: '$10' },
      { name: 'Burger', price: '$8' },
      { name: 'Sushi', price: '$15' }
    ]
  };
}

const fileCompiled = await compileTemplate(templatePath, {
  dayTimeNow: new Date().toLocaleTimeString(),
  person: getPersonInfo()
});

console.log(fileCompiled);
