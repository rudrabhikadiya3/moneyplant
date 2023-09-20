import { dateConvert } from "@/helper/common";
import { withSessionSsr } from "@/helper/session";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate'
import $ from 'jquery';
import NoDatafound from "@/components/NoDatafound";
import moment from "moment";
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import TableLoader from "@/components/TableLoader";

const myaccount = ({ user }) => {
  const [txnHistory, setTxnHistory] = useState([]);
  const [page, setPage] = useState(0)
  const [TotalPage, setTotalPage] = useState(0)
  const [type, setType] = useState()
  const [orderColumn, setOrderColumn] = useState(0)
  const [order, setOrder] = useState(-1)
  const [userData, setUserData] = useState({});
  const [status, setStatus] = useState();

  const [txnDataLoader, setTxnDataLoader] = useState(false);

  const date = moment(new Date()).subtract(1, 'months')
  const [dateRange, setDateRange] = useState([date['_d'], date['_i']])
  const [startDate, endDate] = dateRange
  const st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime() / 1000
  const ed = new Date(moment(moment(endDate).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')
  ).getTime() / 1000

  const getTxnHistory = async () => {
    setTxnDataLoader(true)
    const res = await fetch(process.env.APIURL + 'gettxnhistory', {
      method: 'POST',
      body: JSON.stringify({
        page: page,
        type,
        order: order,
        orderColumn: orderColumn,
        user,
        status,
        st,
        ed
      }),
      headers: {
        'Accept': 'application/json',
      },
    })
    const resData = await res.json()
    if (resData.status) {
      setTxnHistory(resData.data.txns)
      setTotalPage(resData.data.totalPage)
    }
    setTxnDataLoader(false)
  }

  useEffect(() => {
    getTxnHistory()
  }, [page, order, orderColumn])

  const pagginationHandler = (page) => {
    setPage(page.selected)
  }

  const sorting = (or, dest) => {
    setOrderColumn(or)
    setOrder(dest)
  }

  const handleCopy = () => {
    $("#copyIcon").removeClass('bi-clipboard');
    $("#copyIcon").removeClass('bi');
    $("#copyIcon").addClass('bi bi-clipboard-check text-success');
    navigator?.clipboard?.writeText(userData.referralCode) ?? false;
  }

  return (
    <section className="header-pt">
      <div className="container">
        <div className="row">

          <div className="border box-card px-3">

          </div>

        </div>
      </div>
    </section>
  )
};

export default myaccount;

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  if (req.session.userSession) {
    return {
      props: { user: req.session.userSession, title: 'Account' }
    }
  } else {
    return {
      redirect: {
        destination: '/login'
      }
    }
  }
})
