import { dec, getDates, NOW, UTStoDate, } from "./common"
import dbConnect from "./dbConnect"
import Users from '../models/Users';
import Packages from '../models/Packages';
import PkgbuyHistory from '../models/PkgbuyHistory';
import TxnHistory from '../models/TxnHistory';
import mongoose from 'mongoose';

let resData = [false, [], '']
export async function buypackage(req) {
  const { method, body } = req
  const pkgData = JSON.parse(body)
  try {
    if (method === 'POST') {
      if (pkgData.package) {
        if (pkgData.buyer) {
          const buyer_id = dec(pkgData.buyer, process.env.USER_SESSION_KEY)
          await dbConnect()
          const buyerData = await Users.findOne({ _id: buyer_id }, { _id: 0, balance: 1, sponsor: 1, childOf: 1 }).lean()
          const pkgDetails = await Packages.findOne({ _id: pkgData.package }, 'price').lean()

          if (parseFloat(buyerData.balance) >= parseFloat(pkgDetails.price)) {
            // cut package price
            await Users.updateOne(
              { _id: buyer_id },
              { $inc: { balance: -parseFloat(pkgDetails.price) } }
            )
            // record txn (pckg amount cut)
            await TxnHistory.create({
              _id: new mongoose.Types.ObjectId(),
              userId: buyer_id,
              amount: pkgDetails.price,
              type: 0,
              status: 1,
              createdAt: NOW()
            })

            // provide him package
            await PkgbuyHistory.create({
              _id: new mongoose.Types.ObjectId(),
              buyer: buyer_id,
              pkg: pkgDetails._id,
              amount: pkgDetails.price,
              createdAt: NOW()
            })
            // provide commision...
            // 1st level reward
            if (buyerData.sponsor) {
              const fstSponsor = await Users.findOne({ userId: buyerData.sponsor }, '_id').lean()
              await TxnHistory.create({
                _id: new mongoose.Types.ObjectId(),
                userId: fstSponsor._id,
                amount: (pkgDetails.price * (process.env.FIRST_LVL_REWARD / 100)),
                type: 1,
                status: 2,
                createdAt: NOW()
              })
              await Users.updateOne(
                { _id: fstSponsor._id },
                { $inc: { balance: parseFloat((pkgDetails.price * (process.env.FIRST_LVL_REWARD / 100))) } }
              )
            }
            // 2nd level reward
            if (buyerData.childOf) {
              const secondSponsor = await Users.findOne({ userId: buyerData.childOf }, '_id').lean()
              if (secondSponsor) {
                await TxnHistory.create({
                  _id: new mongoose.Types.ObjectId(),
                  userId: secondSponsor._id,
                  amount: pkgDetails.price * (process.env.SECOND_LVL_REWARD / 100),
                  type: 1,
                  status: 3,
                  createdAt: NOW()
                })
                await Users.updateOne(
                  { _id: secondSponsor._id },
                  { $inc: { balance: parseFloat(pkgDetails.price * (process.env.SECOND_LVL_REWARD / 100)) } }
                )
              }
            }

            resData[0] = true
            resData[1] = []
            resData[2] = `Successfully purchased`
          } else {
            resData[2] = `Not enough balance`
          }
        } else {
          resData[2] = `Can't get buyer id`
        }
      } else {
        resData[2] = `Can't get package id`
      }
    } else {
      resData[2] = `${method} method is not allowed`

    }
  } catch (e) {
    console.log(e.message);

    resData[0] = false
    resData[2] = `Something went wrong`
  }
  return resData
}

export async function getuseractivity({ method, body }) {
  try {
    if (method === 'POST') {
      const userId = dec(body.user, process.env.USER_SESSION_KEY)
      await dbConnect()
      const purchased = await PkgbuyHistory.aggregate([
        { $match: { buyer: userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])

      const earning = await TxnHistory.aggregate([
        { $match: { $and: [{ $or: [{ status: 2 }, { status: 3 }] }, { userId: userId }] } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])

      const userInfo = await Users.findOne({ _id: userId }, { _id: 0, userId: 1, balance: 1 }).lean()
      const nodes = await Users.find({ sponsor: userInfo.userId }).count().lean()

      resData[0] = true
      resData[1] = {
        pkgAmount: purchased.length > 0 ? parseFloat(purchased[0].total) : 0,
        earning: earning.length > 0 ? parseFloat(earning[0].total) : 0,
        nodes,
        balance: parseFloat(userInfo.balance)
      }
      resData[2] = ''
    } else {
      resData[0] = false
      resData[2] = `${method} method is not allowed`
    }
  } catch (e) {
    console.log(e.message);
    resData[0] = false
    resData[2] = `Something went wrong`
  }
  return resData
}

export async function gettree(req) {

  const { method, body } = req
  try {
    if (method === 'POST') {
      const userId = dec(JSON.parse(body).user, process.env.USER_SESSION_KEY)

      await dbConnect()
      const findUser = await Users.find({ _id: userId }, { _id: 0, childOf: 1, userId: 1, username: 1, referralCode: 1 }).lean()
      let children = [{ userId: findUser[0].userId, childOf: null, name: findUser[0].username }]
      delete children.username

      for (let i = 0; i < findUser.length; i++) {
        const findChild = await Users.find({ childOf: findUser[i].userId }, { _id: 0, userId: 1, username: 1, childOf: 1 }).lean()
        findChild.map(ch =>
          findUser.push({ userId: ch.userId })
        )
        if (findChild.length) {
          findChild.map(ch => children.push({ userId: ch.userId, name: ch.username, childOf: ch.childOf }))
        }
      }

      const idMapping = children.reduce((acc, el, i) => {
        acc[el.userId] = i;
        return acc;
      }, {});

      let root;
      children.forEach((el) => {
        if (el.childOf === null) {
          root = el
          return;
        }
        const parentEl = children[idMapping[el.childOf]];
        // <-- secondary stuffs
        delete parentEl.userId
        delete parentEl.childOf

        if (parentEl.children) {
          delete parentEl.children[0].userId
          delete parentEl.children[0].childOf
        }
        // secondary stuffs -->

        parentEl.children = [...(parentEl.children || []), el];
      });

      resData[0] = true
      resData[1] = { tree: root, userData: { username: findUser[0].username, referral: findUser[0].referralCode } }
      resData[2] = ''
    } else {
      resData[2] = `${method} method is not allowed`
    }
  } catch (e) {
    console.log(e.message);
    resData[2] = `Something went wrong`
  }
  return resData

}

export async function gettxnhistory({ method, body }) {

  try {
    if (method === 'POST') {
      const { page, order, orderColumn, type, user, status, st, ed } = JSON.parse(body)
      const fields = ['createdAt', 'amount', 'status', 'createdAt']
      const userId = dec(user, process.env.USER_SESSION_KEY)

      const orderColumns = fields[orderColumn]
      const limit = process.env.DATA_PER_VIEW

      const dynamicQry = [{ userId }, { createdAt: { $gte: st } }, { createdAt: { $lte: ed } }]
      if (type) {
        dynamicQry.push({ type: type })
      }
      if (status) {
        dynamicQry.push({ status: Number(status) })
      }

      await dbConnect()
      const limitedTxnData = await TxnHistory.find({
        $and: dynamicQry,
      }).limit(limit).skip(page * limit).sort({ [orderColumns]: order }).lean()

      const totalData = await TxnHistory.find({
        $and: dynamicQry,
      }).count()

      let a = page * process.env.DATA_PER_VIEW
      let b = totalData - page * process.env.DATA_PER_VIEW

      const dataWithIndex = limitedTxnData.map((d) => {
        return ({ ...d, cnt: order == 1 ? b-- : ++a, amount: parseFloat(d.amount) })
      })
      resData[0] = true
      resData[1] = { txns: dataWithIndex, totalData }

    } else {
      resData[2] = `${method} method is not allowed`
    }
  } catch (e) {
    resData[2] = `Something went wrong`
  }
  return resData

}

export async function getpkghistry(req) {

  const { method, body } = req
  try {
    if (method === 'POST') {
      const { page, order, orderColumn, type, user, st, ed } = JSON.parse(body)
      const fields = [
        'createdAt',
        'pkg',
        'amount',
        'createdAt'
      ]
      const userId = dec(user, process.env.USER_SESSION_KEY)

      const orderColumns = fields[orderColumn]
      const limit = process.env.DATA_PER_VIEW

      const dynamicQry = [{ buyer: userId }, { createdAt: { $gte: st } }, { createdAt: { $lte: ed } }]
      if (type) {
        dynamicQry.push({
          pkg: type,
        })
      }

      await dbConnect()

      const limitedPckgData = await PkgbuyHistory.find({
        $and: dynamicQry,
      }, { _id: 0, buyer: 0 })
        .limit(limit)
        .skip(page * limit)
        .sort({ [orderColumns]: order })
        .lean()

      const totalPackages = await PkgbuyHistory.find({ $and: dynamicQry }).count()

      const agg = await PkgbuyHistory.aggregate([
        {
          $lookup: {
            from: "packages",
            localField: "pkg",
            foreignField: "_id",
            as: "package_docs"
          }
        },
        { $unwind: '$package_docs' },
        { $unset: ['amount', 'buyer', '_id', 'createdAt', 'package_docs._id', 'package_docs.productId', 'package_docs.createdAt'] }
      ])

      const getPkgnameById = (id) => {
        const pckg = agg.filter(d => d.pkg == id)
        return pckg[0].package_docs.name
      }

      const pkg = []

      let a = page * process.env.DATA_PER_VIEW
      let b = totalPackages - page * process.env.DATA_PER_VIEW


      limitedPckgData.map((d) => pkg.push({ ...d, amount: parseFloat(d.amount), pkgName: getPkgnameById(d.pkg), cnt: order == 1 ? b-- : ++a, }))

      resData[0] = true
      resData[1] = {
        pkg,
        totalData: totalPackages,
      }

    } else {
      resData[2] = `${method} method is not allowed`
    }
  } catch (e) {
    console.log("err", e.message);
    resData[2] = `Something went wrong`
  }
  return resData
}

export async function getuserinfo(req) {
  const { method, body } = req
  try {
    if (method === 'POST') {
      const { user } = JSON.parse(body)
      const userId = dec(user, process.env.USER_SESSION_KEY)
      await dbConnect()
      const userData = await Users.findOne({ _id: userId }, { _id: 0, balance: 1, referralCode: 1 }).lean()

      resData[0] = true
      resData[1] = { ...userData, balance: parseFloat(userData.balance) }
      resData[2] = ''

    } else {
      resData[2] = `${method} method is not allowed`
    }
  } catch (e) {
    console.log("err", e.message);
    resData[2] = `Something went wrong`
  }
  return resData
}

// export async function getSponsors({ method, body }) {
//   try {
//     if (method === 'POST') {
//       const { user } = JSON.parse(body)
//       const userId = dec(user, process.env.USER_SESSION_KEY)
//       await dbConnect()
//       const userData = await Users.findOne({ _id: userId }, { _id: 0, sponsor: 1, childOf: 1 }).lean()

//       const sponsor = await Users.findOne({ userId: userData.sponsor }, { _id: 0, username: 1 }).lean()
//       const childOf = await Users.findOne({ userId: userData.childOf }, { _id: 0, username: 1 }).lean()

//       resData[0] = true
//       resData[1] = { sponsor: sponsor?.username, childOf: childOf?.username }
//       resData[2] = ''

//     } else {
//       resData[2] = `${method} method is not allowed`
//     }
//   } catch (e) {
//     resData[2] = `Something went wrong`
//   }
//   return resData
// }

export async function chartdata({ method, body }) {
  try {
    if (method === 'POST') {
      const { user } = JSON.parse(body)
      const userId = dec(user, process.env.USER_SESSION_KEY)

      await dbConnect()
      const earnings = await TxnHistory.find({ userId, status: { $in: [2, 3] }, createdAt: { $lte: NOW() + (86400 * 30) } }, { _id: 0, amount: 1, createdAt: 1 }).lean()
      const chartData = []
      if (earnings.length) {
        const earnData = []
        earnings.map(er => earnData.push({ amount: parseFloat(er.amount), date: UTStoDate(new Date(er.createdAt * 1000)) }))
        const mergedEarnings = earnData.reduce((acc, cur) => {
          const existingEarning = acc.find(e => e.date === cur.date);
          if (existingEarning) {
            existingEarning.amount += cur.amount;
          } else {
            acc.push({ amount: cur.amount, date: cur.date });
          }
          return acc;
        }, []);
        const crrTime = NOW()
        const findDates = getDates(earnings[0].createdAt, crrTime)
        const dateRange = findDates.map(dt => UTStoDate(dt))

        dateRange.forEach(dts => {
          const earningDay = mergedEarnings.find(d => d.date === dts)
          if (earningDay) {
            chartData.push({ amount: earningDay.amount, date: dts })
            return;
          }
          chartData.push({ amount: 0, date: dts })
        })
      }
      resData[0] = true
      resData[1] = chartData
      resData[2] = ''
    } else {
      resData[2] = `${method} method is not allowed`
    }
  } catch (e) {
    console.log("err", e.message);
    resData[2] = `Something went wrong`
  }
  return resData
}
export async function deletechild({ method, body }) {
  try {
    if (method === 'POST') {
      const { user, remove } = JSON.parse(body)
      await dbConnect()

      await Users.updateOne({ username: remove }, { childOf: null })
      resData[0] = true
      resData[1] = {}
      resData[2] = 'Child remove succesfully'
    } else {
      resData[2] = `${method} method is not allowed`
    }
  } catch (e) {
    resData[2] = `Something went wrong`
  }
  return resData
}
export async function walletreload({ method, body }) {
  try {
    if (method === 'POST') {
      const { amount, user } = body
      const userId = dec(user, process.env.USER_SESSION_KEY)
      await dbConnect()
      await TxnHistory.create({
        _id: new mongoose.Types.ObjectId(),
        userId,
        amount,
        type: 1,
        status: 4,
        createdAt: NOW()
      })
      await Users.updateOne({ _id: userId }, { $inc: { balance: amount } })

      resData[0] = true
      resData[1] = []
      resData[2] = 'Transaction successfull'
    } else {
      resData[2] = `${method} method is not allowed`
    }
  } catch (e) {
    resData[2] = `Something went wrong`
  }
  return resData
}
