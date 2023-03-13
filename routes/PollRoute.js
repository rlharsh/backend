const bodyParser = require('body-parser');
const express           = require('express');
const router            = express.Router();

const PollController    = require('../controllers/PollController');
const upload            = require('../middleware/upload');

router.get('/', PollController.index);
router.post('/vote', upload.none(), PollController.vote);
router.post('/show', PollController.show);
// router.post('/store', upload.array('banner[]'), PollController.store);
router.post('/store', upload.single('banner'), PollController.store);
router.post('/update', PollController.update);
router.post('/delte', PollController.destroy);
router.get('/:id', PollController.getSingle);

module.exports = router;