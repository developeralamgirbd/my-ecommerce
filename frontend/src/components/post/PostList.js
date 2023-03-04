/*
import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Input, Space, Table} from "antd";
import {deleteCategoryRequest, getCategoryRequest} from "../../APIRequest/categoryApi";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import {deletePostRequest, getAuthPostsRequest} from "../../APIRequest/productApi";
import {useNavigate} from "react-router-dom";

const PostList = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    useEffect(()=>{
        getPosts();

    }, []);

    const getPosts = () =>{
        setLoading(true)
        getAuthPostsRequest().then(res => {
            setLoading(false)
            const results = res.data.posts;

            setData([...results]);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: res.data.totalPost[0].count,
                },
            });
        })
    }

    const filteredCategory = ()=>{
        return data.reduce((previousValue, currentValue)=>{
            return [...previousValue, {
                text: currentValue.categoryName,
                value: currentValue.categoryName,
            }]

        }, [])
    }



    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleEdit = (id)=>{
        navigate('/dashboard/post-create', {
            state: {
                id
            }
        })
    }
    const handleDelete = (id)=>{
        const result = window.confirm('Are you sure delete!');
        if (result){
            setLoading(true)
            deletePostRequest(id).then(res => {
                setLoading(false)
                if (res){
                    getPosts()
                }
            })
        }
    }


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>

                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
                size='large'
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '20%',
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '20%',
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '20%',

            filters: filteredCategory(),
            // render: (text) =>
            //     text ? (
            //         <>
            //             {console.log(text)}
            //             <Highlighter
            //                 highlightStyle={{
            //                     backgroundColor: '#ffc069',
            //                     padding: 0,
            //                 }}
            //                 searchWords={[text]}
            //                 autoEscape
            //                 textToHighlight={text ? text.toString() : ''}
            //             />
            //         </>
            //
            //     ) : (
            //         text
            //     ),

            onFilter: (value, record) => record.categoryName.indexOf(value) === 0,
        },

        {
            title: 'Author',
            dataIndex: 'authorName',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '20%',
        },

        {
            title: 'Action',
            dataIndex: '_id',
            defaultSortOrder: 'descend',
            width: '20%',
            render: (id,category) => {
                return (
                    <>
                        {
                         <Space wrap key={id}>
                                <Button type="primary" onClick={()=>handleEdit(id)}>Edit</Button>
                                <Button type="primary" danger onClick={()=>handleDelete(id)}>Delete</Button>
                            </Space>
                        }
                    </>

                );
            },
        },

    ];


    return (
        <Card>
            <Table
                columns={columns}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </Card>
    );
};

export default PostList;*/
