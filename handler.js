
const express = require('express'), http = require('http');
const router = express.Router();
const fs = require('fs'), sharp = require('sharp');

const app = express();
const bodyParser = require('body-parser'), cookieParser = require('cookie-parser'), HttpStatus = require('http-status-codes');

app.use(bodyParser.urlencoded({
	extended : false
}));

app.use(bodyParser.json());

app.use(cookieParser());
app.use('/', router);
const logger = require('./logger');

const directory = "./images/";
const resizeDir = "./resize/";
const port = 1337;

http.createServer(app, (req, res) => {
    
}).listen(port);

const imageHeader = { "Context-Type": "image/jpg" };

router.get('/resizeImages/:files/:width', async (req, res) => {
    
    let files = req.params.files;
    let W = parseInt(req.params.width);
    if(isNaN(W)) {
        let status = HttpStatus.BAD_REQUEST; 
        let json = {
            msg : "IllegalArgumentException"
        };
        res.status(status).send(json);
    } else {
        let imagePath = directory + files;
        if(!fs.existsSync(imagePath)) {
            let status = HttpStatus.NOT_FOUND; 
            let json = {
                msg : HttpStatus.getStatusText(status)
            };
            res.status(status).send(json); 
        } else {
            let outPath = resizeDir + files;
    
            sharp(imagePath).resize({width:W})
            .toFile(outPath)
            .then(() => {
                // resize success
                logger.info("resize success");
                fs.readFile(outPath, (err, data) => {
                    res.writeHead(HttpStatus.OK, imageHeader);
                    res.write(data);
                    res.end();   
                });
            }).catch((err) => {
                // resize fail
                logger.info("resize fail");
                let status = HttpStatus.INTERNAL_SERVER_ERROR; 
                let json = {
                    msg : HttpStatus.getStatusText(status)
                };
                res.status(status).send(json);
            }); 
        }
    }
});


router.get('/convertSizeImages/:files/:width/:height', async (req, res) => {
    
    let files = req.params.files;
    let W = parseInt(req.params.width);
    let H = parseInt(req.params.height);
    if(isNaN(W) || isNaN(H)) {
        let status = HttpStatus.BAD_REQUEST; 
        let json = {
            msg : "IllegalArgumentException"
        };
        res.status(status).send(json);
    } else {
        let imagePath = directory + files;
        if(!fs.existsSync(imagePath)) {
            let status = HttpStatus.NOT_FOUND; 
            let json = {
                msg : HttpStatus.getStatusText(status)
            };
            res.status(status).send(json); 
        } else {
            let outPath = resizeDir + files;
    
            sharp(imagePath).resize({fit:'fill', width:W, height:H})
            .toFile(outPath)
            .then(() => {
                // resize success
                logger.info("resize success");
                fs.readFile(outPath, (err, data) => {
                    res.writeHead(HttpStatus.OK, imageHeader);
                    res.write(data);
                    res.end();   
                });
            }).catch((err) => {
                // resize fail
                logger.info("resize fail");
                let status = HttpStatus.INTERNAL_SERVER_ERROR; 
                let json = {
                    msg : HttpStatus.getStatusText(status)
                };
                res.status(status).send(json);
            }); 
        }
    }
});

const process = require('process');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

process.on('uncaughtException', function(err) {
	if(err.code === "ETIMEDOUT") {
		logger.error("ETIMEDOUT ", err);
	} else if (err.code === "ECONNREFUSED") {
		logger.error('ECONNREFUSED ', err);	
	} else if (err.code === "EHOSTUNREACH") {
		logger.error('EHOSTUNREACH ', err);	
	} else {
		logger.error('uncaughtException ', err);	
	}
});

process.on('unhandledRejection' , (reason , p) => {
	logger.error(reason, 'Unhandled Rejection at Promise', p);
});

http.request({
	path : "/"
}, (res) => {
	res.on("error", (err) => {
		logger.error("error " + err);
	});
});