import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {Button} from "antd";
import toast from "react-hot-toast";
import {useCart} from "../../context/cart";
import {Card} from 'antd'

const ProductCard = ({product}) => {

    const [cart, setCart] = useCart();

    const handleCart = ()=>{
        product.count = 1;

        let cartarr = [];
        cartarr= JSON.parse(localStorage.getItem('cart')) || [];

        const isProductExit = cartarr.find(item => item._id === product._id);

        if (isProductExit){
            cartarr.map((item, i) => {
                if (item._id === product._id){
                    if ( cartarr[i].count !== product.quantity){
                        cartarr[i].count += 1;
                        cartarr[i].price = product.price
                    }
                }
            })
        }else {
            cartarr.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cartarr));
        setCart(cartarr);
        toast.success('Added to cart success')
    }

    return (
        <>
            <div>
                <h1>
                    <Link to={`/post/${product._id}`}>
                        {product.name}
                    </Link>
                </h1>
                <p>Price: {product.price}</p>
                <Button type="primary" className='mr-2' size='small' onClick={handleCart}>Add to cart</Button>
                <Button type="primary" color='#ffec3d' size='small' className='ml-2'>Buy now</Button>
            </div>

            <Card
                title="Default size card"
                extra={<a href="#">More</a>}
                style={{
                    width: 300,
                }}
            >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
            </Card>
        </>
    );
};

export default ProductCard;