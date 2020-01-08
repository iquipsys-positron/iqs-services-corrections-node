let CorrectionsProcess = require('../obj/src/container/CorrectionsProcess').CorrectionsProcess;

try {
    new CorrectionsProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
