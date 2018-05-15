"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const sgMail = require('@sendgrid/mail');
const _ = require('lodash');
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);
exports.shareFiles = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        let files = req.body.files;
        let to = req.body.to;
        let from = req.body.from;
        let message = req.body.message;
        let html = `<h3>Hi There!</h3><br>
            <p>${from} has shared these files with you via CanShare.io:</p>`;
        if (message) {
            html += `<h5>Message:</h5>
            <p>${message}</p>`;
        }
        html += `<br><table>
            <tbody>`;
        files.forEach(file => {
            html += `<tr>
                <td width="70%"><a href="https://gateway.ipfs.io/ipfs/${file.hash}">${file.name}</a></td>
                <td width="30%" style="text-align:right;"><a href="https://gateway.ipfs.io/ipfs/${file.hash}" style="background-color:#33ccff;border:1px solid #33ccff;border-radius:3px;color:#ffffff;display:inline-block;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif,sans-serif;font-size:16px;line-height:32px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">View file</a></td>
              </tr>`;
        });
        html += `</tbody>
            <table>
            <br><br><br><p>The CanYa Team</p>`;
        let msg = {
            to: to,
            from: from,
            subject: 'Your files via CanShare.io',
            html: html,
            templateId: '83b9ba7f-41a3-4e2e-bf1b-74bae7cb950c',
        };
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
//# sourceMappingURL=index.js.map