import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Users extends Component {
    state = {
        comparisons: 'You Have No Saved Comparisons.'
    }

    componentDidMount = () => {
        if (!!this.props.user.isLoggedIn) {
            this.getSavedComparisons();
        }
    }
    componentDidUpdate = () => {
        this.removeButtons();
    }

    getSavedComparisons = async () => {
        const url = "http://localhost:3000/users";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_id: this.props.user.id })
            })

            const data = await response.json();
            console.log(data)
            if (data.compares.length !== 0) {
                this.setState({ comparisons: data.compares })
            }
        } catch (err) {
            // This error code tells us that the url is bad.
            console.log(err.message)
        }
    }

    removeButtons = () => {
        let nodeItems = [...(document.querySelectorAll('.comparisonButton'))];

        for (let g of nodeItems) {
            g.innerHTML = '';
        }
    }

    removeComparison = async (comparisonID) => {
        let removeComparisons = this.state.comparisons;

        let indexOfComparisonID = this.state.comparisons.findIndex(compare => {
            return compare.id === comparisonID
        })

        removeComparisons.splice(indexOfComparisonID, 1);
        this.setState({ comparisons: removeComparisons });

        const url = "http://localhost:3000/compare/remove";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ comparison_id: comparisonID })
            })

            const data = await response.json();
            console.log('Removed: ', data.removed)
        } catch (err) {
            // This error code tells us that the url is bad.
            console.log(err.message)
        }
    }

    render() {
        const { user } = this.props;
        return (
            <div style={{ height: '100%' }}>
                {typeof this.state.comparisons === 'object' && this.state.comparisons.length !== 0 ?
                    <>
                        {this.state.comparisons.map(singleCompare =>
                            <div key={`comparison-${singleCompare.id}`} style={{ textAlign: 'center' }} id={`comparison-${singleCompare.id}`}>
                                <Button variant={'danger'} style={{ marginBottom: '-60px' }} onClick={() => this.removeComparison(singleCompare.id)}>Remove Comparison</Button>
                                <div dangerouslySetInnerHTML={{ __html: decodeURI(singleCompare.html) }} >
                                </div>
                            </div>
                        )}
                    </>
                    :
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ margin: '50px 30px 0px' }}>
                            <b>{this.state.comparisons}</b>
                        </h3>
                        <h4>Click <Link to="/">Here</Link> to start comparing</h4>
                    </div>
                }
                {!!user.isLoggedIn ? '' : <Redirect to="/" />}
            </div >
        )
    }
}

export default Users;