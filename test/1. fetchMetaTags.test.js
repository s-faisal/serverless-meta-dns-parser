//Include the mocha plugin
const mochaPlugin = require('serverless-mocha-plugin')
//Extract expect module from the plugin for further check
const expect = mochaPlugin.chai.expect;
//Generates a wrapper for the processing of serverless API testing
const fetchMetaTags = mochaPlugin.getWrapper('handler','/services/fetch_metatags.js', 'handler');
var headers = {mocha_test: true}

/**
* @author Fasil Shaikh
*/
describe("Fetch MetaTags of a given URL", () => {

    it('Should_Pass_IfValidDataIsPassed', async () => {
        var req = {
            url: "https://npmjs.com/package/str2bin",
            metatag: "og:title"
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(200);
            expect(body.metatag_content).to.not.be.equal('');
            expect(body.success_message).to.not.be.equal('');
        });
    });

    it('Should_Pass_IfValidDataIsPassedCustomMetatag', async () => {
        var req = {
            url: "https://npmjs.com/package/str2bin",
            metatag: "description"
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(200);
            expect(body.metatag_content).to.not.be.equal('');
            expect(body.success_message).to.not.be.equal('');
        });
    });

    it('Should_Fail_IfInvalidURLPassed', async () => {
        var req = {
            url: "not a valid URL",
            metatag: "description"
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(500);
            expect(body.error_message).to.not.be.equal('');
        });
    });

    it('Should_Fail_IfEmptyURLPassed', async () => {
        var req = {
            url: "",
            metatag: "description"
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(400);
            expect(body.error_message).to.not.be.equal('');
        });
    });

    it('Should_Fail_IfInvalidMetatagPassed', async () => {
        var req = {
            url: "https://npmjs.com/package/str2bin",
            metatag: "not a valid metatag"
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(200);
            expect(body.metatag_content).to.be.equal('');
            expect(body.success_message).to.not.be.equal('');
        });
    });

    it('Should_Fail_IfEmptyMetatagPassed', async () => {
        var req = {
            url: "https://npmjs.com/package/str2bin",
            metatag: ""
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(400);
            expect(body.error_message).to.not.be.equal('');
        });
    });
});