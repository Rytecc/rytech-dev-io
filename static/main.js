const TEXT_BLOCK = 0
const CODE_BLOCK = 1

const contentBody = document.getElementById("contentbody")
const buttons = document.getElementsByClassName("navbutton")

const keywords_blue = ['class', 'public', 'private', 'void', '\bint\b', '\bbool\b', '\bstring\b', '\bfloat\b']
const keywords_purple = ['\bfor\b', 'if', 'while']

function colorcode(code) {
    let colored_code = code
    colored_code = colored_code.replace(new RegExp("<", "g"), "&lt;")

    keywords_blue.forEach((keyword, i) => {
        colored_code = colored_code.replace(new RegExp(keyword, "g"), "<span class='blue'>" + keyword + "</span>")
    })

    keywords_purple.forEach((keyword, i) => {
        colored_code = colored_code.replace(new RegExp(keyword, "g"), "<span class='purple'>" + keyword + "</span>")
    })

    return colored_code
}

function onCodeButtonClick(button) {
    const buttonURL = 'http://localhost:5000/load_code/' + button.textContent
    let xmlhttpRequest = new XMLHttpRequest()
    xmlhttpRequest.open("GET", buttonURL, true)
    xmlhttpRequest.onerror = () => {
        contentBody.textContent = "An error occurred: " + xmlhttpRequest.status
    }

    xmlhttpRequest.onreadystatechange = () => {
        if(xmlhttpRequest.readyState != XMLHttpRequest.DONE) {
            return
        }

        const status = xmlhttpRequest.status
        if(status == 0 || (status >= 200 && status < 400)) {
            // INT represents the block_type (code or text), and STR represents the block contents.
            // response format [[INT, STR], [INT, STR], ...]
            let rawResponse = xmlhttpRequest.response
            parsedResponse = JSON.parse(rawResponse)
            contentBody.innerHTML = ""

            let blockheader = document.createElement('h1')
            blockheader.innerText = button.textContent
            contentBody.appendChild(blockheader)
            
            for(let blockIndex = 0; blockIndex < parsedResponse.length; blockIndex++) {
                let block = parsedResponse[blockIndex]
                if(block[0] == CODE_BLOCK) {
                    let format_element = document.createElement('pre')
                    let code_element = document.createElement('code')
                    code_element.className = 'language-csharp'

                    let processed_block = colorcode(block[1])
                    code_element.innerHTML = processed_block
                    
                    let copy_code_element = document.createElement('button')
                    copy_code_element.className = "contentbutton"
                    copy_code_element.innerText = "Click to copy code"
                    copy_code_element.addEventListener('click', () => {
                        copy_code_element.innerText = "Copied!"
                        navigator.clipboard.writeText(block[1])
                    })

                    format_element.appendChild(copy_code_element)
                    format_element.appendChild(code_element)
                    contentBody.appendChild(format_element)
                    continue;
                }

                if(block[0] == TEXT_BLOCK) {
                    let text_element = document.createElement('p')
                    text_element.innerHTML = block[1]
                    contentBody.appendChild(text_element)
                    continue;
                }

                Error.call("Invalid code block ID: " + block[0])
            }

        } else {
            contentBody.textContent = "An error occurred: " + status
        }
    }

    contentBody.style
    xmlhttpRequest.send()
}

for(let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = () => {
        onCodeButtonClick(buttons[i])
    }
}