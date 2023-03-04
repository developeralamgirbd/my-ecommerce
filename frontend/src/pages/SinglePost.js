import React, {useEffect, useState} from 'react';
import { getSingleProductRequest} from "../APIRequest/productApi";
import {useParams} from "react-router-dom";

const SinglePost = () => {

    const [product, setProduct] = useState({});
    const params = useParams();

    useEffect(()=>{
        getSingleProductRequest(params.id).then(res => {
            document.title = res.product.name
            setProduct(res?.product)
        })
    }, [])

    return (
        <div>
            <h1>Product Name: {product.name}</h1>
            <h1>Product Description: {product.description}</h1>
            <h1>Product price: {product.price}</h1>
            <h1>Product quantity: {product.quantity}</h1>
            <h1>Product sold: {product.sold}</h1>
            <h1>Product categoryName: {product.categoryName}</h1>
        </div>
    );
};

export default SinglePost;