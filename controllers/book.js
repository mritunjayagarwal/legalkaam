const { query } = require("express");
const book = require("../models/book");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, Details, Terms, Book, Razorpay, nodemailer, moment){
    return {
        SetRouting: function(router){
            router.post('/pay/:id', this.razorPay);
            router.post('/add/payment', this.addPay);
            router.post('/api/payment/verify', this.razorVerify);
        },
        razorPay: function(req, res){
                Type.findOne({  _id: req.params.id}, (err, type) => {
                       if(type){
                        let params;
                        let instance = new Razorpay({
                            key_id: 'rzp_test_O1PrDYl7c0Fbi2', // your `KEY_ID`
                            key_secret: '7K2asMBdUb5RktmDCJ8WRxX3' // your `KEY_SECRET`
                        })                     

                        if(type.currency == 'USD'){
                            params = {
                                amount: type.subs,  
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
            var expectedSignature = crypto.createHmac('sha256', '7K2asMBdUb5RktmDCJ8WRxX3')
                                        .update(body.toString())
                                        .digest('hex');
            var response = {"status":"failure"}
            if(expectedSignature === req.body.razorpay_signature)
            response={"status":"success"}
            res.send(response);
        },
        addPay: function(req, res){
            // const newBook = new Book();
            // newBook.type = req.body.tid;
            // newBook.name = req.body.bname;
            // newBook.email = req.body.bemail;
            // newBook.phone = req.body.bphone;

            // newBook.save(() => {
            //     console.log("Booked successfully");
            // });

            // res.send({"status": "success"});
            console.log("Route Reached");
            res.send({"status": "success"});
        }
    }
}