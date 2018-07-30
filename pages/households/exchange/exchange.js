import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import BidsRow from '../../../components/BidsRow';
import AsksRow from '../../../components/AsksRow';
import HouseholdContract from '../../..//ethereum/household';
import web3 from '../../..//ethereum/web3';
import exchange from '../../../ethereum/exchange';
import { Dropdown, Menu, Table, Button } from 'semantic-ui-react';
import SubmitBidInput from '../../../components/SubmitBidInput';
import SubmitSellInput from '../../../components/SubmitSellInput';
import css from "../../style.css";
import { Container, Row, Col } from 'react-grid-system';
import { setConfiguration } from 'react-grid-system';
import ReactGrids from 'react-grids';
 
// setConfiguration({ defaultScreenClass: 'xl', gridColumns: 2, containerWidths: 'xl' });

class ExchangePage extends Component {
    state = {
        errorMessage: '',
        loading: false,
        selectedOption: '',
        buyVolume: '',
        askVolume: ''
    };

    static async getInitialProps(props) {
        const {address} = props.query;
        const exchangeAddress = exchange.options.address;
        const household = HouseholdContract(props.query.address);

        let bidsCount = await exchange.methods.getBidsCount().call();
        let asksCount = await exchange.methods.getAsksCount().call();

        let bidsTemp = new Array();
        let asksTemp = new Array();
        
        for(let i=0; i < bidsCount; i++){
            let bid = await exchange.methods.getBid(i).call();
            bidsTemp[i] = parseInt(bid['2'], 10);
        }
        for(let i=0; i < asksCount; i++){
            let ask = await exchange.methods.getAsk(i).call();
            asksTemp[i] = parseInt(ask['2'], 10);
        }

     
        const sumBids = bidsTemp.reduce((a, b) => a + b, 0);
        const sumAsks = asksTemp.reduce((a,b) => a + b, 0);
        console.log('sumbids', sumBids);
        console.log('sumasks', sumAsks);


        const bids = await Promise.all(
            Array(parseInt(bidsCount)).fill().map((element, index) => {
                return exchange.methods.Bids(index).call()
            })
        );

        const asks = await Promise.all(
            Array(parseInt(asksCount)).fill().map((element, index) => {
                return exchange.methods.Asks(index).call()
            })
        );

        return {bids, bidsCount, asks, asksCount, address, exchange, exchangeAddress, household, sumBids, sumAsks};
    }

    renderBuyRows() {
        return this.props.bids.map((bids, index) => {
            return <BidsRow 
              id={index}
              bids={bids}
              address={this.props.address}
              bidsCount={this.props.bidsCount}
            />;
        })
    }

    renderAskRows(){
        return this.props.asks.map((asks, index) => {
            return <AsksRow 
              id={index}
              asks={asks}
              address={this.props.address}
              bidsCount={this.props.asksCount}
            />;
        })
    }

    handleChange1 = (selectedOption) => {
        this.setState({selectedOption});
    };
    
    buySellSelection () {
        if(this.state.selectedOption == 1){
            return <SubmitBidInput address={this.props.address} />
        }
        if(this.state.selectedOption == 2){
            return <SubmitSellInput address={this.props.address} />
        }
    }
    
    render() {
        const {Header, Row, HeaderCell, Body } = Table;

        const options = [
            { key: 1, text: 'Buy', value: 1},
            { key: 2, text: 'Sell', value: 2}
        ]
        return (
        <Layout>
            <ReactGrids.Wrap
        cutoff={599}
        align="center"
        className="my-grids-wrapper"
        max-width={960}
    >
        <ReactGrids.Column
            base={10}
            span={8}
        >
            <h3>Buy Order Book</h3>
                    <Table style={{width: "575px"}}>
                        <Header>
                            <Row>
                                <HeaderCell>ID</HeaderCell>
                                <HeaderCell>From address</HeaderCell>
                                <HeaderCell>Amount</HeaderCell>
                                <HeaderCell>Price</HeaderCell>
                                <HeaderCell>Date</HeaderCell>
                            </Row>
                        </Header>
                        <Body>
                            {this.renderBuyRows()} 
                        </Body>
                    </Table>
                    <div>There are {this.props.bidsCount} bids.</div>
                    <div>Buying Volume is {this.props.sumBids} W/h.</div>

            <h3>Ask Order Book</h3>
                    <Table style={{width: "575px"}}>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>From address</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            <HeaderCell>Date</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderAskRows()} 
                    </Body>
                    </Table>
                <div>There are {this.props.asksCount} asks.</div>
                <div>Buying Volume is {this.props.sumAsks} W/h.</div>
        </ReactGrids.Column>
        <br />
        <ReactGrids.Column
            base="6" 
            span="10"
        >
        <h3>Submit Bid</h3>
                    <SubmitBidInput address={this.props.address} style={{marginBottom: '10px', width: "50px"}} /> 
        
        <h3>Submit Ask</h3>
                    <SubmitSellInput address={this.props.address} />
        </ReactGrids.Column>
    </ReactGrids.Wrap>

            {/* <Container fluid style={{ lineHeight: '40px' }} >
            <Menu compact style={{marginBottom: '10px'}} >
                <Dropdown text='Buy/Sell' options={options}  simple item />
            </Menu> 
            <Row>
                <Col debug sm={6}>
                <div>
                    collumn 1
                    <h3>Buy Order Book</h3>
                    <Table style={{width: "575px"}}>
                        <Header>
                            <Row>
                                <HeaderCell>ID</HeaderCell>
                                <HeaderCell>From address</HeaderCell>
                                <HeaderCell>Amount</HeaderCell>
                                <HeaderCell>Price</HeaderCell>
                                <HeaderCell>Date</HeaderCell>
                            </Row>
                        </Header>
                        <Body>
                            {this.renderBuyRows()} 
                        </Body>
                    </Table>
                    <div>There are {this.props.bidsCount} bids.</div>
                    <div>Buying Volume is {this.props.sumBids} W/h.</div>
                </div>
                 </Col>
                 <Col debug sm={6}>
                <div>
                    column 2
                    <h3>Submit Bid</h3>
                    <SubmitBidInput address={this.props.address} style={{marginBottom: '10px', width: "50px"}} /> 
                </div>
                </Col> 
            </Row>
            <br />
            <Row>
                <Col md={3}>
                    <h3>Ask Order Book</h3>
                    <Table style={{width: "575px"}}>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>From address</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            <HeaderCell>Date</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderAskRows()} 
                    </Body>
                    </Table>
                <div>There are {this.props.asksCount} asks.</div>
                <div>Buying Volume is {this.props.sumAsks} W/h.</div>
                </Col>
                <Col>
                    <h3>Submit Ask</h3>
                    <SubmitSellInput address={this.props.address} />
                </Col>
            </Row>

            
            


            

            
            
            

            </Container> */}
        </Layout>
        ); 
    }
}

export default ExchangePage;
{/* <SubmitBidInput  address={this.props.address} /> */}

{/* <div>
                <select id="Buy/Sell" onChange={event => this.setState({selectedOption: event.target.value})} value={this.state.selectedOption}>
                    <option value="Buy">Buy </option>
                    <option value="Sell">Sell</option>
                    </select>
                    <p></p>
                    <p>{this.state.value}</p>
                    {this.buySellSelection}
            </div> */}