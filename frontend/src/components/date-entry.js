import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css'; // Ensure the date picker styles are loaded

export default function DateEntry({ onDateSelect }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const datePickerRef = useRef(null); // Create a ref for the DatePicker

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = () => {
        if (selectedDate) {
            // Format the date as MM/DD/YYYY
            const formattedDate = selectedDate.toLocaleDateString('en-US');

            // Store the selected date in local storage
            localStorage.setItem('selectedDate', formattedDate);

            // Notify the parent component
            if (onDateSelect) {
                onDateSelect(formattedDate);
            }
        } else {
            alert('Please select a date before submitting.');
        }
    };

    const handleIconClick = () => {
        if (datePickerRef.current) {
            datePickerRef.current.setOpen(true); // Open the DatePicker when the icon is clicked
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            <h1>Welcome to ChronoCanvas!</h1>
            <h5>Enter your birthday to paint your day!</h5>
            <div className='d-flex'>
                <InputGroup className="mb-3 d-flex justify-content-center text-dark">
                    <DatePicker
                        ref={datePickerRef}
                        selected={selectedDate}
                        onChange={handleDateChange}
                        customInput={
                            <Form.Control
                                type="text"
                            />
                        }
                        placeholderText="MM/DD/YYYY"
                        dateFormat="MM/dd/yyyy"
                        showPopperArrow={false}
                    />
                    <InputGroup.Text onClick={handleIconClick} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </InputGroup.Text>
                </InputGroup>
                <Button className="bg-light ms-4 h-75" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
}
