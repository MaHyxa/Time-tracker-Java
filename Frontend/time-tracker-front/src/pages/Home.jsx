import React from 'react'

function Home() {
    return (
        <div>
            <div className="pagewrap">
                <section className="welcome">
                    <div className="container-9">
                        <div className="hero-wrapper">
                            <div className="hero-split"><h1 className="heading-3">Welcome to Time Tracker!</h1>
                                <p className="margin-bottom-24px">Current web service was designed as an open-source
                                    non-commercial
                                    project to help people track their time on different daily tasks.</p><a
                                    className="button-primary-3 w-button" href="/register">free sign up</a></div>
                            <div className="hero-split"><img alt="" className="shadow-two" loading="lazy"
                                                             sizes="(max-width: 479px) 92vw, (max-width: 767px) 94vw, (max-width: 991px) 525px, 432.390625px"
                                                             src="https://assets-global.website-files.com/664cb48da27c78324389e462/664de0d159b6a4fe05f9d3dc_shutterstock_80580652.jpg"
                                                             srcSet="https://assets-global.website-files.com/664cb48da27c78324389e462/664de0d159b6a4fe05f9d3dc_shutterstock_80580652-p-500.jpg 500w, https://assets-global.website-files.com/664cb48da27c78324389e462/664de0d159b6a4fe05f9d3dc_shutterstock_80580652-p-800.jpg 800w, https://assets-global.website-files.com/664cb48da27c78324389e462/664de0d159b6a4fe05f9d3dc_shutterstock_80580652-p-1080.jpg 1080w, https://assets-global.website-files.com/664cb48da27c78324389e462/664de0d159b6a4fe05f9d3dc_shutterstock_80580652-p-1600.jpg 1600w, https://assets-global.website-files.com/664cb48da27c78324389e462/664de0d159b6a4fe05f9d3dc_shutterstock_80580652-p-2000.jpg 2000w, https://assets-global.website-files.com/664cb48da27c78324389e462/664de0d159b6a4fe05f9d3dc_shutterstock_80580652.jpg 2560w"
                                                             width="525"/></div>
                        </div>
                    </div>
                </section>
                <section className="features-list">
                    <div className="container-7">
                        <div className="features-wrapper-two">
                            <div className="features-left"><h3 className="heading-4"><br/>Your Time has a great value!
                            </h3>
                                <p className="features-paragraph">Once you master your time management - you will be
                                    able to accomplish
                                    any of your dream! <br/><br/>And we are here to help you with that!</p></div>
                            <ul className="features-right w-list-unstyled">
                                <li className="features-block-two"><img alt="" className="features-image" loading="lazy"
                                                                        src="https://assets-global.website-files.com/664cb48da27c78324389e462/664e01ef892f433fcfee48e7_multitask.png"
                                                                        width="40"/>
                                    <p className="paragraph-2">Track as many tasks at once as you need!</p></li>
                                <li className="features-block-two _6"><img alt="" className="features-image"
                                                                           loading="lazy"
                                                                           src="https://assets-global.website-files.com/664cb48da27c78324389e462/664e026cdeaf6219c968c2b9_graph.png"/>
                                    <p className="paragraph-2 _2">Get a detailed report for each day!</p></li>
                                <li className="features-block-two"><img alt="" className="features-image" loading="lazy"
                                                                        src="https://assets-global.website-files.com/664cb48da27c78324389e462/664e04b88523869c6ec4da4e_report%202.png"/>
                                    <p className="paragraph-2">Watch the overall statistics of your productivity.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="github">
                    <div className="container-8">
                        <div className="hero-wrapper-two"><h1 className="blend-text">Source code available on
                            GitHub</h1>
                            <p className="margin-bottom-24px-2">Service was created for training purposes. The entire
                                project code,
                                along with installation instructions, can be found on GitHub under the GNU GPL v3.0.</p>
                            <a
                                className="button-primary-3 w-button" href="https://github.com/MaHyxa/Time-tracker-Java"
                                target="_blank" rel="noopener noreferrer">Get Code for free</a></div>
                    </div>
                </section>
                <section className="contact">
                    <div className="container-10">
                        <div className="hero-wrapper-2">
                            <div className="hero-split-2"><img alt="" className="shadow-two-2" loading="lazy"
                                                               sizes="(max-width: 479px) 94vw, (max-width: 673px) 95vw, (max-width: 991px) 640px, (max-width: 1279px) 43vw, 432.375px"
                                                               src="https://assets-global.website-files.com/664cb48da27c78324389e462/664dfb8e77497da983004d6a_Contact.jpg"
                                                               srcSet="https://assets-global.website-files.com/664cb48da27c78324389e462/664dfb8e77497da983004d6a_Contact-p-500.jpg 500w, https://assets-global.website-files.com/664cb48da27c78324389e462/664dfb8e77497da983004d6a_Contact.jpg 640w"/>
                            </div>
                            <div className="hero-split-2"><h1>Contacts</h1>
                                <p className="text-span">If you have any suggestions or offers for improving current
                                    service do not
                                    hesitate to message me on <a className="link-3"
                                                                 href="mailto:nybaster@gmail.com?subject=Greetings%20from%20TimeTracker">Email </a>
                                    or <a className="link-3" href="http://t.me/MaHyxa"
                                          target="_blank" rel="noopener noreferrer">Telegram</a>.<br/><br/>Email:<br/>nybaster@gmail.com
                                </p><a
                                    className="button-primary-3 w-button"
                                    href="mailto:nybaster@gmail.com?subject=Greetings%20from%20TimeTracker">contact via
                                    email</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Home