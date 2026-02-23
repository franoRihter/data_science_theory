// Part 1: Shared variables and functions

window.theia_frame;
window.theia_origin;
window.author_ide_frame;
window.author_ide_origin;

function setFramesOrigin(author_ide_url, theia_url) {
    try {
        window.theia_origin = new URL(theia_url).origin;
    } catch (e) {
        window.theia_origin = "";
    }
    window.author_ide_origin = author_ide_url;
}

function theiaFrame() {
    // Always resolve the current tool iframe window in case the iframe was remounted/swapped
    const current = window.frames && window.frames.tool_iframe_name;
    if (current) {
        window.theia_frame = current;
        return current;
    }
    return window.theia_frame;
}

// Part 2: Functions to communicate between iframes

// Starts listening to requests from author_ide and theia
function commsBetweenIframes() {
    console.log("Adding message event listeners");
    window.addEventListener("message", (event) => {
        if (
            event.origin != window.theia_origin &&
            event.origin != window.author_ide_origin &&
            event.origin != window.location.origin
        )
            return;
        if (event && event.data) {
            const type = event.data.type;
            const theia_frame = theiaFrame();
            switch (type) {
                case "current_ui_url":
                    console.log(
                        "Received message from the child iframe requesting ui's current url"
                    );
                    if (theia_frame) {
                        let mess = {
                            type: "current_ui_url",
                            URL: window.location.href,
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log("Sent ui's current url to the iframe");
                    }
                    break;
                case "execute_code":
                    console.log(
                        "Received message from the author_ide iframe to execute command"
                    );
                    if (theia_frame) {
                        let mess = {
                            type: "execute_code",
                            command: event.data.command,
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log(
                            "Sent the command to be execute to the theia_iframe"
                        );
                    }
                    break;
                case "execute_ctrl_c":
                    console.log(
                        "received message from the author_ide iframe to exectute CTRL+C command"
                    );
                    if (theia_frame) {
                        let mess = {
                            type: "execute_code",
                            command: "\x03",
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log(
                            "Sent the command to be execute to the theia_iframe"
                        );
                    }
                    break;
                case "type_for_me":
                    console.log(
                        "Received message from author_ide iframe to type for it"
                    );
                    handlePasteCodeIntoDesktop(event.data.text);
                    break;
                case "launch_application":
                    console.log(
                        "Received message from the author_ide iframe to launch_application"
                    );
                    if (theia_frame) {
                        let mess = {
                            type: "launch_application",
                            port: event.data.port,
                            viewType: event.data.viewType,
                            route: event.data.route,
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log(
                            "Sent the request to open an application to the theia_iframe"
                        );
                    }
                    break;
                case "open_file":
                    console.log(
                        "Received message from the author_ide iframe to open file"
                    );
                    if (theia_frame) {
                        let uri = event.data.uri.startsWith("./")
                            ? event.data.uri.substring(2)
                            : event.data.uri;
                        uri = uri.startsWith("/")
                            ? uri
                            : "/home/project/" + uri;
                        let mess = {
                            type: "open_file",
                            uri: uri,
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log(
                            "Sent the request to open a file to the theia_iframe"
                        );
                    }
                    break;
                case "open_db_page":
                    if (theia_frame) {
                        let mess = {
                            type: "open_db_page",
                            db: event.data.db,
                            start: event.data.start,
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log(
                            "Sent the request to open a db page to the theia_iframe"
                        );
                    }
                    break;
                case "open_big_data_page":
                    if (theia_frame) {
                        let mess = {
                            type: "open_big_data_page",
                            tool: event.data.tool,
                            start: event.data.start,
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log(
                            "Sent the request to open a big data page to the theia_iframe"
                        );
                    }
                    break;
                case "open_cloud_page":
                    if (theia_frame) {
                        let mess = {
                            type: "open_cloud_page",
                            tool: event.data.tool,
                            action: event.data.action,
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log(
                            "Sent the request to open a cloud page to the theia_iframe"
                        );
                    }
                    break;
                case "open_embeddable_ai_page":
                    if (theia_frame) {
                        let mess = {
                            type: "open_embeddable_ai_page",
                            tool: event.data.tool,
                            action: event.data.action,
                        };
                        theia_frame.postMessage(mess, window.theia_origin);
                        console.log(
                            "Sent the request to open a embeddable_ai page to the theia_iframe"
                        );
                    }
                    break;
            }
        }
    });
}
function handlePasteCodeIntoDesktop(text) {
    const iframe = theiaFrame();
    if (iframe) {
        iframe.postMessage(
            {
                type: "clipboard_paste",
                mime: "text/plain",
                data64: btoa(text),
            },
            "*"
        );
        iframe.focus();
    }
}

// Starts listening to a request from theia when theia is loaded
function listenToTheiaLoad() {
    console.log(
        "Adding message event listener for indication from THEIA when it's loaded"
    );
    let listenerFunction = (event) => {
        if (event.origin != window.theia_origin) return;
        if (event && event.data) {
            const type = event.data.type;
            const theia_frame = theiaFrame();
            switch (type) {
                case "frame_loaded":
                    console.log(
                        "Received message from theia indicating that theia has loaded"
                    );
                    if (theia_frame) {
                        //sending message to theia to upload its theme to the curent UI's theme
                        theia_frame.postMessage(
                            {
                                type: "update_theme",
                                color: localStorage.getItem("theme"),
                            },
                            window.theia_origin
                        );
                        window.removeEventListener("message", listenerFunction);
                    }
                    break;
            }
        }
    };

    window.addEventListener("message", listenerFunction);
}

// Starts listening to a request from author-ide when author-ide is loaded
function listenToAuthorIDELoad() {
    console.log(
        "Adding message event listener for indication from AUTHOR_IDE when it's loaded"
    );
    let listenerFunction = (event) => {
        if (event.origin != window.author_ide_origin) return;
        if (event && event.data) {
            const type = event.data.type;
            if (window.author_ide_frame) {
                //sending message to AUTHOR_IDE to upload its theme to the curent UI's theme
                window.author_ide_frame.postMessage(
                    {
                        type: "update_theme",
                        color: localStorage.getItem("theme"),
                    },
                    window.author_ide_origin
                );
                window.removeEventListener("message", listenerFunction);
            }
            switch (type) {
                case "frame_loaded":
                    console.log(
                        "Received message from AUTHOR_IDE indicating that AUTHOR_IDE has loaded"
                    );
                    if (window.author_ide_frame) {
                        //sending message to AUTHOR_IDE to upload its theme to the curent UI's theme
                        window.author_ide_frame.postMessage(
                            {
                                type: "update_theme",
                                color: localStorage.getItem("theme"),
                            },
                            window.author_ide_origin
                        );
                        window.removeEventListener("message", listenerFunction);
                    }
                    break;
            }
        }
    };

    window.addEventListener("message", listenerFunction);
}

// Refocus the iframe that lost focus (for Windows Server) if the focus is not on an input field
function refocusIframeFromOutside() {
    // Do not refocus if focus is on an input field
    var focused = document.activeElement;
    if (focused && focused !== document.body) return;
    // Ensure iframe is focused
    theiaFrame().focus();
}

// Refocus the iframe regardless of where the focus is
function refocusIframe() {
    theiaFrame().focus();
}

// Wait until the frames are available before starting
function start() {
    if (
        window.frames.tool_iframe_name == undefined ||
        (window.data.author_ide_url !== undefined &&
            window.frames.author_ide_iframe_name == undefined)
    ) {
        setTimeout(start, 50);
    }
}

// Once the page is loaded, start listening to requests from theia and author_ide
window.addEventListener("load", () => {
    setFramesOrigin(window.data.author_ide_url, window.data.iframe_src);
    start();

    window.theia_frame = window.frames.tool_iframe_name;
    listenToTheiaLoad();

    if (window.data.author_ide_url !== undefined) {
        window.author_ide_frame = window.frames.author_ide_iframe_name;
        listenToAuthorIDELoad();
    }

    commsBetweenIframes();

    if (window.data.is_windows) {
        console.log("Adding event listeners for refocusing the iframe");
        // Attempt to refocus the iframe upon a click or keydown on labs UI
        window.addEventListener("click", refocusIframeFromOutside);
        window.addEventListener("keydown", refocusIframeFromOutside);
        // Refocus iframe upon the mouse entering the iframe element
        var tool_iframe = document.getElementById("tool_iframe");
        tool_iframe.addEventListener("pointerenter", refocusIframe);
        // Attempt to refocus iframe upon a click or keydown on the author_ide iframe
        var author_ide_iframe = document.getElementsByName(
            "author_ide_iframe_name"
        )[0];
        author_ide_iframe.addEventListener("click", refocusIframeFromOutside);
        author_ide_iframe.addEventListener("keydown", refocusIframeFromOutside);
    }
});
