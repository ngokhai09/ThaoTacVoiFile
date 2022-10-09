const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const qs = require('qs');


let handlers = {};
handlers.home = function (req, res) {
    fs.readFile('./views/home.html', (err, data) => {
        res.writeHead(200, {'Content-type': 'text/html'})
        res.write(data);
        return res.end();
    });
};
handlers.notFound = function (req, res) {
    fs.readFile('./view/notfound.html', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
};
handlers.login = function (req, res) {
    fs.readFile('./views/login.html', (err, data) => {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(data);
        return res.end();
    })


};
handlers.info = function (req, res) {

    let data = ''
    req.on('data', chunk => {
        data += chunk
    })

    console.log(data);
    req.on('end', () => {
        console.log("check");
        let userInfo = qs.parse(data);

        fs.readFile('./views/info.html', 'utf-8',(err, data) => {
            if(err)
                throw new Error(err.message)
            res.writeHead(200, {'Content-type': 'text/html'});
            data = data.replace('{name}', userInfo.name)
            data = data.replace('{password}', userInfo.password)
            res.write(data);
            return res.end();
        })
    })
};
let router = {
    'login': handlers.login,
    'info': handlers.info,
    'home': handlers.home
}
const server = http.createServer((req, res) => {
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    console.log(trimPath);
    let chosenHandler
    if(trimPath !== 'favicon.ico'){
        if(req.method === 'GET'){
            chosenHandler = (typeof (router[trimPath]) !== undefined) ? router[trimPath] : handlers.notFound
            chosenHandler(req, res);
        }else{
            chosenHandler = router.info;
            chosenHandler(req, res)
        }
    }




})

server.listen(8080, () => {
    console.log("Server is running on http://127.0.0.1:8080")
})