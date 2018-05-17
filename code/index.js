/*
Forked from https://github.com/vsupalov/docker-puppeteer-dev

This fork uses puppeteer to open multiple urls and mail the screenshots using nodemailer.
Update the mail account and recipient details, and remember to anonymize them again before doing a commit to the public gitHub!
Apologies for using any bad coding patterns, I'm just a functional coder :-)
*/

const outputs = [
    {"mailTo":"youraccount@hotmail.com", "subject":"Akron sales", "url":"template_1.html?&select=City,Akron"}, 
    {"mailTo":"youraccount@hotmail.com", "subject":"Atlanta sales", "url":"template_1.html?&select=City,Atlanta"}, 
];

const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

(async () => {

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'youraccount@gmail.com',
			pass: 'yourpassword'
		}
	});
	const browser = await puppeteer.launch({
		args: ['--no-sandbox']
	});
	const page = await browser.newPage();

	for (let i = 0; i < outputs.length; i++) {
		const output = outputs[i];
  		console.log(output);
		await page.setViewport({
			width: 1920, 
			height: 1080
		});
		await page.goto('file:///app/code/' + output.url);
		await page.waitFor(4000) 
		await page.screenshot({
			path: '/app/output/output_' + i +'.png', 
			fullPage: true
		});
		await transporter.sendMail({
			from: 'noreply@outputs.com',
			to: output.mailTo,
			subject: output.subject,
			attachments: [{
				filename: 'output_' + i +'.png',
				path: '/app/output/output_' + i +'.png',
				cid: 'output'
			}],
			html: '<img src="cid:output">'
		}, 
		function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	}
	await browser.close();
  
})();
