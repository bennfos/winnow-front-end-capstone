import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BookDataManager from './BookDataManager'

class BookEditModal extends Component {

//Defines initial state
    state = {
        books: [],
        title: "",
        description: "",
        loadingStatus: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            title: "",
            description: "",
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

//Displays/hides the edit modal
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

//Sets state with input values as fields change
    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    };


    editExistingBook = (event) => {
        event.preventDefault();

    //Validates user input
        if (this.state.title === ""||
        this.state.description === "") {
            alert("Please fill out all fields");
        } else {
            this.setState({ loadingStatus: true });

        //creates a new object for the edited news item,
            const editedBook = {
                id: this.props.book.id,
                userId: parseInt(sessionStorage.getItem("credentials")),
                title: this.state.title,
                description: this.state.description,
                timestamp: this.props.book.timestamp,
            };
        //posts the object to the database
            this.props.postEditedBook(editedBook)
        //closes the modal
            .then(this.toggle)
        }
    }


//Gets the id of the news item that is being edited and sets state to populate the input fields
    componentDidMount() {
        BookDataManager.getBook(this.props.book.id)
        .then(book => {
            this.setState({
            title: book.title,
            description: book.description,
            timestamp: this.props.book.timestamp,
            loadingStatus: false,
            });
        });
    }

    render(){
        return(
            <>
                <section className="bookSectionContent">
                <Button type="button"
                onClick={this.toggle}>
                edit
                </Button>
                </section>
                <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle}
                className={this.props.className}
            >
                    <ModalHeader toggle={this.toggle}>edit book</ModalHeader>
                    <ModalBody>
                        <form>
                            <fieldset>
                                <div className="editBookForm">
                                    <input onChange={this.handleFieldChange} type="text"
                                        id="title"
                                        value={this.state.title}
                                        required
                                        autoFocus=""
                                    /><br/>
                                    <textarea onChange={this.handleFieldChange}
                                        id="description"
                                        value={this.state.description}
                                        required
                                    /><br/>
                                </div>
                            </fieldset>
                        </form>
                    </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="button" onClick={this.editExistingBook}>save</Button>{' '}
                    <Button color="secondary" type="button" onClick={this.toggle}>cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
        </>
        )
    }
}

export default BookEditModal