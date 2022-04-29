const { query } = require("express");
const book = require("../models/book");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, Details, Terms, Book, xlsx, Razorpay, nodemailer, moment){
    return {
        SetRouting: function(router){
            router.get('/export/payouts', this.exportPayouts);

            router.post('/pay/:id', this.razorPay);
            router.post('/add/payment', this.addPay);
            router.post('/api/payment/verify', this.razorVerify);
        },
        razorPay: function(req, res){
                Type.findOne({  _id: req.params.id}, (err, type) => {
                       if(type){
                        let params;
                        let instance = new Razorpay({
                            key_id: 'rzp_test_gPwCWeezDUDmXz', // your `KEY_ID`
                            key_secret: 'kbY19fKqEIV296eMTbVckxxs' // your `KEY_SECRET`
                        })                     

                        if(type.currency == 'USD'){
                            params = {
                                amount: type.subs * 100,  
                                currency: "USD",
                                receipt: "su001",
                                payment_capture: '1'
                            };
                        }else{
                            params = {
                                amount: (type.subs) * 100,  
                                currency: "INR",
                                receipt: "su001",
                                payment_capture: '1'
                            };
                        }
                        
                        instance.orders.create(params).then((data) => {
                                res.send({"sub":data,"status":"success"});
                        }).catch((error) => {
                                res.send({"sub":error,"status":"failed"});
                        })
                       }else{
                            res.send({"status":"failed"});
                       }
                });
        },
        razorVerify: function(req, res){
            body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
            var crypto = require("crypto");
            var expectedSignature = crypto.createHmac('sha256', 'kbY19fKqEIV296eMTbVckxxs')
                                        .update(body.toString())
                                        .digest('hex');
            var response = {"status":"failure"}
            if(expectedSignature === req.body.razorpay_signature)
            response={"status":"success"}
            res.send(response);
        },
        addPay: function(req, res){
            const newBook = new Book();
            newBook.type = req.body.tid;
            newBook.name = req.body.bname;
            newBook.email = req.body.bemail;
            newBook.phone = req.body.bphone;

            newBook.save(() => {
                console.log("Booked successfully");
            });

            let transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'inn@legal-kaam.com',
                    pass: 'Tarun@2308'
                },
                from: 'inn@legal-kaam.com',
                tls: {
                  rejectUnauthorized: false
                },
                sendMail: true,
            });
              
              var mailOptions = {
                from: 'Legalkaam <inn@legal-kaam.com>',
                to: req.body.bemail,
                subject: 'This is from LegalKaam Admin',
                html: { path: __dirname + '/../views/payment-successfull.html' },
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  console.log(info)
                }
              });

            req.flash('success', 'Payment Successfull!')
            res.send({"status": "success"});
        },
        exportPayouts: function(req, res){
            var wb = xlsx.utils.book_new(); //new workbook
            Book.find((err,data)=>{
                if(err){
                    console.log(err)
                }else{
                    var temp = JSON.stringify(data);
                    temp = JSON.parse(temp);
                    var ws = xlsx.utils.json_to_sheet(temp);
                    var down = __dirname + '/payouts.xlsx'
                xlsx.utils.book_append_sheet(wb,ws,"sheet1");
                xlsx.writeFile(wb,down);
                res.download(down);
                }
            });
        }
    }
}
