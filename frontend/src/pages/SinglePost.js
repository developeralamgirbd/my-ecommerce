import React, {useEffect, useRef, useState} from 'react';
import { getSingleProductRequest} from "../APIRequest/productApi";
import {useParams} from "react-router-dom";
import ReactImageMagnify from 'react-image-magnify'
import {Col, Row, Card, Typography, Input, Button, Segmented} from 'antd';
import toast from "react-hot-toast";
import {useCart} from "../context/cart";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
const { Meta } = Card;
const { Title } = Typography;




const SinglePost = () => {
    const [cart, setCart] = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const [product, setProduct] = useState({});
    const params = useParams();
    const [count, setCount] = useState(1)
    const [openDesc, setOpenDesc] = useState(true);
    const [openSpec, setOpenSpec] = useState(false);

    useEffect(()=>{
        getSingleProductRequest(params.id).then(res => {
            document.title = res.product.name
            setProduct(res?.product)
        })
    }, [])

    const imageSrc = 'https://demo.martvill.techvill.net/public/uploads/20221123/6b2f904f2fafb2b96388290860425dd0.jpg'

    const handleMouseEnter = () => {
      setIsHovered(true);

    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleCart = ()=>{
        product.count = 1;

        let cartarr = [];
        cartarr= JSON.parse(localStorage.getItem('cart')) || [];

        const isProductExit = cartarr.find(item => item._id === product._id);

        if (isProductExit){
            cartarr.map((item, i) => {
                if (item._id === product._id){
                    if ( cartarr[i].count !== product.quantity){
                        cartarr[i].count += count;
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

    const increase = ()=>{
        if (count >= product.quantity) return
        setCount(prevState => prevState + 1)
    }
    const decrease = ()=>{
        if (count === 1) return;
        setCount(prevState => prevState - 1)
    }
    const descriptionHandler = ()=>{

        setOpenDesc(true)
        setOpenSpec(false)
    }
    const specificationHandler = ()=>{

        setOpenSpec(true)
        setOpenDesc(false)
    }


    return (
        <>
            <Row gutter={16}>
                <Col span={16}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card

                            >
                                <ReactImageMagnify {...{
                                    smallImage: {
                                        alt: 'Wristwatch by Ted Baker London',
                                        isFluidWidth: true,
                                        src: imageSrc
                                    },
                                    largeImage: {
                                        src: imageSrc,
                                        width: 1200,
                                        height: 1800,
                                        zIndex: 1000
                                    },
                                    enlargedImagePosition: 'over',
                                }} />
                            </Card>
                        </Col>
                        <Col span={12}>

                            <div className='d-flex gap-2'>
                                <div className='p-1' style={{background: '#fafafa', color: '#595959'}}>Category: {product.categoryName}</div>
                                <div className='p-1' style={{background: '#fafafa', color: '#595959'}}>Brand: Brand</div>
                            </div>
                            <Title>{product.name}</Title>
                            <Title>${product.price}</Title>
                            <div className='d-flex gap-2 align-items-center'>
                                <div style={{background: '#eaff8f', color: '#5b8c00', borderRadius: '5px', padding: '10px'}}>In stock</div>
                                <p style={{padding: '10px', margin: 0}}>{product.quantity} items remaining</p>
                            </div>
                            <Row className='mt-4' gutter={16}>
                                <Col span={8}>
                                    <Input
                                        addonBefore={<MinusOutlined onClick={decrease}/>}
                                        addonAfter={<PlusOutlined onClick={increase} />}
                                        value={count} readOnly size='large' />

                                </Col>
                                <Col span={16}>
                                    <Button type="primary"
                                            style={{background: '#faad14', color: '#141414', fontWeight: 'bold', padding: '0 40px'}}
                                            size='large' onClick={handleCart}>Add to cart</Button>
                                </Col>

                            </Row>
                        </Col>
                    </Row>
                    <Segmented block options={[
                        {
                            label: <div onClick={descriptionHandler}>Description</div>,
                            value: 'description'
                        },
                        {
                            label: <div onClick={specificationHandler}>Specification</div>,
                            value: 'specification'
                        }
                    ]} />

                    <div style={{display: openDesc ? 'block': 'none'}}>Descipton</div>
                    <div style={{display: openSpec ? 'block': 'none'}}>Specification</div>

                </Col>
                <Col span={8}>
                    Right Side Bar
                </Col>
            </Row>

        </>
    );
};

export default SinglePost;