
const express = require('express'), http = require('http');
const router = express.Router();
const fs = require('fs'), sharp = require('sharp'), helmet = require('helmet');

const app = express();
const bodyParser = require('body-parser'), cookieParser = require('cookie-parser'), HttpStatus = require('http-status-codes');

app.use(bodyParser.urlencoded({
	extended : false
}));

app.use(bodyParser.json());

app.use(cookieParser());
app.use('/', router);

app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.noCache());

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

const json404 = {
    msg : HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
};

const jsonIae = {
    msg : iae
};

router.get('/resizeImages/:files/:width', async (req, res) => {
    
    let files = req.params.files;
    let W = parseInt(req.params.width);
    if(isNaN(W) || W < minSize || W > maxSize) {
        res.status(HttpStatus.BAD_REQUEST).send(jsonIae);
    } else {
        let imagePath = directory + files;
        if(!fs.existsSync(imagePath)) {
            res.status(HttpStatus.NOT_FOUND).send(json404);  
        } else {
            let outPath = resizeDir + files;
            
            resizer.resizeImages(res, imagePath, outPath, W)
            .then(data => {
                logger.info("resize success");
                res.writeHead(HttpStatus.OK, imageHeader);
                res.write(data);
                res.end();
            })
            .catch(err => {
                logger.info("resize fail");
                throw err;
            })
            .finally({

            });
            
        }
    }
});


router.get('/convertSizeImages/:files/:width/:height', async (req, res) => {
    
    let files = req.params.files;
    let W = parseInt(req.params.width);
    let H = parseInt(req.params.height);
    if(isNaN(W) || isNaN(H) || (H > (W * limitRatio)) || (W > (H * limitRatio)) ) {
        res.status(HttpStatus.BAD_REQUEST).send(jsonIae);
    } else {
        let imagePath = directory + files;
        if(!fs.existsSync(imagePath)) {
            res.status(HttpStatus.NOT_FOUND).send(json404); 
        } else {
            let outPath = resizeDir + files;
            resizer.convertSizeImages(res, imagePath, outPath, W, H)
            .then(data => {
                logger.info("convert success");
                res.writeHead(HttpStatus.OK, imageHeader);
                res.write(data);
                res.end();
            })
            .catch(err => {
                logger.info("convert fail");
                throw err;
            })
            .finally({

            });
        }
    }
});

router.get('/rotateImages/:files/:angle', async (req, res) => {
    
    let files = req.params.files;
    let angle = parseInt(req.params.angle);
    
    if(isNaN(angle) || angle <= 0 || angle >= 360) {
        res.status(HttpStatus.BAD_REQUEST).send(jsonIae);
    } else {
        let imagePath = directory + files;
        if(!fs.existsSync(imagePath)) {
            res.status(HttpStatus.NOT_FOUND).send(json404); 
        } else {
            let outPath = resizeDir + files;
            resizer.rotateImages(res, imagePath, outPath, angle)
            .then(data => {
                logger.info("rotate success");
                res.writeHead(HttpStatus.OK, imageHeader);
                res.write(data);
                res.end();
            })
            .catch(err => {
                logger.info("rotate fail");
                throw err;
            })
            .finally({

            });
        }
    }
});

router.get('/downImages/:files', async (req, res) => {
    
    let files = req.params.files;
    
    let outPath = resizeDir + files;
    if(!fs.existsSync(outPath)) {
        res.status(HttpStatus.BAD_REQUEST).send(jsonIae);
    } else {
        res.status(HttpStatus.OK).download(outPath);	
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