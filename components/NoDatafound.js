import Image from "next/image";


const NoDatafound = () => {
    return (
        <tr className="bg-white">
            <td colSpan={4} className='bg-transparent'>
                <div className="text-center">
                    <Image height={180} width={180} src='/assets/img/nodata.png' alt="no_data_found" className="img-fluid" />
                </div>
            </td>
        </tr>
    );
};

export default NoDatafound;
