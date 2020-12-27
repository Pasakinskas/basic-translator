const fs = require("fs");

const TRANSLATOR_DIVIDER = "/*";
const TRANSLATION_FILENAME = "vertimai.txt";
const FILE_TO_TRANSLATE = "tekstas-isversti.txt";
const OUTPUT_FILENAME = "isversta.txt";

function getDictionary() {
    return fs.readFileSync(TRANSLATION_FILENAME, "utf8")
        .split("\r\n")
        .map(row => {
            const splitTranslation = row.split(TRANSLATOR_DIVIDER)
            return {
                from: splitTranslation[0],
                to: splitTranslation[1]
            };
        })
}

function getDataToTranslate () {
    return fs.readFileSync(FILE_TO_TRANSLATE, "utf8").split("\r\n")
}

function removeParenthesesWithText(str) {
    const parenthesesWithText = / *\([^)]*\) */g
    return str.replace(new RegExp(parenthesesWithText), "");
}

function replace(str, from, to) {
    return str.replace(new RegExp(from, "g"), to);
}

function output(data) {
    fs.writeFileSync(OUTPUT_FILENAME, data);
}

function init() {
    const dict = getDictionary();
    const dataToTranslate = getDataToTranslate()
        .map(row => removeParenthesesWithText(row))
        .join("\r\n");

    const data = dict.reduce((acc, dictItem) => {
        const { from, to } = dictItem;
        return replace(acc, from, to);
    }, dataToTranslate);

    output(data);
}

init();
