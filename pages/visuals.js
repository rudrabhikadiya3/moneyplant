
import { withSessionSsr } from "@/helper/session";
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic'
const Tree = dynamic(() => import('react-d3-tree'), { ssr: false })
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify'
import $ from 'jquery'
import Link from "next/link";

const visuals = ({ user }) => {
  const [treeData, setTreeData] = useState({});
  const [crrUser, setCrrUser] = useState({});

  const getTreeData = async () => {
    const res = await fetch(process.env.APIURL + 'gettree', {
      method: 'POST',
      body: JSON.stringify({ user }),
      headers: {
        'Accept': 'application/json',
      },
    })
    const resData = await res.json()
    if (resData.status) {
      setTreeData(resData.data.tree)
      setCrrUser(resData.data.userData)
    }
  }

  useEffect(() => {
    getTreeData()
  }, [])

  const translate = { x: 645, y: 92 }
  const deleteNode = async (name) => {
    if (name !== crrUser.username) {
      const alert = await Swal.fire({
        title: `Are you sure?`,
        text: `Do you want to remove ${name} from your tree?`,
        icon: `question`,
        showCancelButton: true,
        confirmButtonColor: '#59c0ef',
        cancelButtonColor: '#838383',
        confirmButtonText: 'Remove',
      })

      if (alert.isConfirmed) {
        const res = await fetch(process.env.APIURL + 'deletechild', {
          method: 'POST',
          body: JSON.stringify({ user, remove: name }),
          headers: {
            'Accept': 'application/json'
          },
        })
        const resData = await res.json()
        if (resData.status) {
          toast.success(resData.msg)
          getTreeData()
        }
      }
    }
  }

  const renderRectSvgNode = ({ nodeDatum }) => {
    return (
      <g>
        <circle
          r="15"
          className="node-circle"
          onClick={() => deleteNode(nodeDatum.name)}
          id='circleNode'
          title='remove from chain'
        >
        </circle>
        <text fill="black" strokeWidth="1" x="20" y='5' className='rd3t-label__title '>
          {nodeDatum.name}
        </text>
      </g>
    )
  }

  const handleCopy = () => {
    $("#copyIcon").removeClass('bi-clipboard')
    $("#copyIcon").removeClass('bi')
    $("#copyIcon").addClass('bi bi-clipboard-check text-success')
    navigator?.clipboard?.writeText(crrUser.referral) ?? false
  }

  return (
    <div className="container">
      <div className="box-card border p-3 referralcode col-2">
        <p className="text-dark h5">How to refer friends?</p>
        <ol>
          <li>Ask a friend to <Link href="/register" className="link">register</Link> in {process.env.SITE_NAME}&#8482;</li>
          <li>During Sign In process, enter all necessary things and in Referral Code(last), enter below code</li>
          <li>Once your friend register with your code, it will reflect side tree</li>
        </ol>
        <div className="text-center mt-2 d-flex justify-content-center">
          <h3 className=" m-0 me-3 text-dark">{crrUser.referral}</h3>
          <button onClick={handleCopy} className='copy-btn text-dark'>
            <i className="bi bi-clipboard" id="copyIcon" />
          </button>
        </div>
      </div>

      <div id="treeWrapper" className='pt-5 mt-3'>
        <Tree
          data={treeData}
          orientation='vertical'
          zoom={0.6}
          translate={translate}
          pannable={true}
          collapsible={false}
          rootNodeClassName="node__root"
          renderCustomNodeElement={renderRectSvgNode}
        />
        <ToastContainer />
      </div>
    </div>

  )
};

export default visuals;



export const getServerSideProps = withSessionSsr(async ({ req }) => {
  if (req.session.userSession) {
    return {
      props: { user: req.session.userSession, title: 'Tree' }
    }
  } else {
    return {
      redirect: {
        destination: '/login'
      }
    }
  }
})

