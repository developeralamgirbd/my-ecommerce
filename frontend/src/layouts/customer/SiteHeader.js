import React from 'react';
import {Badge, Col, Dropdown, Row, Space} from "antd";
import {Link, NavLink} from "react-router-dom";
import {DownOutlined, KeyOutlined, ShoppingCartOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";
import Search from "../../components/Search";
import {useCart} from "../../context/cart";
import {useAuth} from "../../context/AuthProvider";
import {sessionRemove} from "../../helpers/sessionHelper";

const SiteHeader = () => {

    const [cart, setCart] =useCart();
    const {auth, token} = useAuth();
    // const [categories, setCategories] = useCategories();


    const logout = ()=>{
        sessionRemove();
    }

    const items = [
        {
            key: '1',
            label: (
                <Link to='/customer/profile'>
                    Profile
                </Link>
            ),
            icon: <UserOutlined />
        },
        {
            key: '2',
            label: (
                <Link to='/customer/orders'>
                    Orders
                </Link>
            ),
            icon: <UserOutlined />
        },
        {
            key: '3',
            label: (
                <Link to='/customer/change-password'>
                    Change Password
                </Link>
            ),
            icon: <KeyOutlined rotate={-130} />
        },
        {
            key: '4',
            label: (
                <a href='/' onClick={logout} >
                    Log Out
                </a>
            ),
            icon: <UploadOutlined rotate={90} />
        }
    ];

    return (
        <div className='container py-4'>
            <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                    <div >
                       <Link to='/'>Site Logo</Link>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    <div >
                        <Search/>
                    </div>
                </Col>
                <Col className="gutter-row" span={6}>
                    <div >
                        <nav className="navbar navbar-expand-lg">
                            <div className="container">

                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                        aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <NavLink className="nav-link" aria-current="page" to="/cart">
                                                <Badge count={cart.length} offset={[0,-4]}>
                                                    {/*<Avatar shape="square" size="large" />*/}
                                                    <ShoppingCartOutlined style={{ fontSize: '26px', color: '#08c' }} />
                                                </Badge>
                                            </NavLink>
                                        </li>

                                        {
                                            token ? <>
                                                <li className="nav-item">

                                                    <Dropdown
                                                        menu={{
                                                            items,
                                                        }}
                                                        className="nav-link"
                                                    >
                                                        <a onClick={(e) => e.preventDefault()}>
                                                            <Space>
                                                                <UserOutlined />
                                                                Account
                                                                <DownOutlined />
                                                            </Space>
                                                        </a>
                                                    </Dropdown>


                                                </li>


                                            </> : <>
                                                <li className="nav-item">
                                                    <NavLink className="nav-link" aria-current="page" to="/login">Login</NavLink>
                                                </li>

                                                <li className="nav-item">
                                                    <NavLink className="nav-link" aria-current="page" to="/register">Register</NavLink>
                                                </li>
                                            </>
                                        }

                                    </ul>

                                </div>
                            </div>
                        </nav>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SiteHeader;