const e = require('express');
var postgres = require('../model/PostgreDB');
module.exports = {
    getQuestions: async (req, res) => {
        console.log("candidate::", req.body)
        const Questions = await postgres.GetQuestions(req.body.email);

        // console.log("Questions::",Questions)
        const programming = Questions.filter(item => { return item.category === "programming" })
        const shuffledProgramming = [...programming].sort(() => 0.5 - Math.random());
        const randomProgramming = shuffledProgramming.slice(0, 5)

        const logical = Questions.filter(item => { return item.category === "logical" })
        const shuffledLogical = [...logical].sort(() => 0.5 - Math.random());
        const randomLogical = shuffledLogical.slice(0, 5)

        const sql = Questions.filter(item => { return item.category === "sql" })
        const shuffledSql = [...sql].sort(() => 0.5 - Math.random());
        const randomSql = shuffledSql.slice(0, 5)

        /*  const verbal=Questions.filter(item=>{return item.category==="verbal"})
         const shuffledVerbal=[...verbal].sort(() => 0.5 - Math.random());
         const randomVerbal=shuffledVerbal.slice(0, 5) */

        var final = [];
        randomProgramming.forEach((element, index) => {
            // console.log(element,"::",index)
            final.push(element)
            final.push(randomLogical[index])
            final.push(randomSql[index])
            // final.push(randomSql[index])
        });
        //  console.log("final::",final)
        res.send(final)
    },
    checkAns: async (req, res) => {
        // console.log("checkAns::",req.body.quesAns)
        const body = req.body.quesAns;
        const email = req.body.email;
        const Ques = [];
        const Ans = [];
        body.forEach(item => {
            Ques.push(item.Q)
            Ans.push(item.A)
        });
        const status = await postgres.AnsCheck(Ques, Ans, email, req.body.quesAns) //we passed req.body.quesAns to store the que and ans json in DB
        res.send(status)
    },
    getAllQuestions: async (req, res) => {
        // console.log("questions::",req.body.que)
        const questions = await postgres.GetAllQuestions()
        res.send(questions)
    },
    setQuestion: async (req, res) => {
        // console.log("setQuestion::",req.body)
        const status = await postgres.SetQuestion(req.body)
        res.send(status)
    },
    delQuestion: async (req, res) => {
        console.log("delQuestion::", req.body)
        const status = await postgres.DelQuestion(req.body.queID)
        res.send(status)
    },
    updateQuestion: async (req, res) => {
        console.log("updateQuesion::", req.body)
        const status = await postgres.UpdateQue(req.body)
        console.log("updateQuesion status::", status)
        res.send(status)
    },
    bulkQuestions: async (req, res) => {
        var questions = req.body.Questions;
        var DBQuestions = await postgres.GetAllQuestions();
        var final = [], final2 = [], repeatedQ = [], repeatedQ2 = [];

        //to get the unique Questions from new file data
        for (const [i, v] of questions.entries()) {
            var temp = JSON.stringify(v)
            if (final.includes(temp)) {
                repeatedQ.push(temp)
            } else {
                final.push(temp)
            }
        }

        //Repeated Questions from new file
        repeatedQ.forEach(element => {
            repeatedQ2.push(JSON.parse(element))
        });
         
        //Final unique Questions from new file
        final.forEach(element => {
            final2.push(JSON.parse(element))
        });

        //Unique from file which are not present in DB 
        const UniqueQ = final2.reduce((acc, curr) => {
            if (!DBQuestions.some(el => el.question === `${curr.question}` && el.opt1 === `${curr.opt1}` && el.opt2 === `${curr.opt2}` && el.opt3 === `${curr.opt3}` && el.opt4 === `${curr.opt4}` && el.ans === `${curr.ans}`)) {
              acc.push(curr);
            }
            return acc;
          }, []);

          console.log("UniqueQ::",UniqueQ)

        
        const status = await postgres.BulkQuestions(UniqueQ)
        res.send({"status":status,"repeated":repeatedQ2});
    }
}