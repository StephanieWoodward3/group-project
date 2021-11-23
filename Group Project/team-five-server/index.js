const storage = require('node-persist');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
 
const server = express();
 
(async () => {
 
    await storage.init({ dir: './data' });
 
    server.use(cors());
    server.use(express.json());
    server.use(bodyParser.json());
 
    //POST Request to accept the data from the Form and saving it in Persist
    server.post('/community-project', async (request, response) => {
        let project = {
            id: uuidv4(),
            name: request.body.name,
            postcode: Number(request.body.postcode),
            projectTitle: request.body.projectTitle,
            projectDescription: request.body.projectDescription,
            projectStatus: "pending",
            dateSubmitted: new Date().toISOString().slice(0, 10),
            voteCount: 0
        }
         //Data Validation for PostCode
         if (request.body.postcode.length == 4) {
            if(!isNaN(project.postcode)){
                if(request.body.postcode[0] == "2"){
                    checkName();
                    //response.json({ project, status: 200 }); //sending the ok response
                }
                else {
                    response.json({status: 400, message: "Postcode must start with 2"})
                }
            }
            else {
                response.json({ status: 400, message: "Postcode must be a number" })
            }
        } else {
            response.json({ status: 400, message: "Invalid postcode length" }) // if the post code is not 4 digits it will show this error
        }

        function hasNumber(myString){
            return /\d/.test(myString)
        }

        async function checkName(){
            if(hasNumber(request.body.name)){
                response.json({ status: 400, message: "Representative Name must not contain a number" })
            }
            else {
                await storage.setItem(`project-${project.id}`, project);  //persisting the data
                response.json({project, status: 200})
            }
        }
    });
 
    // GET request to show all data
    server.get('/projects', async (request, response) => {
        let project = await storage.valuesWithKeyMatch(/project-/)
        response.json(project)
    })
 
    // GET request to filter data by status
    server.get('/community-projects/review', async (request, response) => {
        let project = await storage.valuesWithKeyMatch(/project-/);
        let projectStatus = project.filter((p) => p.projectStatus == "pending");
        response.json(projectStatus)
    });

    //GET request to filter by postcode
    server.get("/my-area/:postcode", async(request, response) => {
        let projects = await storage.valuesWithKeyMatch(/project-/);
        let pc = request.params.postcode;
        let filteredbyPostCode = projects.filter((p) => p.postcode == Number(pc))
        let filteredbyStatus = filteredbyPostCode.filter((p) => p.projectStatus=== "approved")

        response.json(filteredbyStatus);
    })

    //GET request to filter data by postcode and sort by votecount
    server.get("/community-projects/top", async (request, response) => {
        let projects = await storage.valuesWithKeyMatch(/project-/);
        let filteredProjects = projects.filter((p) => p.projectStatus == "approved")
        let sortedProjects = filteredProjects.sort((p1, p2) => p2.voteCount - p1.voteCount);
 
        let top10 = [];
        for(let i =0; i <sortedProjects.length; i++){
            top10.push(sortedProjects[i])
        } 
        response.json(top10);
    });

    // GET request to filter data by status to generate Vote list
    server.get('/community-projects/votes', async (request, response) => {
        let project = await storage.valuesWithKeyMatch(/project-/);
        let projectStatus = project.filter((p) => p.projectStatus == "approved");
        response.json(projectStatus)
    });
 
    // GET request to filter data by status and postcode
    server.get('/community-projects/vote', async (request, response) => {
        let project = await storage.valuesWithKeyMatch(/project-/)
        let pc = request.body.postcode;
        let vote = project.filter((p) => p.status == "pending" && p.postcode == pc)
        response.json(vote);
    });
 
    // //GET request to filter data by postcode and sort by votecount
    // server.get("/community-projects/top10", async (request, response) => {
    //     let projects = await storage.valuesWithKeyMatch(/project-/);
    //     let pc = request.body.postcode;
    //     let filteredProjects = projects.filter((p) => p.status == "approved" && p.postcode == pc)
    //     let sortedProjects = filteredProjects.sort((p1, p2) => p2.voteCount - p1.voteCount);
 
    //     let top10 = [];
    //     for(let i =0; i <10; i++){
    //         top10.push(sortedProjects[i])
    //     } 
    //     response.json(top10);
    // });

    //PUT Request to update the Vote Count
    server.put("/community-project/vote/:id", async(request, response) =>{
        let project = await storage.getItem(`project-${request.params.id}`)
        project.voteCount = project.voteCount + 1;
 
        await storage.updateItem(`project-${request.params.id}`, project);
        response.json({project,status:200});
    });
 
    //PUT Request to update the status from pending to approved
    server.put("/community-project/status/:id/:projectStatus", async(request, response) =>{
        let project = await storage.getItem(`project-${request.params.id}`);
        project.projectStatus = request.params.projectStatus;
 
        await storage.updateItem(`project-${request.params.id}`, project);
        response.json({project,status:200});
    })
 
    server.listen(4000, () => { console.log(`http://localhost:4000`) });
})();
 
module.exports = server