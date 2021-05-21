const app = require("../app");
const supertest = require("supertest");
const { stopDatabase } = require("../config/db");

const request = supertest(app);

afterAll(async () => {
  await stopDatabase();
});

test("add feedback", async (done) => {
  request
    .post("/graphql")
    .send({
      query: `mutation {
            addFeedback(feedback:{comment:"This is a good feedback", reaction:LIKE, service:"607cfb2f217e03bd47a91e9a"}){
              _id
            }
          }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      done();
    });
});
