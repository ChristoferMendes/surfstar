import { join } from "node:path";
import { compileTemplate } from "surfstar";

const templatePath = join(import.meta.dir, "hello-world.surf");

const person = {
  name: "John Doe",
  age: 22,
  hobbies: ["surfing", "coding", "reading"],
  foods: [
    { name: "Pizza", price: "$10" },
    { name: "Burger", price: "$8" },
    { name: "Sushi", price: "$15" },
  ],
};

const fileCompiled = await compileTemplate(templatePath, {
  dayTimeNow: new Date().toLocaleTimeString(),
  person,
});

console.log(fileCompiled);
