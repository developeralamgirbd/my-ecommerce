import React from 'react';
import {Link, NavLink, Outlet} from "react-router-dom";
import {Avatar, Badge, Dropdown, Space} from "antd";
import useCategories from "../../hooks/useCategories";
import Search from "../../components/Search";
import {useCart} from "../../context/cart";
import {useAuth} from "../../context/AuthProvider";
import {sessionRemove} from "../../helpers/sessionHelper";
import {DownOutlined, KeyOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";



const Main = () => {
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
        <>
           <header>
               <nav className="navbar navbar-expand-lg bg-light">
                   <div className="container">
                       <Link className="navbar-brand" to="/">WRITE YOUR BLOG</Link>
                       <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                               data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                               aria-expanded="false" aria-label="Toggle navigation">
                           <span className="navbar-toggler-icon"></span>
                       </button>
                       <div className="collapse navbar-collapse" id="navbarSupportedContent">

                           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                               <li className="nav-item">
                                   <Link className="nav-link active" aria-current="page" to="/blog">Blog</Link>
                               </li>
                               <li className="nav-item">
                                   <Link className="nav-link active" aria-current="page" to="/category">Categories</Link>
                               </li>
                           </ul>

                           <ul className="navbar-nav">
                               <li className="nav-item">
                                   <NavLink className="nav-link" aria-current="page" to="/cart">Cart
                                       <Badge count={cart.length} offset={[0,-20]}>
                                           {/*<Avatar shape="square" size="large" />*/}
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
                           <Search/>

                       </div>
                   </div>
               </nav>
           </header>

            <section>
                <div className="container">
                    <div className="categories my-3">
                        {/*<ul className="">
                            {
                                categories.map(category => (
                                    <li className="" >
                                        <Link to= {`/category/posts/${category.name}`}>
                                            {category.name}
                                            <Badge count={0} offset={[4]} showZero/>
                                        </Link>
                                    </li>
                                ))
                            }

                        </ul>*/}
                    </div>
                </div>


            </section>
            <div className="container">
                <Outlet/>
            </div>
        </>
    );
};

export default Main;