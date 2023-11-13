// COPY TO CLIPBOARD IN JAVASCRIPT
// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript

function fallback_copy_text_to_clipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copy_text_to_clipboard(text, notify_success, notify_failure, add_instead_of_replace = false) {
    if(add_instead_of_replace) {
        if (!navigator.clipboard) {
            alert("Unable to read clipboard!")
            fallback_copy_text_to_clipboard(text)
            return;
        }
        navigator.clipboard.readText().then(function(old_text) {
            navigator.clipboard.writeText(old_text + "\n\n" + text).then(function () {
                notify_success()
            }, function (err) {
                notify_failure()
            });
        })
    }else{
        if (!navigator.clipboard) {
            fallback_copy_text_to_clipboard(text)
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            notify_success()
        }, function (err) {
            notify_failure()
        });
    }
}

module.exports = {copy_text_to_clipboard};