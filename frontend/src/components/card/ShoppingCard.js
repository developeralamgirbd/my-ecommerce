import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Divider, InputNumber, Row} from "antd";
import {useCart} from "../../context/cart";
import toast from "react-hot-toast";
import {useAuth} from "../../context/AuthProvider";
import {checkoutRequest, getPaymentTokenRequest} from "../../APIRequest/productApi";
import DropIn from "braintree-web-drop-in-react";

const ShoppingCard = () => {

    const [cart, setCart] = useCart();
    const {auth, token} = useAuth();
    const [clientToken, setClientToken] = useState('');
    const [instance, setInstance] = useState(null);

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(()=>{
        let total = cart.reduce((accumulator, currentValue) => {
           return accumulator + currentValue.count * currentValue.price
        },0)

        total.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        })

        setTotalPrice(total)

    },[cart])

    useEffect(()=>{
        if (token){
            getPaymentTokenRequest().then(res => {

                setClientToken(res.clientToken)
            })
        }
    },[token])

    const buy = async ()=> {

        // Send the nonce to your server
        const { nonce } = await instance.requestPaymentMethod();
        const  res = await checkoutRequest(nonce, cart);

        console.log(res)
    }


    return (
        <div>
            <Row>
                <Col
                    span={18}
                    xs={{
                        order: 1,
                    }}
                    sm={{
                        order: 2,
                    }}
                    md={{
                        order: 3,
                    }}
                    lg={{
                        order: 4,
                    }}
                >
                   <Card>
                       {
                           cart.map(product => (
                               <>
                                   <div>
                                       <h1>{product?.name}</h1>
                                       <Row>
                                           <Col flex={2}><p>{product?.price}</p></Col>
                                           <Col flex={3}>
                                               <InputNumber min={1} max={product.quantity} defaultValue={product.count} onChange={(value)=>{

                                                    let cartarr = [];
                                                    cartarr= JSON.parse(localStorage.getItem('cart'));
                                                       cartarr.map((item, i) => {
                                                           if (item._id === product._id){
                                                               cartarr[i].count =  value
                                                           }
                                                       })

                                                   localStorage.setItem('cart', JSON.stringify(cartarr));
                                                   setCart(cartarr);
                                               }} />
                                           </Col>
                                       </Row>
                                   </div>
                                   <Divider></Divider>
                               </>
                           ))
                       }

                       <div className='d-flex justify-content-between'>
                           <p></p>
                           <div><p>Total Amount</p><p>${totalPrice}</p></div>
                       </div>

                   </Card>
                </Col>
                <Col
                    span={6}
                    xs={{
                        order: 1,
                    }}
                    sm={{
                        order: 2,
                    }}
                    md={{
                        order: 3,
                    }}
                    lg={{
                        order: 4,
                    }}
                >
                    {
                        !clientToken || !cart.length ? (
                            ""
                        ) : <>
                            <DropIn
                                options={
                                {
                                    authorization: clientToken,
                                    paypal: {
                                        flow: 'vault'
                                    }
                                }
                                }
                                onInstance={(instance) => (setInstance(instance))}
                            />
                            <div>
                                <Button type='primary' disabled={!instance} className='d-block buy-button' onClick={buy}>Buy</Button>
                            </div>

                        </>
                    }

                </Col>
            </Row>
        </div>
    );
};

export default ShoppingCard;