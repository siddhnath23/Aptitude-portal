const postgres = require("./PostgresClient");
require('dotenv').config();
var CollectionName = require('./Collections');
const reader = require('xlsx');
const { json } = require("express");
const PostgresClient = require("./PostgresClient");
const { uuid } = require('uuidv4');
const { v4 } = require('uuid');

module.exports = {
    CreateDatabase: async () => {
        try {

            var client = await postgres.PostgresClientConnect('');

            try {

                await client.connect();
                await client.query(`CREATE DATABASE ${process.env.DB}`);
                console.log("Data base created");

            } catch (error) {

                // console.error(error.stack);
                console.log(false);

            } finally {

                await client.end();         // closes connection

            }

        } catch (e) {
            console.log(e);
        }
    },
    CreateTable: async () => {
        try {
            CollectionName.forEach(async element => {
                var query = ``;

                if (element === process.env.COLLECTION) {
                    query = `CREATE TABLE IF NOT EXISTS candidates (
                    "id" SERIAL NOT NULL,
                    "fullname" VARCHAR(50) NOT NULL,
                    "email" VARCHAR(100) NOT NULL,
                    "usertype" VARCHAR(50) NOT NULL,
                    "age" VARCHAR(50) NOT NULL,
                    "contact" VARCHAR(50) NOT NULL,
                    "password" VARCHAR(100) NOT NULL,
                    "experience" VARCHAR(100) NOT NULL,
                    "applied" VARCHAR(50) NOT NULL,
                    "status" VARCHAR(50) NOT NULL,
                    "date" VARCHAR(50) NOT NULL,
                    "marks" VARCHAR(50) NOT NULL,
                    "response" JSONB
                );`
                } else {
                    query = `CREATE TABLE IF NOT EXISTS questions (
                    "id" SERIAL NOT NULL,
                    "question" VARCHAR(20000) NOT NULL,
                    "opt1" VARCHAR(20000),
                    "opt2" VARCHAR(20000),
                    "opt3" VARCHAR(20000),
                    "opt4" VARCHAR(20000),
                    "ans" VARCHAR(20000),
                    "type" VARCHAR(100) NOT NULL,
                    "category" VARCHAR(100) NOT NULL,
                     PRIMARY KEY ("question")
                );`
                }
                var client = await postgres.PostgresClientConnect(process.env.DB);
                try {
                    await client.connect();
                    await client.query(query);
                    console.log("table created successfully");

                } catch (error) {

                    // console.error(error.stack);
                    console.log(false);

                } finally {

                    await client.end();         // closes connection

                }
            });

        } catch (e) {

            console.log(e);

        }
    },
    //register candidate 
    RegCandidate: async (data) => {
        console.log("RegCandidate::", data)
        const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date();
        const month = monthArr[d.getMonth()];
        const currentDate = d.getDate() + "-" + month + "-" + d.getFullYear();
        console.log(currentDate)

        var client = await postgres.PostgresClientConnect(process.env.DB)
        return new Promise(async function (resolve, reject) {
            try {
                await client.connect();
                await client.query(`INSERT INTO candidates ( "fullname", "email", "usertype", "age", "contact", "password", "experience", "applied", "status", "date", "marks", "response")  
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [data.fullname, data.email, "candidate", data.age, data.contact, data.password, data.experience, `${false}`, "", currentDate, `${null}`, `${null}`]);
                // console.log("candidate registered");
                resolve(true)
            } catch (error) {
                console.log(error.stack);
                resolve(false)
            } finally {
                await client.end();
            }
        });

    },
    Login: async (data) => {
        console.log("Login::", data)
        var client = await postgres.PostgresClientConnect(process.env.DB);
        var email = data.email;
        var password = data.password;

        return new Promise(async function (resolve, reject) {
            try {

                await client.connect();

                var data = await client.query(`SELECT * FROM candidates WHERE email='${email}' AND password='${password}';`);

                if (data.rows.length !== 0) {
                    // resolve({ "status": true, "candidate": email })
                    console.log('data::', data.rows);
                    //previously exam attempted or not
                    if (data.rows[0].applied === "true") {
                        // console.log("applied before")
                        resolve({ "status": true, "user": data.rows[0], "token": v4(), "applied": true, "usertype": data.rows[0].usertype })
                    } else {
                        // console.log("not applied before")
                        resolve({ "status": true, "user": data.rows[0], "token": v4(), "applied": false, "usertype": data.rows[0].usertype })
                    }

                } else {
                    resolve({ "status": false })
                }

                console.log('data::', data.rows);

            } catch (error) {

                console.error(error.stack);

                // console.log("false", false);

            } finally {

                await client.end();

            }
        });
    },
    AddQuestions: async () => {
        /* Excel file read part start */
        const file = reader.readFile(__dirname + '/Questions.xlsx')
        var data = []
        const sheets = file.SheetNames
        for (let i = 0; i < sheets.length; i++) {
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }

        // console.log("excel data::", data)

        /*  Excel file read part end */

        var client = await postgres.PostgresClientConnect(process.env.DB)
        return new Promise(async function (resolve, reject) {

            try {
                await client.connect();
                for (const v of data) {

                    await client.query(`INSERT INTO questions ( "question","opt1", "opt2", "opt3", "opt4", "ans", "type", "category")  
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [v.question, v.opt1, v.opt2, v.opt3, v.opt4, v.ans, v.type, v.category]);

                }

                console.log("questions inserted")
            } catch (e) {
                // console.log(e.stack)
                console.log("questions not inserted yet")
            } finally {
                await client.end();
            }

        })
    },
    GetQuestions: async (email) => {
        var client = await postgres.PostgresClientConnect(process.env.DB)
        return new Promise(async function (resolve, reject) {
            try {
                await client.connect()
                const candidate = await client.query(`SELECT * FROM candidates WHERE email='${email}' AND usertype='candidate';`)
                var candidateExp = candidate.rows[0].experience;
                // console.log("candidate::", candidateType)
                //status updated if candidate starts exam
                await client.query(`UPDATE candidates SET status='Started' WHERE email='${email}' AND usertype='candidate';`)

                const questions = await client.query(`SELECT * FROM questions WHERE type='${candidateExp}';`)
                // console.log("questions::", questions.rows)
                resolve(questions.rows)
            } catch (e) {
                console.log(e.stack)
                // resolve({ "status": false })
            } finally {
                await client.end()
            }
        })
    },
    AnsCheck: async (Ques, Ans, email, quesAns) => {
        // console.log(Ques,"::", Ans,"::",email,"::",quesAns)
        var client = await postgres.PostgresClientConnect(process.env.DB)
        return new Promise(async function (resolve, reject) {
            try {

                await client.connect();

                var data = await client.query(`SELECT * FROM questions ;`);
                var marks = 0;
                var response = [];
                for (const [i, v] of data.rows.entries()) {
                    // console.log(i,"::",v)
                    for (const [i2, v2] of Ques.entries()) {
                        // console.log(i2,"::",v2)
                        if (v2 === v.question) {

                            if (Ans[i2] === v.ans) {
                                marks = ++marks;
                                response.push({ "Q": v2, "A": Ans[i2], "status": "Right" })
                            } else {
                                response.push({ "Q": v2, "A": Ans[i2], "status": "Wrong" })
                            }

                            break;
                        }
                    }
                }
                const value = JSON.stringify({ res: response })
                // console.log("marks::", marks,"response::",JSON.stringify(value))
                await client.query(`UPDATE candidates SET applied='${true}',marks='${marks}',response='${value}',status='Finished' WHERE email='${email}' AND usertype='candidate';`)
                resolve({ "status": true, "msg": "successfull" })
            } catch (error) {
                console.error(error.stack);
                resolve({ "status": false, "msg": "successfull" })
            } finally {

                await client.end();

            }
        });
    },
    CheckApplied: async (email) => {
        // console.log("CheckApplied::",email)
        var client = await postgres.PostgresClientConnect(process.env.DB)
        return new Promise(async function (resolve, reject) {

            try {
                await client.connect()
                const data = await client.query(`SELECT * from candidates WHERE email='${email}';`)
                // console.log("CheckApplied::",data.rows)
                resolve({ "status": true, "candidate": data.rows })
            } catch (err) {
                console.log(err.stack)
                resolve({ "status": false })
            } finally {
                await client.end()
            }
        })
    },
    GetCandidates: async (usertype) => {
        // console.log("GetCandidates::",usertype)
        var client = await postgres.PostgresClientConnect(process.env.DB);
        return new Promise(async function (resolve, reject) {
            try {
                await client.connect()
                const data = await client.query(`SELECT * from candidates WHERE usertype='${usertype}';`)
                // console.log("candidates:::",data.rows[2].response.res)
                resolve({ "status": true, "data": data.rows })
                /*  const arr=data.rows[2].response.res;
                 console.log(arr[0],"::",arr[1]) */


            } catch (err) {
                console.log(err.stack)
                resolve({ "status": false })
            } finally {
                await client.end()
            }
        })
    },
    GetAllQuestions: async () => {

        var client = await postgres.PostgresClientConnect(process.env.DB)

        return new Promise(async (resolve, reject) => {

            try {
                await client.connect();
                const data = await client.query(`SELECT * from questions ;`)
                // console.log("GetAllQuestions::",data.rows)
                resolve(data.rows)
            } catch (err) {
                console.log(err.stack)
                resolve(false)
            } finally {
                await client.end();
            }
        })
    },
    DelUser: async (id) => {
        console.log("DelUser::", id)
        var client = await postgres.PostgresClientConnect(process.env.DB)
        return new Promise(async (resolve, reject) => {
            try {

                await client.connect();
                await client.query(`DELETE from candidates WHERE id='${id}';`)
                console.log("delted")
                resolve({ "status": true })

            } catch (err) {
                console.log(err.stack)
                resolve({ "status": false })
            } finally {
                await client.end()
            }
        })
    },
    AddAdmin: async (data) => {
        // console.log("test::",data)
        const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date();
        const month = monthArr[d.getMonth()];
        const currentDate = d.getDate() + "-" + month + "-" + d.getFullYear();
        // console.log(currentDate)
        var client = await postgres.PostgresClientConnect(process.env.DB)

        return new Promise(async (resolve, reject) => {

            try {

                await client.connect();
                await client.query(`INSERT INTO candidates ( "fullname", "email", "usertype", "age", "contact", "password", "experience", "applied", "status", "date", "marks", "response")  
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [data.fullname, data.email, "admin", 0, 0, data.password, 'fresher', `${false}`, "", currentDate, `${null}`, `${null}`]);

                resolve(true)
            } catch (err) {
                console.log(err.stack)
                resolve(false)
            } finally {
                await client.end();
            }
        })
    },
    SetQuestion: async (data) => {

        var client = await postgres.PostgresClientConnect(process.env.DB)

        return new Promise(async (resolve, reject) => {

            try {

                await client.connect();
                await client.query(`INSERT INTO questions ("question","opt1","opt2","opt3","opt4","ans","type", "category")
                VALUES( $1, $2, $3, $4, $5, $6, $7, $8)`, [data.question, data.opt1, data.opt2, data.opt3, data.opt4, data.ans, data.type, data.category])
                console.log("inserted")
                resolve(true)
            } catch (err) {
                console.log(err.detail)
                resolve(false)
            } finally {
                await client.end();
            }
        })
    },
    DelQuestion: async (QueID) => {
        var client = await postgres.PostgresClientConnect(process.env.DB)
        return new Promise(async (resolve, reject) => {

            try {
                await client.connect();
                await client.query(`DELETE from questions WHERE id='${QueID}';`);
                // console.log("deleted successfully")
                resolve(true)
            } catch (err) {
                console.log(err)
                resolve(false)
            } finally {
                await client.end();
            }

        })
    },
    UpdateQue: async (data) => {
        // console.log("UpdateQue::", data)
        var client = await postgres.PostgresClientConnect(process.env.DB);
        return new Promise(async (resolve, reject) => {

            try {
                await client.connect();
                await client.query(`UPDATE questions SET question='${data.question}', opt1='${data.opt1}',
                                     opt2='${data.opt2}', opt3='${data.opt3}', opt4='${data.opt4}',
                                     ans='${data.ans}', type='${data.type}', category='${data.category}'
                                     WHERE id='${data.id}';`
                )
                // console.log("updated");
                resolve(true)
            } catch (err) {
                console.log(err);
                resolve(false)
            } finally {
                await client.end();
            }
        })
    },
    BulkQuestions: async (data) => {
        // console.log("BulkQuestions::", data)
        var client = await postgres.PostgresClientConnect(process.env.DB);
        return new Promise(async (resolve, reject) => {

            try {
                await client.connect();
                // await client.query(`TRUNCATE TABLE questions;`)
                // console.log("trunceted")
                for (const v of data) {
                    // console.log(i,"::",v)
                    await client.query(`INSERT INTO questions ( "question", "opt1", "opt2", "opt3", "opt4", "ans", "type", "category")  
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [v.question, v.opt1, v.opt2, v.opt3, v.opt4, v.ans, v.type, v.category]);
                }
                resolve(true)
                // console.log("inserted")
            } catch (err) {
                console.log(err)
                resolve(false)
            } finally {
                await client.end()
            }
        })

    },
    ResetExam: async (resetID) => {
        var client = await postgres.PostgresClientConnect(process.env.DB)
        return new Promise(async (resolve, reject) => {

            try {
                await client.connect();
                await client.query(`UPDATE candidates SET applied='${false}', status='',marks='${null}',response='${null}' WHERE id='${resetID}';`)
                //  console.log("reset successfull");
                resolve(true)
            } catch (err) {
                console.log(err);
                resolve(false)
            } finally {
                await client.end();
            }

        })

    }

}