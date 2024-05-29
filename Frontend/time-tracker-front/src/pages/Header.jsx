import React, {useState} from 'react'

function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="navbar-logo">
            <div className="navbar-logo-left-container shadow-three w-nav" data-animation="default" data-collapse="medium"
                 data-duration="400" data-easing="ease" data-easing2="ease" role="banner">
                <div className="container-3 w-clearfix">
                    <div className="navbar-wrapper"><a aria-current="page" className="navbar-brand w-clearfix w-nav-brand w--current"
                                                       href="/"><img alt="" className="image" loading="eager"
                                                                     src="https://assets-global.website-files.com/664cb48da27c78324389e462/664cb4da4a01a3b42aed2a9f_image.png"
                                                                     width="48"/>
                        <h1 className="heading-2">Time Tracker</h1></a>
                        <nav className="nav-menu-wrapper w-nav-menu" role="navigation">
                            <ul className="nav-menu-two w-list-unstyled">
                                <li className="list-item"><a className="nav-link-accent" href="/login">Log In</a></li>
                            </ul>
                        </nav>
                        <div className="menu-button-2 w-nav-button">
                            <div className="icon-2 w-icon-nav-menu"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
