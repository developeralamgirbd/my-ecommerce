
// Product Orders controller
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHENT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

const {orderCreateService} = require("../services/order/orderCreateService");
const {productValidityService} = require("../services/productService/productService");
const { error } = require("../utils/error");

exports.createBraintreeToken = async (_req, res, next)=>{
    try {
        const clientToken =  await gateway.clientToken.generate();
        res.status(200).json(clientToken)

    }catch (e) {
        next(e)
    }

    // gateway.clientToken.generate({
    //     customerId: aCustomerId
    // }).then(response => {
    //     // pass clientToken to your front-end
    //     const clientToken = response.clientToken
    // });
}

exports.checkout = async (req, res, next)=>{
    try {
        // console.log(req.body)

        const {nonce, cart} = req.body;
        const user = req?.auth;
        const products = await productValidityService(cart);
       const result = await orderCreateService(nonce, products, gateway, user);
        // console.log(result)
        res.status(200).json(result)

    }catch (e) {
        next(e)
    }
}