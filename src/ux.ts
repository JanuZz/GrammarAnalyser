import readline from "readline";
import { SyntaxError } from "./SyntaxError";
import "colors";

function prompt(message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export function ask(question: string): Promise<string> {
  return prompt((question + " >").blue + " ");
}

export function say(message: string): void {
  console.log("> ".green + message);
}

export function withColor(message: string, color: string): string {
  return message[color as any];
}

export function displayError(input: string, error: SyntaxError): void {
  const error_message = (": " + error.message).red;
  console.log(input, error_message);

  // Tegn en streg under fejlen
  console.log(
    " ".repeat(error.start) + "^".repeat(error.end - error.start).red
  );
}
