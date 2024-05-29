import React from 'react'

function Footer() {
    return (
        <section className="footer-dark">
            <div className="footer-copyright-center">Copyright © Time Tracker{' '}
                {new Date().getFullYear()}
                </div>
        </section>
    )
}

export default Footer
