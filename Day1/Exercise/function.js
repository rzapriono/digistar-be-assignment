//  different writing style of function
function greet(name) {
    return `Hello, ${name}!`;
}

const helloWorld = () => {
    return "Hello World";
}

const addInt = (int1, int2) => {
    return int1+ int2;
}

console.log(greet("reza"));
console.log( helloWorld())
console.log(`7 + 2 = ${addInt(7,2)}`)