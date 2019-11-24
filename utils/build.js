const { readFileSync, writeFileSync, copyFileSync } = require('fs');
const rm = require('rimraf').sync;
const mkdir = require('mkdirp').sync;

const HTML = readFileSync('./src/index.html').toString();
const [FRAMEWORK, FRAMEWORK_TEST] = readFileSync('./dist/framework.js').toString()
    .replace(/\n/g, '\n            ')
    .split('//SPLIT')
    .map(x => x.trim());

const [V1, V2, V3, V4, EXEC_TEST] = readFileSync('./src/exec.js').toString()
    .replace(/\n/g, '\n            ')
    .split('//SPLIT')
    .map(x => x.trim());

function inlineScript(html, filePath, content) {
    content && (content = `<script>${content}\n        </script>`);

    return html.replace(`<script src="${filePath}"></script>`, content || '');
}

function build(name, exec) {
    let htmlExample = inlineScript(HTML, "framework.js", FRAMEWORK);
    let htmlTest = inlineScript(HTML, "framework.js", FRAMEWORK + FRAMEWORK_TEST);

    htmlExample = inlineScript(htmlExample, "exec.js", exec);
    htmlTest = inlineScript(htmlTest, "exec.js", EXEC_TEST);

    htmlTest = inlineScript(htmlTest, "solution.js");

    rm(`./dist/${name}`);
    mkdir(`./dist/${name}`);

    writeFileSync(`./dist/${name}/index.html`, htmlExample);
    writeFileSync(`./dist/${name}/test.html`, htmlTest);
    copyFileSync(`./solutions/${name}.js`, `./dist/${name}/solution.js`)
    copyFileSync(`./input/${name}.json`, `./dist/${name}/input.json`)
}

build('v1', V1);
build('v2', V2);
build('v3', V3);
build('v4', V4);