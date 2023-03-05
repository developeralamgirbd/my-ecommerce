
// Product Orders controller
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHENT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

const {orderCreateService} = require("../services/order/orderCreateService");

exports.createBraintreeToken = async (req, res)=>{
    try {
        const clientToken =  await gateway.clientToken.generate();
        res.status(200).json(clientToken)

    }catch (e) {
        res.status(500).json({error: 'Server error occurred'})
    }

    // gateway.clientToken.generate({
    //     customerId: aCustomerId
    // }).then(response => {
    //     // pass clientToken to your front-end
    //     const clientToken = response.clientToken
    // });
}

exports.checkout = async (req, res)=>{
    try {
        // console.log(req.body)

        const {nonce, cart} = req.body;
        const user = req?.auth;
       const result = await orderCreateService(nonce, cart, gateway, user);
        // console.log(result)
        res.status(200).json(result)

    }catch (e) {
        res.status(500).json({error: 'Server error occurred'})
    }
}