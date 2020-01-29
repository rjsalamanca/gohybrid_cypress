import React, { Component } from 'react';
import { Container, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import noImageAvailable from '../placeholderCar.png'

const convert = require('xml-js');

const makeFlex = {
    display: 'flex'
}

class HomePage extends Component {
    state = {
        getYears: [],
        getMakes: [],
        getModels: [],
        year: null,
        make: '',
        model: '',
        showCurrentSelection: [],
        showCars: false,
        loading: false
    }

    componentDidMount = () => {
        this.loadYears();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.make !== '' && (prevState.year !== this.state.year)) {
            this.loadModels();
        }
    }

    loadYears = async () => {
        const url = "https://www.fueleconomy.gov/ws/rest/vehicle/menu/year";

        try {
            const response = await fetch(url)
            const responseToText = await response.text();
            const dataAsJson = JSON.parse(convert.xml2json(responseToText, { compact: true, spaces: 4 })).menuItems.menuItem;
            const years = dataAsJson.map(year => parseInt(year.value._text));
            this.setState({ getYears: years })
        } catch (err) {
            console.log(err.message)
        }
    }

    loadMakes = async () => {
        const url = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${this.state.year}`;
        try {
            const response = await fetch(url)
            const responseToText = await response.text();
            const dataAsJson = JSON.parse(convert.xml2json(responseToText, { compact: true, spaces: 4 })).menuItems.menuItem;
            const carMakes = dataAsJson.map(make => make.value._text);
            this.setState({ getMakes: carMakes })
        } catch (err) {
            console.log(err.message)
        }
    }

    loadModels = async () => {
        const url = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${this.state.year}&make=${this.state.make}`;

        try {
            this.setState({ loading: true })
            const response = await fetch(url)
            const responseToText = await response.text();
            let dataAsJson = JSON.parse(convert.xml2json(responseToText, { compact: true, spaces: 4 })).menuItems.menuItem;

            if (typeof dataAsJson === 'object') {
                dataAsJson = Array.from(dataAsJson);
            }

            const hybridCars = dataAsJson.map(model => model.value._text).filter(model => !!model.includes('Hybrid'));

            if (hybridCars.length !== 0) {
                let hybridCarIDs = await hybridCars.map(async model => await this.findHybridId(this.state.year, this.state.make, model))
                await Promise.all(hybridCarIDs).then(id => hybridCarIDs = id);

                let carModelImages = await hybridCars.map(async model => await this.getModelImagesFromWiki(model))
                await Promise.all(carModelImages).then(cars => carModelImages = cars);

                const modelsAndImages = hybridCars.map((model, index) => {
                    return { id: parseInt(hybridCarIDs[index]), model, img: carModelImages[index] }
                })

                this.setState({
                    getModels: modelsAndImages,
                    showCars: false,
                    loading: false
                });
            } else {
                this.setState({
                    getModels: [],
                    showCars: false,
                    loading: false
                })
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    findHybridId = async (year, make, carModel) => {
        const url = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${carModel}`;

        try {
            const response = await fetch(url);
            const responseToText = await response.text();
            const dataAsJson = JSON.parse(convert.xml2json(responseToText, { compact: true, spaces: 4 })).menuItems.menuItem;

            if (dataAsJson[0] !== undefined) {
                return parseInt(dataAsJson[0].value._text)
            } else {
                return parseInt(dataAsJson.value._text);
            }
        } catch (err) {
            return err.message;
        }
    }

    getModelImagesFromWiki = async (carModel) => {
        const searchMakeAndModel = (this.state.make + "_" + carModel).split(' ').join('_');
        let wikiURL = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&origin=%2A&titles=${searchMakeAndModel}&pithumbsize=250&format=json`;

        try {
            const response = await fetch(wikiURL);
            const data = await response.json();
            return data.query.pages[Object.keys(data.query.pages)].thumbnail.source;
        } catch (err) {
            const getImageFromYoutube = await this.getModelImagesFromYoutube(carModel);

            if (typeof getImageFromYoutube === 'object') {
                return noImageAvailable
            }
            return getImageFromYoutube;
        }
    }

    getModelImagesFromYoutube = async (carModel) => {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${this.state.year + ' ' + this.state.make + ' ' + carModel}&key=AIzaSyB9WzlCfQKAWzLTqAsrcepelEEUT4b8NPk`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.items[0].snippet.thumbnails.medium.url;
        } catch (err) {
            return err;
        }
    }

    handleYear = async (e) => {
        if (e.target.value !== 'Year') {
            await this.setState({ year: e.target.value });
            this.loadMakes();
        }
    }

    handleMake = async (e) => {
        if (e.target.value !== 'Make') {
            await this.setState({ make: e.target.value })
            this.loadModels();
        }
    }

    render() {
        const { getYears, getMakes, make, year, getModels } = this.state;
        const findID = this.findHybridId;
        console.log(getModels)
        return (
            <div>
                <Container role="main" id="carLookUpContainer" style={makeFlex} className="shadow rounded">
                    <div id="searchContainer">
                        <h3>Search:</h3>
                        <Form.Control onChange={(e) => this.handleYear(e)} as="select">
                            <option>Select A Year</option>
                            {getYears.length !== 0 ?
                                getYears.map(singleYear =>
                                    <option key={`year-lookup-${singleYear}`}>{singleYear}</option>
                                )
                                :
                                <option disabled>Loading Years...</option>
                            }
                        </Form.Control>
                        <Form.Control onChange={(e) => this.handleMake(e)} as="select">
                            <option>Select a Make</option>
                            {getMakes.length !== 0 ?
                                getMakes.map(singleMake =>
                                    <option key={`manufacturer-${singleMake}`}>{singleMake}</option>
                                )
                                :
                                <option disabled>Select a Year First...</option>
                            }
                        </Form.Control>
                    </div>
                    <div id="mainContainer">
                        <div className="searchParameters">
                            <p>Year: {year}</p>
                            <p>Make: {make}</p>
                        </div>
                        {!!this.state.loading ?
                            <div style={{ width: '100%', textAlign: 'center' }} >
                                <img src="https://cdn.dribbble.com/users/778626/screenshots/4339853/car-middle.gif" alt="loading" />
                            </div>
                            :
                            getModels.length !== 0 ?
                                <div className="carModels">
                                    {getModels.map((car, index) =>
                                        <Link
                                            to={{
                                                pathname: `/compare/${year}/${make}/${!!car.model.includes(' ') ? car.model.split(' ').join('_') : car.model}`,
                                                state: {
                                                    year,
                                                    make,
                                                    car
                                                },
                                                findID
                                            }}
                                            className='carCard' key={car + index}>
                                            <Card>
                                                <Card.Img variant="top" src={car.img} alt={car.model} />
                                                <Card.Body>
                                                    <Card.Title>{car.model}</Card.Title>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    )}
                                </div>
                                :
                                make.length === 0 ?
                                    <div className="carModels text-muted">
                                        <b>Please make sure to select a year and Model</b>
                                    </div>
                                    :
                                    <div className="text-muted" style={{ textAlign: 'center' }}>
                                        <p><b>No Hybrids Found, search a different year or make</b></p>
                                        <img className="shadow" style={{ width: "200px", borderRadius: "20px", margin: "20px 0" }} src="https://cdn.dribbble.com/users/1161168/screenshots/5665541/animation-car.gif" alt="Car" />
                                    </div>
                        }
                    </div>
                </Container>
            </div >
        )
    }
}

export default HomePage;