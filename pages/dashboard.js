import NoDatafound from '@/components/NoDatafound'
import { dateConvert } from '@/helper/common'
import { withSessionSsr } from '@/helper/session'
import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import Chart from 'chart.js/auto'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import TableLoader from '@/components/TableLoader'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import TxnHistoryTable from '@/components/TxnHistoryTable'
import { Badge, Form, Modal } from 'react-bootstrap'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const dashboard = ({ user, pkgtypes }) => {
  const [insights, setInsights] = useState({})
  const [packageHisry, setPackageHisry] = useState([])
  const [page, setPage] = useState(0)
  const [totalData, setTotalData] = useState()
  const [type, setType] = useState('')
  const [orderColumn, setOrderColumn] = useState(0)
  const [order, setOrder] = useState(-1)
  const [chartData, setChartData] = useState([])
  const [pkgDataLoader, setPkgDataLoader] = useState(false)
  const [totalTxn, setTotalTxn] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [orderID, setOrderID] = useState(false)
  const [amount, setAmount] = useState()
  const [paypalErrorMessage, setPaypalErrorMessage] = useState('')

  const date = moment(new Date()).subtract(1, 'months')
  const [dateRange, setDateRange] = useState([date['_d'], date['_i']])
  const [startDate, endDate] = dateRange
  const st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime() / 1000
  const ed = new Date(moment(moment(endDate).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000

  const getUserActivity = async () => {
    const res = await fetch(process.env.APIURL + '/getuseractivity', {
      method: 'POST',
      body: JSON.stringify({ user }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const resData = await res.json()
    setInsights(resData.data)
  }

  const getPkgHistry = async () => {
    setPkgDataLoader(true)
    const res = await fetch(process.env.APIURL + 'getpkghistry', {
      method: 'POST',
      body: JSON.stringify({
        page: page,
        type,
        order: order,
        orderColumn: orderColumn,
        user,
        st,
        ed,
      }),
      headers: {
        Accept: 'application/json',
      },
    })
    const resData = await res.json()
    if (resData.status) {
      setPackageHisry(resData.data.pkg)
      setTotalData(resData.data.totalData)
    }
    setPkgDataLoader(false)
  }

  const getDataForChart = async () => {
    const res = await fetch(process.env.APIURL + 'chartdata', {
      method: 'POST',
      body: JSON.stringify({
        user,
      }),
      headers: {
        Accept: 'application/json',
      },
    })
    const resData = await res.json()
    if (resData.status) {
      setChartData(resData.data)
    }
  }

  const pagginationHandler = (page) => {
    setPage(page.selected)
  }

  const sorting = (or, dest) => {
    setOrderColumn(or)
    setOrder(dest)
  }

  useEffect(() => {
    getPkgHistry()
  }, [page, order, orderColumn])

  useEffect(() => {
    getUserActivity()
    getDataForChart()
  }, [])

  useEffect(() => {
    if (chartData.length) {
      const ctx = document.getElementById('myChart').getContext('2d')
      const dates = chartData.map((d) => d.date)
      const income = chartData.map((d) => d.amount)
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              data: income,
              label: 'Reward',
              borderColor: '#37527e',
              backgroundColor: '#37527e',
              fill: false,
              tension: 0.5,
              color: '',
            },
          ],
          options: {
            scales: {
              xAxes: [
                {
                  type: 'time',
                },
              ],
            },
          },
        },
      })
    }
  }, [chartData])

  const sendDataToParent = (total) => {
    setTotalTxn(total)
  }

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: 0.5 } }],
        // remove the applicaiton_context object if you need your users to add a shipping address
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
      .then((orderID) => {
        setOrderID(orderID)
        return orderID
      })
  }

  const recordTxn = async (amount) => {
    const res = await fetch(process.env.APIURL + 'walletreload', {
      method: 'POST',
      body: JSON.stringify({ amount, user }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const resData = await res.json()
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      if (details.status === 'COMPLETED') {
        const amount = details.purchase_units[0].amount.value
        recordTxn(amount)
        setIsOpen(false)
        getUserActivity()
      }
    })
  }

  const onError = (data, actions) => {
    setPaypalErrorMessage('Something went wrong with your payment')
  }

  return (
    <>
      <div className='container-fluid pageHeading'>
        <div className='container'>
          <h1 className='text-light text-center text-md-start'>Dashboard</h1>
        </div>
      </div>
      <div className='container upper'>
        <div className='row align-items-stretch'>
          <div className='c-dashboardInfo col-lg-3 col-md-6'>
            <div className='wrap'>
              <h4 className='heading heading5 medium-font-weight c-dashboardInfo__title'>Balance</h4>
              <div className='d-flex justify-content-center align-items-center'>
                <span className='caption-12 c-dashboardInfo__count'>${insights.balance}</span>
                <button className='ms-3 addBal' onClick={() => setIsOpen(true)}>
                  +
                </button>
              </div>
            </div>
          </div>
          <div className='c-dashboardInfo col-lg-3 col-md-6'>
            <div className='wrap'>
              <h4 className='heading heading5 medium-font-weight c-dashboardInfo__title'>Purchase</h4>
              <span className='caption-12 c-dashboardInfo__count'>${insights.pkgAmount}</span>
            </div>
          </div>
          <div className='c-dashboardInfo col-lg-3 col-md-6'>
            <div className='wrap'>
              <h4 className='heading heading5 medium-font-weight c-dashboardInfo__title'>Earnings</h4>
              <span className='caption-12 c-dashboardInfo__count'>${insights.earning}</span>
            </div>
          </div>
          <div className='c-dashboardInfo col-lg-3 col-md-6'>
            <div className='wrap'>
              <h4 className='heading heading5 medium-font-weight c-dashboardInfo__title'>Total Referrals</h4>
              <span className='caption-12 c-dashboardInfo__count'>{insights.nodes}</span>
            </div>
          </div>
        </div>
        <div className='row my-5'>
          <div className='col-12 mb-4'>
            <div className='border box-card'>
              <Tabs defaultActiveKey='transaction' className='border-bottom justify-content-center justify-content-md-start'>
                <Tab
                  eventKey='transaction'
                  title={
                    <>
                      Transactions{' '}
                      <Badge bg='secondary' className='tabBadge'>
                        {totalTxn}
                      </Badge>
                    </>
                  }
                >
                  <TxnHistoryTable user={user} sendDataToParent={sendDataToParent} />
                </Tab>
                <Tab
                  eventKey='packages'
                  title={
                    <>
                      {' '}
                      My Packages{' '}
                      <Badge bg='secondary' className='tabBadge'>
                        {totalData}
                      </Badge>
                    </>
                  }
                >
                  <div className='d-flex align-items-center p-3 my-3 col-12 col-md-6 flex-wrap'>
                    <div className='col-12 col-md-3 px-2 mb-3 mb-md-0'>
                      <label className='form-label d-block'>Package</label>
                      <select
                        onChange={(e) => {
                          setType(e.target.value)
                          setPage(0)
                        }}
                      >
                        <option value=''>All</option>
                        {pkgtypes.map((d, i) => (
                          <option value={d._id} key={i}>
                            {' '}
                            {d.name}{' '}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='col-12 col-md-5 px-2 mb-3 mb-md-0'>
                      <label className='form-label'>Date</label>
                      <Flatpickr
                        className='flatpicker'
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
                    <div className='col-12 col-md-3 align-self-end px-2 mb-3 mb-md-0'>
                      <button className='btn btn-primary align-self-end col-12' onClick={getPkgHistry} disabled={pkgDataLoader}>
                        Search
                      </button>
                    </div>
                  </div>
                  <div className='table-responsive border-top'>
                    <table className='table text-center table-striped table-hover'>
                      <thead>
                        <tr>
                          <th className='sort-cell' onClick={() => sorting(0, order == -1 ? 1 : -1)}>
                            # <i className={`bi ${orderColumn === 0 ? (order == -1 ? 'bi-caret-up-fill' : 'bi-caret-down-fill') : ''}`} />
                          </th>
                          <th className='sort-cell' onClick={() => sorting(1, order == -1 ? 1 : -1)}>
                            Package <i className={`bi ${orderColumn === 1 ? (order == -1 ? 'bi-caret-up-fill' : 'bi-caret-down-fill') : ''}`} />
                          </th>
                          <th className='sort-cell' onClick={() => sorting(2, order == -1 ? 1 : -1)}>
                            Amount <i className={`bi ${orderColumn === 2 ? (order == -1 ? 'bi-caret-up-fill' : 'bi-caret-down-fill') : ''}`} />
                          </th>
                          <th className='sort-cell' onClick={() => sorting(3, order == -1 ? 1 : -1)}>
                            Purachased At <i className={`bi ${orderColumn === 3 ? (order == -1 ? 'bi-caret-up-fill' : 'bi-caret-down-fill') : ''}`} />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pkgDataLoader ? (
                          <TableLoader colSpan={4} />
                        ) : packageHisry.length ? (
                          packageHisry.map((d, i = 3) => {
                            return (
                              <tr key={i} className='tr-hover'>
                                <th>{d.cnt}</th>
                                <td>{d.pkgName}</td>
                                <td>${d.amount}</td>
                                <td>{dateConvert(d.createdAt)}</td>
                              </tr>
                            )
                          })
                        ) : (
                          <NoDatafound />
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className='pagination-box' id='order-listing_paginate'>
                    <ReactPaginate
                      className='text-end'
                      previousLabel={<i className='bi bi-arrow-left' />}
                      nextLabel={<i className='bi bi-arrow-right' />}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      activeClassName={'current'}
                      disabledClassName={'disabled'}
                      subContainerClassName={'pages pagination'}
                      forcePage={page}
                      pageCount={Math.ceil(totalData / process.env.DATA_PER_VIEW)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={(page) => pagginationHandler(page)}
                    />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>

          <div className='col-12'>
            <div className='box-card border p-3'>
              {chartData.length ? (
                <canvas id='myChart'></canvas>
              ) : (
                <>
                  <h4 className='text-center text-dark'>You haven't earn any reward yet</h4>
                  <p className='text-center'>
                    Refer friends, when they buy one of our packages, EARN REWARDS and your earning's chart will appear here{' '}
                  </p>
                </>
              )}
            </div>
          </div>
          {isOpen && (
            <Modal show={isOpen} centered onHide={() => setIsOpen(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add balance</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Amount: </Form.Label>
                  <Form.Control type='text' placeholder='Amount' onChange={(e) => setAmount(e.target.value)} />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                {/* <Button variant="primary">Submit</Button> */}
                {/* <PayPalScriptProvider options={{ "client-id": 'AVVRFMh_J10y-0y693ltBi_161G-Nu7RdIterCq9sD3u5TH7LWOoxlxJjOsOYQl_-A_atwVXVe4OXAoP', components: 'buttons' }}> */}
                <PayPalButtons
                  style={{
                    color: 'blue',
                    shape: 'pill',
                    label: 'pay',
                    tagline: false,
                    layout: 'horizontal',
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
                {/* <div id="paypal-express-btn"></div> */}
                {/* </PayPalScriptProvider> */}
              </Modal.Footer>
            </Modal>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  if (req.session.userSession) {
    const res = await fetch(process.env.APIURL + 'packages/get_packages', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
    const resData = await res.json()
    return {
      props: { user: req.session.userSession, pkgtypes: resData.data, title: 'Dashboard' },
    }
  } else {
    return {
      redirect: {
        destination: '/login',
      },
    }
  }
})

export default dashboard
