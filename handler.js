
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
const resizer = require('./resizer');

const directory = "./images/";
const resizeDir = "./resize/";
const port = 1337;

http.createServer(app, (req, res) => {
    
}).listen(port);

const imageHeader = { "Context-Type": "image/jpg" };
const iae = "IllegalArgumentException";

const minSize = 100;
const maxSize = 1200;
const limitRatio = 2;

router.get('/resizeImages/:files/:width', async (req, res) => {
    
    let files = req.params.files;
    let W = parseInt(req.params.width);
    if(isNaN(W) || W < minSize || W > maxSize) {
        let status = HttpStatus.BAD_REQUEST; 
        let json = {
            msg : iae
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
            
            let data = await resizer.resizeImages(res, imagePath, outPath, W);
            res.writeHead(HttpStatus.OK, imageHeader);
            res.write(data);
            res.end();
        }
    }
});


router.get('/convertSizeImages/:files/:width/:height', async (req, res) => {
    
    let files = req.params.files;
    let W = parseInt(req.params.width);
    let H = parseInt(req.params.height);
    if(isNaN(W) || isNaN(H) || (H > (W * limitRatio)) || (W > (H * limitRatio)) ) {
        let status = HttpStatus.BAD_REQUEST; 
        let json = {
            msg : iae
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
            let data = await resizer.convertSizeImages(res, imagePath, outPath, W, H);

            res.writeHead(HttpStatus.OK, imageHeader);
            res.write(data);
            res.end();
        }
    }
});

router.get('/rotateImages/:files/:angle', async (req, res) => {
    
    let files = req.params.files;
    let angle = parseInt(req.params.angle);
    
    if(isNaN(angle) || angle <= 0 || angle >= 360) {
        let status = HttpStatus.BAD_REQUEST; 
        let json = {
            msg : iae
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
            let data = await resizer.rotateImages(res, imagePath, outPath, angle);

            res.writeHead(HttpStatus.OK, imageHeader);
            res.write(data);
            res.end();
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