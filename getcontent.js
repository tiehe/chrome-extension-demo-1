chrome.runtime.sendMessage({
    action: "getContent",
    source: document.body.innerText
});