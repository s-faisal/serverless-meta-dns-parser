//Include the mocha plugin
const mochaPlugin = require('serverless-mocha-plugin')
//Extract expect module from the plugin for further check
const expect = mochaPlugin.chai.expect;
//Generates a wrapper for the processing of serverless API testing
const fetchMetaTags = mochaPlugin.getWrapper('handler','/services/fetch_dns_record.js', 'handler');
var headers = {mocha_test: true}

/**
* @author Fasil Shaikh
*/
describe("Fetch DNS Record of a given URL", () => {

    it('Should_Pass_IfValidURLIsPassed', async () => {
        var req = {
            url: "http://example.org/"
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(200);
            expect(body.dns_txt_content).to.not.be.equal('');
            expect(body.dns_txt_content.length).to.not.be.equal(0);
            expect(body.success_message).to.not.be.equal('');
        });
    });

    it('Should_Pass_IfValidURLIsPassedWithoutDNS', async () => {
        var req = {
            url: "https://www.serverless.com/"
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(200);
            expect(body.dns_txt_content).to.not.be.equal('');
            expect(body.dns_txt_content.length).to.be.equal(0);
            expect(body.success_message).to.not.be.equal('');
        });
    });

    it('Should_Fail_IfInvalidURLPassed', async () => {
        var req = {
            url: "not a valid URL"
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(400);
            expect(body.error_message).to.not.be.equal('');
        });
    });

    it('Should_Fail_IfEmptyURLPassed', async () => {
        var req = {
            url: ""
        }
        return fetchMetaTags.run({body: JSON.stringify(req),headers}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(400);
            expect(body.error_message).to.not.be.equal('');
        });
    });
});