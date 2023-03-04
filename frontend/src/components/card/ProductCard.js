import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {Button} from "antd";
import toast from "react-hot-toast";
import {useCart} from "../../context/cart";

const ProductCard = ({product}) => {

    const [cart, setCart] = useCart();

    const handleCart = ()=>{
        product.count = 1;

        let cartarr = [];
        cartarr= JSON.parse(localStorage.getItem('cart'));

        const isProductExit = cartarr.find(item => item._id === product._id);
        if (isProductExit){
            cartarr.map((item, i) => {
                if (item._id === product._id){
                    cartarr[i].count += 1
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
        </>
    );
};

export default ProductCard;