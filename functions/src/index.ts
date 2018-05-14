import * as functions from 'firebase-functions';

declare let require: any;

const cors = require('cors')({origin: true});
const sgMail = require('@sendgrid/mail');
const _ = require('lodash');

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.shareFiles = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    let files = req.body.files;
    let to = req.body.to;
    let from = req.body.from;
    let message = req.body.message;

    let msg = {
      to: to,
      from: from,
      subject: 'Your files, via CanShare.io',
      html: `<h3>Hi There!</h3><br>
            <p>${from} has shared these files with you via CanShare.io:</p>
            <h5>Message:</h5><br>
            <p>${message}</p>
            <br><br>
            <h5>files</h5>
            <br><br><br><p>The CanYa Team</p>`,
      templateId: '83b9ba7f-41a3-4e2e-bf1b-74bae7cb950c',
    }

    sgMail.send(msg);

    res.status(200).json({
      files: files,
      to: to,
      from: from,
      message: message,
      msg: msg
    });
  });


  // res.status(200).json({ success: true });

});

