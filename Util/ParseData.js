const fs = require('fs');
const { Collection } = require('discord.js-selfbot-v13');

async function saveToFile(collection, filePath) {
    return fs.writeFileSync(`${filePath}`, JSON.stringify(collection), 'utf-8');
}

async function parseFileAsCollection(filePath) {
    const readFile = fs.readFileSync(`${filePath}`, "utf8");
    const tempCollection = new Collection();
    for (const entry of JSON.parse(readFile)) {
        tempCollection.set(entry.id, entry);
    }
    return tempCollection;
}

async function parseFileAsMap(filePath) {
    const readFile = fs.readFileSync(`${filePath}`, "utf8");
    const tempMap = new Map();
    for (const entry of JSON.parse(readFile)) {
        tempMap.set(entry[0], entry[1]);
    }
    return tempMap;
}

async function parseFile(filePath) {
    return JSON.parse(fs.readFileSync(`${filePath}`, "utf8"));
}

module.exports = {
    saveToFile,
    parseFileAsCollection,
    parseFileAsMap,
    parseFile
};