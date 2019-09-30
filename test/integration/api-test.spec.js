const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../../src/app');

chai.use(chaiHttp);

describe('Caling the API', () => {
    it('should return HTTP 200 and body with 5 icecream shops', (done) => {
        chai.request(app.server)
            .get('/top5')
            .end((err, response) => {
                expect(response.status).to.be.equal(200);
                expect(response.body).to.be.an('array').with.lengthOf(5);

                let shops = response.body;
                shops.forEach((shop) => {
                    expect(shop).to.have.keys(['name', 'address', 'review', 'reviewer']);
                    expect(Object.keys(shop).length).to.equal(4);
                    expect(shop.name).to.not.be.empty;
                    expect(shop.address).to.not.be.empty;
                    expect(shop.review).to.not.be.empty;
                    expect(shop.reviewer).to.not.be.empty;
                });

                done();
            });
    });
});