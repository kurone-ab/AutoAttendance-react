import React from 'react'
import PlaceSearcher from "./PlaceSearcher";
import PlaceView from "./PlaceView";

const Main = (props) => {
    return (
        <div>
            <PlaceSearcher {...props}/>
            <PlaceView {...props}/>
        </div>
    )
}

export default Main