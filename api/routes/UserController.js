/* var express = require('express');
var router = express.Router(); */
// var jwt = require('jsonwebtoken');
const { post } = require('.');
var postgres=require('../model/PostgreDB');

module.exports = {
    register: async (req, res) => {
        // var body=req.body;
        // console.log(req.body)
        const status=await postgres.RegCandidate(req.body)
        res.send(status)
    },
    login:async(req,res)=>{
        const status=await postgres.Login(req.body)
        // console.log("jwt::",v4())
        // console.log(status)
        res.send(status)
    },
    checkApplied:async(req,res)=>{
        const status=await postgres.CheckApplied(req.body.email)
        res.send(status)
    },
    getUser:async(req,res)=>{
        const status=await postgres.GetCandidates(req.body.usertype);
        res.send(status)
    },
    delUser:async(req,res)=>{
        // console.log("delUser::",req.body)
        const data=await postgres.DelUser(req.body.id)
        res.send(data)
    },
    addAdmin:async(req,res)=>{
        // console.log("addAdmin::",req.body)
        const status=await postgres.AddAdmin(req.body)
        // console.log("addAdmin::",status)
        res.send(status)
    },
    resetExam:async(req,res)=>{
        // console.log("delCandidate::",req.body)
        const status=await postgres.ResetExam(req.body.id)
        res.send(status)
    }
}

