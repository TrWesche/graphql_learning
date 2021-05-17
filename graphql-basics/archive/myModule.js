// Named exports
const message = "Message from myModule.js";

const part2 = "This is part 2 of the named exports";


// Default export
const defaultExport = "This is the default export";


const getGreeting = (name) => {
    return `Welcome to the course ${name}`
}

export {
    message,
    part2,
    getGreeting,
    defaultExport as default
};