import React, {useEffect, useState} from 'react';
import {Button, Col, List, Row} from "antd";
import {getProductsRequest} from "../APIRequest/productApi";
import ProductCard from "../components/card/ProductCard";
import TopSection from "../components/home/TopSection";

const HomePage = () => {

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [products, setProduct] = useState([])

    const loadPosts = async ()=> {
        try {
            getProductsRequest(page, 3).then(res => {
                setProduct(res?.products?.rows);
                setTotal(res?.products?.total)
            })

        }catch (e) {
            console.log(e)
        }
    }

    const loadMore = async ()=>{
        try {
            setLoading(true);
            getProductsRequest(page, 3).then(res => {
                setProduct([...products, ...res?.products?.rows])
            })
            setLoading(false);
        }catch (e) {
            console.log(e);
        }

    }

    useEffect(()=> {
        if (page === 1) return;
        loadMore().catch(e => console.log(e));

    }, [page])

    useEffect(()=> {
        document.title = 'Home'
        loadPosts().catch(e => console.log(e));
    }, [])


    console.log(products)

    return (
        <>
            <TopSection/>
            <Row gutter={16}>

                {
                    products.map(product => (
                            <Col span={6}>
                                 <ProductCard product={product}/>
                             </Col>
                    ))
                }
            </Row>

            {products && products.length < total && (

            <div className='d-flex justify-content-center my-5 mb-5'>
                <Button type="primary" className='mb-5'
                        loading={loading}
                        disabled={loading}
                        onClick={event => {
                            event.preventDefault();
                            setPage(page + 1);
                        }}
                >
                    Load More
                </Button>
            </div>
            )}

        </>
    );
};

export default HomePage;