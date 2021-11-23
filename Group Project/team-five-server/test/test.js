let chai = require("chai");
let server = require("../index");
let expect = chai.expect;
let should = chai.should();

chai.use(require("chai-http"));

//all tests for Postcode
describe("/post data PostCode", () => {
    it("The Server should return status of 200", (done) => {
    let project = {name:"john", postcode: "2000", projectDescription: "test1"}
    chai.request(server)
        .post("/community-project")
        .send(project)
        .end((err, res) => {
            res.body.should.have.status(200);
            done();
        });
    })

    it("Postcode should be a number when submitting project", (done) => {
        let project1 = {name:"john", postcode: "2000", projectDescription: "test1"}
        chai.request(server)
            .post("/community-project")
            .send(project1)
            .end((err, res) => {
                expect(res.body.project.postcode).to.be.a("number");
                done();
            });
        })

        it("Post Code should be 4 characters long when submitting project", (done) => {
            let project2 = {name:"john", postcode: "2000", projectDescription: "test1"}
            chai.request(server)
                .post("/community-project")
                .send(project2)
                .end((err, res) => {
                    let pc =res.body.project.postcode.toString();
                    expect(pc).to.have.lengthOf(4);
                    done();
                });
            })

        it("First number of Post Code should be 2 for NSW when submitting project", (done) => {
            let project3 = {name:"john", postcode: "2000", projectDescription: "test1"}
            chai.request(server)
                .post("/community-project")
                .send(project3)
                .end((err, res) => {
                    let pc = res.body.project.postcode.toString();
                    expect(pc[0]).to.equal("2");
                    done();
                });
            })     
});

//all tests for Project Status
describe("/post data Status", () => {
    it("Should have a status of 'pending' when project first submitted", (done) => {
            let project4 = {name:"john", postcode: "2000", projectDescription: "test1"}
            chai.request(server)
                .post("/community-project")
                .send(project4)
                .end((err, res) => {
                    expect(res.body.project.projectStatus).to.equal("pending");
                    done();
                });
            })

    // it("should only return projects with a pending status to the review page")
    //     chai.request(server)
    //     .get("/community-projects/review")
    //     .end((err, res) => {
    //         expect(res.body[0].projectStatus).to.equal("pending")
    //     })

    // it("should change project status to approved based on the data coming from the review page")
    //         let projectUrl1 = 'http://localhost:4000/community-project/265ce0bd-967e-4f81-a862-5bcdae52e3f7/approved'
    //         chai.request(server)
    //         .put("/community-project/status/:id/:projectStatus")
    //         .send(projectUrl1)
    //         .end((err, res) => {
    //             console.log(res.body)
    //             expect(res.body.project.projectStatus).to.equal("approved")
    //         })

//     it("should change project status to declined based on the data coming from the review page")
//         let projectUrl2 = 'http://localhost:4000/community-project/265ce0bd-967e-4f81-a862-5bcdae52e3f7/declined'
//         chai.request(server)
//         .put("/community-project/status/:id/:projectStatus")
//         .send(projectUrl2)
//         .end((err, res) => {
//             expect(res.body.projectStatus).to.equal("declined")
//         })
});

//All tests for votes
describe("/post data Votes", () => {
    it("Should be 0 when first submitted", (done) => {
            let project5 = {name:"john", postcode: "2000", projectDescription: "test1"}
            chai.request(server)
                .post("/community-project")
                .send(project5)
                .end((err, res) => {
                    expect(res.body.project.voteCount).to.equal(0);
                    done();
                });
            })

    // it("should increase the vote count by 1 when getting data from the vote page", (done) => {
    //     let projectUrl3 = "http://localHost:4000/community-project/vote/265ce0bd-967e-4f81-a862-5bcdae52e3f7"
    //     chai.request(server)
    //     .put("/community-project/vote/:id")
    //     .send(projectUrl3)
    //     .end((err, res) => {
    //         expect(res.body.project.voteCount).to.equal(res.body.voteCount + 1);
    //         done();
    //     })
    // })
        
    });
