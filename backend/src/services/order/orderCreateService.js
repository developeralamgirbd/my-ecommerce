const mongoose = require('mongoose');
const OrderModel = require('../../models/order/Order');
const OrderItemModel = require('../../models/order/OrderItem');
const PaymentModel = require('../../models/order/Payment');
const ShippingAddressModel = require('../../models/order/ShippingAddress');
const ProductModel = require('../../models/product/Product');
const AddressModel = require('../../models/user/Address');

const ObjectId = mongoose.Types.ObjectId;
// payment jokhon hobe tokhon 3 ta model niye kaj korte hobe
//
// 1. Order
// 2. OrderItem
// 3. Payment
// 4. Products
// 5. ShippingAddress

exports.orderCreateService =  async (nonce, cart, gateway, user, shippingAddressObj)=>{
    	const session = await mongoose.startSession();
        await session.startTransaction();

        try {

            const options = { session };

            let amount = cart.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.count * currentValue.price
            },0)

            parseFloat(amount).toFixed(2);
            // Braintree Payment Process
            const newTransaction = await gateway.transaction.sale({
                amount: amount,
                customer: {
                    id: user?._id,
                    firstName: `ID: ${user?._id}`,
                    lastName: `Email: ${user?.email}`,
                    company: null,
                    email: user?.email,
                    website: null,
                    phone: user?.mobile,
                    fax: null
                },
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true
                }
            });

            console.log(newTransaction.transaction.paymentMethod)

            // 1st DB Process Order create
            let orderID = 1;
            const order = OrderModel.find().sort({createdAt: -1}).limit(1);
            if (order.orderID){
                orderID += order.orderID + 1
            }

            const newOrder = new OrderModel({
                userID: user._id,
                orderID: orderID,
                totalAmount: newTransaction.transaction.amount,
                paymentStatus: newTransaction?.success ? 'paid' : 'unpaid',
            });

            await newOrder.save(options);

            // 2nd DB Process Order Items create

            const orderItems = cart.reduce((accumulator, currentValue)=>{
               return [...accumulator, {
                   orderID: newOrder?._id,
                   productID: currentValue._id,
                   price: newTransaction.transaction.amount,
                   quantity: currentValue.count
               }]
            }, []);

            // console.log(orderItems)


            const newOrderItems = await OrderItemModel.insertMany(orderItems, options);

            // 3rd DB Process Shipping Address create
            const userAddress = AddressModel.findOne({userID: ObjectId(user?._id)});
            // console.log(userAddress);

            const shippingAddress = new ShippingAddressModel({
                userID: user?._id,
                name: shippingAddressObj?.name || `${user.firstName} ${user.lastName}`,
                address: shippingAddressObj?.name || userAddress?.address,
                city: shippingAddressObj?.city || userAddress?.city,
                state: shippingAddressObj?.state || userAddress?.state,
                country: shippingAddressObj?.country || userAddress?.country,
                zipCode: shippingAddressObj?.zipCode || userAddress?.zipCode,
                mobile: shippingAddressObj?.mobile || user?.mobile,
            });

            await shippingAddress.save(options);

            // 4th DB Process Payment create

            const payment = new PaymentModel({
                orderID: newOrder?._id,
                amount: newTransaction.transaction.amount,
                status: newTransaction?.success ? 'success' : 'failure',
                paymentMethod: newTransaction.transaction.paymentInstrumentType,
                payment: newTransaction
            });

            await payment.save(options)

            await session.commitTransaction();
            session.endSession();
            return newTransaction;
        }catch (e) {
            await session.abortTransaction();
            session.endSession();
            console.error('Transaction aborted:', e);
            return e

        }
}