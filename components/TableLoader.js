import React from "react";

const TableLoader = ({ colSpan }) => {
    return (
        <tr className='text-center'>
            <td colSpan={colSpan} className='text-center'>
                <div className="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </td>
        </tr>
    )
};

export default TableLoader;
