import thisIsTheDefault, {message, part2, getGreeting} from "./myModule";
import addFunction, {funcSub2} from "./math";

// console.log("Hello GraphQL");

console.log(message);
console.log(part2);
console.log(thisIsTheDefault);
console.log(getGreeting("Edgar"));


console.log("---------------");

console.log(addFunction(1, 2));
console.log(funcSub2(100, 20));