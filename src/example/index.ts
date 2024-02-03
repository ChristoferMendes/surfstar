import { join } from "path";
import { compileTemplate } from "..";

const templatePath = join(__dirname, "hello-world.surf");

function getPersonInfo() {
  const bornDate = new Date("1990-01-01");

  return {
    name: "John Doe",
    age: new Date().getFullYear() - bornDate.getFullYear(),
  };
}

const fileCompiled = await compileTemplate(templatePath, {
  dayTimeNow: new Date().toLocaleTimeString(),
  person: getPersonInfo(),
});

console.log(fileCompiled);
