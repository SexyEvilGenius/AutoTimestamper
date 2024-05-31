
(function() {
    'use strict';
    let timerId = 0;
    function setupVideoListener() {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('pause', saveTimestamp);

            // Ensure the video's parent container can position the button container
            video.parentNode.parentNode.style.position = 'relative';

            // Create a container for the buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'none'; // Hide by default
            buttonContainer.style.position = 'relative';
            buttonContainer.style.top = '10px'; // Positioned at the bottom of the video
            buttonContainer.style.left = '10px'; // Start from the left edge
            buttonContainer.style.backgroundColor = 'rgba(0,0,0,0.5)'; // Semi-transparent black background
            buttonContainer.style.padding = '5px';
            buttonContainer.style.borderRadius = '5px';
            buttonContainer.style.zIndex = '1000'; // Ensure it's on top of the video

            // Create a button to go to saved timestamp
            const gotoButton = document.createElement('button');
            gotoButton.textContent = 'Go to Saved Timestamp';
            gotoButton.style.marginRight = '5px'; // Space between buttons

            // Event to jump to saved timestamp
            gotoButton.addEventListener('click', () => {
                const savedTime = parseFloat(GM_getValue('videoTimestamp_' + document.URL, 0));
                if (video && savedTime) {
                    video.currentTime = savedTime;
                }
            });

            // Create a button to reset timestamp
            const resetButton = document.createElement('button');
            resetButton.textContent = 'Reset Timestamp';

            // Event to reset the saved timestamp
            resetButton.addEventListener('click', () => {
                GM_setValue('videoTimestamp_' + document.URL, 0);
                console.log('Timestamp reset for: ' + document.URL);
            });

            // Append buttons to the container
            buttonContainer.appendChild(gotoButton);
            buttonContainer.appendChild(resetButton);

            // Append the container to the video's parent
            video.parentNode.parentNode.appendChild(buttonContainer);

            video.parentNode.parentNode.onmousemove = () => {
                const savedTime = parseFloat(GM_getValue('videoTimestamp_' + document.URL, 0));
                if(savedTime > 0) {
                    // set timer for 2 seconds to hide the button container
                    buttonContainer.style.display = 'block'
                    clearTimeout(timerId);
                    timerId = setTimeout(() => {
                        buttonContainer.style.display = 'none';
                    }, 2000);
                }
            };

            video.parentNode.parentNode.onmouseleave = () => {
                buttonContainer.style.display = 'none';
            };
        }
    }

    // Function to save timestamp
    function saveTimestamp() {
        const video = document.querySelector('video');
        if (video) {
            const currentTime = video.currentTime;
            // Retrieve the existing timestamp, if any, and parse it as a float
            const existingTimestamp = parseFloat(GM_getValue('videoTimestamp_' + document.URL, 0));
            console.log(`Current video time: ${currentTime}. Saved time: ${existingTimestamp}`);

            // Check if the current time is greater than the saved timestamp before saving
            if (currentTime > existingTimestamp) {
                console.log(`Updating saved timestamp to: ${currentTime}`);
                GM_setValue('videoTimestamp_' + document.URL, currentTime);
            } else {
                console.log('No update needed. Current time is not greater than the saved time.');
            }
        }
    }


    // Check if the document is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupVideoListener);
    } else {
        // If the document is already loaded, run the function directly
        setupVideoListener();
    }


    // Save timestamp when tab is about to be closed
    window.addEventListener('beforeunload', saveTimestamp);
    window.addEventListener('pagehide', saveTimestamp);
})();