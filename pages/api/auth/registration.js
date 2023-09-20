import { chk_email, chk_password, chk_username, refCode, enc, NOW, } from "@/helper/common";
import dbConnect from "@/helper/dbConnect";
import mongoose from "mongoose";
import Users from '../../../models/Users';
import TxnHistory from '../../../models/TxnHistory';

export default async function registration(req, res) {

  let resData = [false, [], '']
  const { method, body } = req
  if (method === 'POST') {
    try {
      const user = JSON.parse(body)
      let newRefCode = null
      let userId = 'A1'
      let total_user;
      if (chk_username(user.name)) {
        if (chk_email(user.email)) {
          if (chk_password(user.paswd)) {
            await dbConnect()
            total_user = await Users.find({}).count()
            newRefCode = refCode() + parseFloat(total_user + 1)
            userId = 'A' + parseFloat(total_user + 1)
            const isNameExist = await Users.findOne({ username: user.name }).count()
            if (!isNameExist) {
              const isEmailExist = await Users.findOne({ email: user.email }).count()
              if (!isEmailExist) {
                const hisSponsor = await Users.findOne({ referralCode: user.referral }, { _id: 0, userId: 1 }).lean()
                if (total_user > 0) {
                  if (hisSponsor) {
                    let childOf;
                    const numberChild = await Users.find({ childOf: hisSponsor.userId }).count()

                    if (numberChild == 2) {
                      // ... but the room is full of nodes
                      const findChild = await Users.find({ childOf: hisSponsor.userId }, { _id: 0, userId: 1 }).lean()
                      const blockedBy = []
                      findChild.map(d => blockedBy.push(d.userId))

                      for (let i = 0; i < blockedBy.length; i++) {
                        const blockerChild = await Users.find({ childOf: blockedBy[i] }, { _id: 0, userId: 1 }).lean()
                        if (blockerChild.length < 2) {
                          // there is one or both spaces are empty
                          childOf = blockedBy[i]
                          break;
                        } else {
                          // no space available; get a blocker child and push into an array(In which, this loop is running on) and another iterations...
                          blockerChild.map(d => blockedBy.push(d.userId))
                        }
                      }
                    } else {
                      // simpally, try to make its sponsor's child
                      childOf = hisSponsor.userId
                    }

                    const addUser = await Users.create({
                      _id: new mongoose.Types.ObjectId(),
                      userId: userId,
                      username: user.name,
                      email: user.email,
                      paswd: enc(user.paswd, process.env.PASWD_KEY),
                      referralCode: newRefCode,
                      sponsor: hisSponsor.userId,
                      childOf: childOf,
                      createdAt: NOW()
                    })
                    await TxnHistory.create({
                      _id: new mongoose.Types.ObjectId(),
                      amount: process.env.SIGNUP_BONUS,
                      userId: addUser._id,
                      type: 1,
                      status: 0,
                      createdAt: NOW()
                    })

                    resData[0] = true
                    resData[1] = []
                    resData[2] = 'You are successfully registered'
                  } else {
                    resData[0] = false
                    resData[2] = 'Invalid referral code'
                  }
                } else {
                  const addUser = await Users.create({
                    _id: new mongoose.Types.ObjectId(),
                    userId: userId,
                    username: user.name,
                    email: user.email,
                    paswd: enc(user.paswd, process.env.PASWD_KEY),
                    referralCode: newRefCode,
                    sponsor: null,
                    childOf: null,
                    createdAt: NOW()
                  })

                  await TxnHistory.create({
                    _id: new mongoose.Types.ObjectId(),
                    amount: process.env.SIGNUP_BONUS,
                    userId: addUser._id,
                    type: 1,
                    status: 0,
                    createdAt: NOW()
                  })
                  resData[0] = true
                  resData[1] = []
                  resData[2] = 'Welcome to ' + process.env.SITE_NAME
                }
              } else {
                resData[0] = false
                resData[2] = 'email ' + user.email + ' is already registered'
              }
            } else {
              resData[0] = false
              resData[2] = 'username ' + user.name + ' is already exist. Please try diffrent name'
            }
          } else {
            resData[2] = 'Invalid Password'
          }
        } else {
          resData[2] = 'Invalid email'
        }
      } else {
        resData[2] = 'Invalid username'
      }
    } catch (e) {
      console.log('registation err', e.message);
    }
  } else {
    resData[2] = method + ' method is not allowed'
  }
  return res.json({ status: resData[0], data: resData[1], msg: resData[2] })
}