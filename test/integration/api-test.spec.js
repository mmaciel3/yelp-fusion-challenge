const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const app = require('../../src/app.js');

chai.use(chaiHttp);

describe('Caling the API', () => {
    it('should return HTTP 200 and body with 5 icecream shops', (done) => {
        chai.request(app.server)
            .get('/top5')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.equal(5);
                done();
            });
    });
});