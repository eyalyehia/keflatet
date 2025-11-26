import React from 'react'


function DonationSectionFrame() {

    return (
        <div id="תרומה" style={{ display: "flex", margin: 0, padding: 0, resize: "both", overflow: "hidden" }} className='w-full'>
            <iframe
                src="https://www.matara.pro/nedarimplus/online/?mosad=7014073"
                title="תשלום תרומה - נדרים פלוס"
                className='md:min-h-[1600px] min-h-[2050px] mx-auto rounded-3xl w-full'
                style={{ border: '0', flexGrow: 1 }}
                scrolling='no'
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
            ></iframe>
        </div>
    )
}

export default DonationSectionFrame
