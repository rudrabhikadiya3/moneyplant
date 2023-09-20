import { dateConvert } from "@/helper/common";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate'
import NoDatafound from "@/components/NoDatafound";
import moment from "moment";
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import TableLoader from "@/components/TableLoader";

const TxnHistoryTable = ({ user, sendDataToParent }) => {

  const [txnHistory, setTxnHistory] = useState([]);
  const [page, setPage] = useState(0)
  const [TotalData, setTotalData] = useState(0)
  const [type, setType] = useState()
  const [orderColumn, setOrderColumn] = useState(0)
  const [order, setOrder] = useState(-1)
  // const [userData, setUserData] = useState({});
  const [status, setStatus] = useState();
  const [txnDataLoader, setTxnDataLoader] = useState(false);

  const date = moment(new Date()).subtract(1, 'months')
  const [dateRange, setDateRange] = useState([date['_d'], date['_i']])
  const [startDate, endDate] = dateRange
  const st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime() / 1000
  const ed = new Date(moment(moment(endDate).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')
  ).getTime() / 1000

  const getTxnHistory = async () => {
    // setPage(0)
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
      setTotalData(resData.data.totalData)
    }
    setTxnDataLoader(false)
  }

  useEffect(() => {
    getTxnHistory()
  }, [page, order, orderColumn])

  // useEffect(() => {
  //   getUserInfo()
  // }, [])

  const pagginationHandler = (page) => {
    setPage(page.selected)
  }

  const sorting = (or, dest) => {
    setOrderColumn(or)
    setOrder(dest)
  }

  // const getUserInfo = async () => {
  //   const res = await fetch(process.env.APIURL + 'getuserinfo', {
  //     method: 'POST',
  //     body: JSON.stringify({ user }),
  //     headers: {
  //       'Accept': 'application/json',
  //     },
  //   })

  //   const resData = await res.json()
  //   if (resData.status) {
  //     setUserData(resData.data)
  //   }
  // }

  sendDataToParent(TotalData)

  return (

    <>
      <div className="d-flex align-items-center p-3 my-3 col-12 col-md-10 flex-wrap">
        <div className="col-12 col-md-2 px-2 mb-3 mb-md-0">
          <label className="form-label d-block">Type</label>
          <select onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            <option value="1">Credited</option>
            <option value="0">Debited</option>
          </select>
        </div>
        <div className="col-12 col-md-2 px-2 mb-3 mb-md-0">
          <label className="form-label d-block">Description</label>
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="0">Signup Bonus</option>
            <option value="1">Package Purchase</option>
            <option value="2">1st Level Bonus</option>
            <option value="3">2nd Level Bonus</option>
          </select>
        </div>
        <div className="col-12 col-md-3 px-2 mb-3 mb-md-0">
          <label className="form-label"> Date</label>
          <Flatpickr
            className="flatpicker"
            options={{
              minDate: { startDate },
              maxDate: { endDate },
              defaultDate: [startDate, endDate],
              altInput: true,
              altFormat: 'j M Y',
              dateFormat: 'Y-m-d',
              showMonths: 1,
              mode: 'range',
            }}
            onChange={(update) => {
              setDateRange(update)
            }}
          />
        </div>
        <div className="col-12 col-md-2 align-self-end px-2 mb-3 mb-md-0">
          <button className="btn btn-primary align-self-end col-12" onClick={() => { getTxnHistory(); setPage(0) }} disabled={txnDataLoader}>Search</button>
        </div>
      </div>
      <div className="table-responsive border-top">
        <table className="table text-center table-striped table-hover">
          <thead>
            <tr className="text-center">
              <th className='sort-cell' onClick={() => sorting(0, order == -1 ? 1 : -1)}># <i className={`bi ${orderColumn === 0 ? order == -1 ? 'bi-caret-up-fill' : 'bi-caret-down-fill' : ''}`} /></th>
              <th className='sort-cell' onClick={() => sorting(1, order == -1 ? 1 : -1)}>Amount($) <i className={`bi ${orderColumn === 1 ? order == -1 ? 'bi-caret-up-fill' : 'bi-caret-down-fill' : ''}`} /></th>
              <th className='sort-cell' onClick={() => sorting(2, order == -1 ? 1 : -1)}>Description <i className={`bi ${orderColumn === 2 ? order == -1 ? 'bi-caret-up-fill' : 'bi-caret-down-fill' : ''}`} /></th>
              <th className='sort-cell' onClick={() => sorting(3, order == -1 ? 1 : -1)}>Date <i className={`bi ${orderColumn === 3 ? order == -1 ? 'bi-caret-up-fill' : 'bi-caret-down-fill' : ''}`} /></th>
            </tr>
          </thead>
          <tbody>
            {
              txnDataLoader ? <TableLoader colSpan={4} /> : txnHistory.length ? txnHistory.map((d, i) => {
                return (
                  <tr className="text-center tr-hover" key={i}>
                    <td>{d.cnt}</td>
                    <td className={`amount ${d.type == 0 ? 'text-danger' : 'text-success'}`}>{d.amount}</td>
                    <td>
                      {d.status === 0 && 'Signup Bonus'}
                      {d.status === 1 && 'Package Purchase'}
                      {d.status === 2 && '1st Level Bonus'}
                      {d.status === 3 && '2nd Level Bonus'}
                      {d.status === 4 && 'Wallet Reload'}
                    </td>
                    <td>{dateConvert(d.createdAt)}</td>
                  </tr>
                )
              }) : <NoDatafound />
            }
          </tbody>
        </table>
      </div>
      <div className="pagination-box" id="order-listing_paginate">
        <ReactPaginate
          className="text-end"
          previousLabel={<i className="bi bi-arrow-left" />}
          nextLabel={<i className="bi bi-arrow-right" />}
          breakLabel={'...'}
          breakClassName={'break-me'}
          activeClassName={'current'}
          disabledClassName={'disabled'}
          subContainerClassName={'pages pagination'}
          forcePage={page}
          pageCount={Math.ceil(TotalData / process.env.DATA_PER_VIEW)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(page) => pagginationHandler(page)}
        />
      </div>
    </>
  )
};

export default TxnHistoryTable;
