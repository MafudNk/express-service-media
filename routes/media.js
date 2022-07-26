const express = require('express');
const router = express.Router();
const isBase64 = require('is-base64');
const base64Img = require('base64-img');

const { Media } = require('../models');

const { HOSTNAME } = process.env;

/* GET users listing. */
router.post('/media', function (req, res) {
  const image = req.body.image;

  if (!isBase64(image, { mimeRequired: true })) {
    return res.status(400).json({
      status: 'error',
      message: 'Image is not base64'
    });
  }

  /* image base 64 */
  base64Img.img(image, './public/images', Date.now(), async (err, filepath) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err
      });
    }

    const filename = filepath.split('/').pop();

    const media = await Media.create({ image: `images/${filename}` });

    return res.json({
      status: 'success',
      data: {
        id: media.id,
        image: `${req.get('host')}/images/${filename}`
      }
    });

  });
  /* end image base 64 */
});

module.exports = router;
