import React, {useEffect, useState} from 'react';
import {Card, Col, Divider, InputNumber, Row} from "antd";
import {useCart} from "../../context/cart";

const ShoppingCard = () => {

    const [cart, setCart] = useCart();

    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(()=>{
        const productPrice = cart.reduce((accumulator, currentValue) => {
           return accumulator + currentValue.count * currentValue.price
        },0)

        setTotalAmount(productPrice)
    },[cart])

    const getTotal = ()=>{
      cart.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.count * currentValue.price
        },0)
    }

    const onChange = (value)=>{
        console.log(value)
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
                                               <InputNumber min={1} max={10} defaultValue={product.count} onChange={(value)=>{
                                                    let cartarr = [];
                                                    cartarr= JSON.parse(localStorage.getItem('cart'));
                                                       cartarr.map((item, i) => {
                                                           if (item._id === product._id){
                                                               cartarr[i].count = value
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
                           <div><p>Total Amount</p><p>{totalAmount}</p></div>
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
                    1 col-order-responsive
                </Col>
            </Row>
        </div>
    );
};

export default ShoppingCard;