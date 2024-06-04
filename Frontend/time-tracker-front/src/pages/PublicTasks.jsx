import React from 'react'
import {Link} from "react-router-dom";
import PageTemplate from "../component/PageTemplate"

function PublicTasks() {
    return (
        <PageTemplate>
            <img
                src="https://assets-global.website-files.com/664cb48da27c78324389e462/664cb48da27c78324389e502_Page%20Not%20Found%20Icon.svg"
                loading="lazy" alt="" className="icon large"/>
            <h1 className="heading h1">Under Construction</h1>
            <p className="paragraph">Current page is in development. In future this page will allow you to assign tasks
                for another people!</p>
            <div className="spacer _24"></div>
            <Link to="/" className="button w-button">
                Go to Home
            </Link>
        </PageTemplate>

    )
}

export default PublicTasks
