const PipelineHandler = require('../dist/main');
const { Proskomma } = require('proskomma');
const usfm2perf = require('../data/transforms/usfm2perf');
const usfm2perfPipeline = require("../data/pipelines/usfm2perfPipeline.json");
const fse = require("fs-extra");
const path = require("path");

const pipelineH = new PipelineHandler(new Proskomma(), {usfm2perfPipeline}, {usfm2perf}, true);

const usfmContent = fse.readFileSync(path.resolve(__dirname, "../data/usfms/titus.usfm")).toString();

async function saveFile(file, rpath="./output.json") {
    try {
        if(typeof file === "string") {
            let thepath = rpath;
            await fse.outputFile(path.resolve(thepath), file);
        } else {
            await fse.outputJson(path.resolve(rpath), file);
        }
    } catch (err) {
        throw new Error("Failed to save the file", err)
    }
}

async function test() {
    let output = await pipelineH.runPipeline("usfm2perfPipeline", {
        usfm: usfmContent,
        selectors: {"lang": "fra", "abbr": "ust"}
    });
    await saveFile(JSON.stringify(output, null, 2));
}

test();