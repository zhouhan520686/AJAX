getCSS.onclick = () => {
    const request = new XMLHttpRequest()
    request.open("GET", "/style.css")
    request.onload = () => {
        const style = document.createElement('style')
        style.innerHTML = request.response
        document.head.appendChild(style)
    }
    request.onerror = () => {
        console.log('css引用失败')
    }
    request.send();
}

getJS.onclick = () => {
    const request = new XMLHttpRequest()
    request.open('GET', '/test.js')
    request.onload = () => {
        const script = document.createElement('script')
        script.innerHTML = request.response
        document.body.appendChild(script)
        getJS.textContent = 'js加载成功了，可打开console查看'
    }
    request.onerror = () => {
        console.log('js 引用失败')
    }
    request.send();
}

getHTML.onclick = () => {
    const request = new XMLHttpRequest()
    request.open('GET', '/div.html')
    request.onload = () => {
        const div = document.createElement('div')
        div.innerHTML = request.response
        document.body.appendChild(div)
    }
    request.onerror = () => {
        console.log('div 加载失败')
    }
    request.send();
}

getXML.onclick = () => {
    const request = new XMLHttpRequest();
    request.open('GET', '/xmlDemo.xml')
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            const dom = request.responseXML
            const text = dom.getElementsByTagName('warning')[0].textContent
            getXML.textContent = text.trim()
        }
    }
    request.send()
}

getJSON.onclick = () => {
    const request = new XMLHttpRequest();
    request.open('GET', '/jsonDemo.json');
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            const object = JSON.parse(request.response)
            myName.textContent = '，' + object.name
        }
    }
    request.send()
}
let pageNum = 1;
getPage.onclick = () => {
    const request = new XMLHttpRequest();
    request.open('GET', `/page${pageNum+1}`)
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            const array = JSON.parse(request.response)
            array.forEach(item => {
                const li = document.createElement('li')
                li.textContent = '通过json加载的' + item.id
                pageJSON.appendChild(li)
            })
        }
    }
    pageNum += 1
    request.send()
}