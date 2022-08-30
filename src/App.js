import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    Layout, 
    Input, 
    Card, 
    Tag, 
    Spin, 
    Alert, 
    Modal, 
    Typography 
} from 'antd';
import 'antd/dist/antd.css';
import { Col, Row } from 'react-bootstrap';

const API_KEY = '715289b';
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const TextTitle = Typography.Title;

// ---Tanpilan Pencarian--- 
const SearchBox = ({searchHandler}) => {
    return (
        <Row>
            <Col lg={6} md={6}>
                <Search
                    placeholder="Search"
                    enterButton="Search"
                    size="large"
                    onSearch={value => searchHandler(value)}
                />
            </Col>
        </Row>
    )
}

// ---Tanpilan Card Movie---
const ColCardBox = ({Title, imdbID, Poster, Type, ShowDetail, DetailRequest, ActivateModal, Year}) => {

    const clickHandler = () => {

        ActivateModal(true);
        DetailRequest(true);

        fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            DetailRequest(false);
            ShowDetail(response);
        })
        .catch(({message}) => {
            DetailRequest(false);
        })
    }

    return (
        <Col  lg={3} md={4} sm={6}>
            <div className="gutter-box">
                <Card
                    cover={
                        <img
                            alt={Title}
                            src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster}
                        />
                    }
                    className='mb-3'
                    onClick={() => clickHandler()}
                >

                    <Row>
                        <h6>{Title} ({Year})</h6>

                    </Row>   
                    
                    <Row>
                        <Col md>
                            <Tag color="blue">{Type}</Tag>
                        </Col>
                        
                    </Row>
                </Card>
            </div>
        </Col>
    )
}

// ---Tanpilan Model Movie Detail---
const MovieDetail = ({Title, Poster, imdbRating, Rated, Runtime, Genre, Plot, Year}) => {
    return (
        <Row>
            <Col md className='mb-3'>
                <img 
                    src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster} 
                    alt={Title} 
                />
            </Col>
            <Col md>
                <Row>
                    <TextTitle level={4}>{Title} ({Year})</TextTitle>
                </Row>
                <Row style={{marginBottom: '20px'}}>
                    <Col>
                        <Tag>{Rated}</Tag> 
                        <Tag>{Runtime}</Tag> 
                        <Tag>{Genre}</Tag>
                        <Tag>Ratings: {imdbRating}</Tag>
                    </Col>
                </Row>
                <Row>
                    <Col><p className='text-justify'>{Plot}</p></Col>
                </Row>
            </Col>
        </Row>
    )
}

// ---Tanpilan Loading---
const Loader = () => (
    <div style={{margin: '20px 0', textAlign: 'center'}}>
        <Spin />
    </div>
)


// ---App---
function App() {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [q, setQuery] = useState('batman');
    const [activateModal, setActivateModal] = useState(false);
    const [detail, setShowDetail] = useState(false);
    const [detailRequest, setDetailRequest] = useState(false);


    useEffect(() => {

        setLoading(true);
        setError(null);
        setData(null);

        fetch(`http://www.omdbapi.com/?s=${q}&apikey=${API_KEY}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            if (response.Response === 'False') {
                setError(response.Error);
            }
            else {
                setData(response.Search);
            }

            setLoading(false);
        })
        .catch(({message}) => {
            setError(message);
            setLoading(false);
        })

    }, [q]);

    
    return (
        <div className="App">
            <Layout className="layout">
                <Header>
                    <div style={{ textAlign: 'center'}}>
                        <TextTitle style={{color: '#ffffff', marginTop: '14px'}} level={3}>Simple Movie List App</TextTitle>
                    </div>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <SearchBox searchHandler={setQuery} />
                        <br />
                        
                        <Row gutter={16} type="flex" justify="center">
                            { loading &&
                                <Loader />
                            }

                            { error !== null &&
                                <div style={{margin: '20px 0'}}>
                                    <Alert message={error} type="error" />
                                </div>
                            }
                            
                            { data !== null && data.length > 0 && data.map((result, index) => (
                                <ColCardBox 
                                    ShowDetail={setShowDetail} 
                                    DetailRequest={setDetailRequest}
                                    ActivateModal={setActivateModal}
                                    key={index} 
                                    {...result} 
                                />
                            ))}
                        </Row>
                    </div>
                    <Modal
                        title='Detail'
                        centered
                        visible={activateModal}
                        onCancel={() => setActivateModal(false)}
                        footer={null}
                        width={800}
                        >
                        { detailRequest === false ?
                            (<MovieDetail {...detail} />) :
                            (<Loader />) 
                        }
                    </Modal>
                </Content>
                <Footer style={{ textAlign: 'center' }}>All Right Reserves. &copy; OMDB API</Footer>
            </Layout>
        </div>
    );
}

export default App;
