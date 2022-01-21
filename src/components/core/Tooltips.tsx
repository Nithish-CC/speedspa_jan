import React from 'react'
import Tooltip from 'react-bootstrap/Tooltip'

const Tooltips = (props: any) => {
    const { title, startTime,endTime,show } = props
   
    return (
        <>
       {show &&
        (<React.Fragment>
            <Tooltip placement="right" className="in" id="tooltip-right">
             {title} {startTime} - {endTime}
            </Tooltip>
        </React.Fragment>)
       }
       </>
    )
}

export default Tooltips;
