import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CAL_MAILER_NEWENTRY_URL } from '../../../utils/apiUrls';

const CreateMailerEntry = () => {
    const [formData, setFormData] = useState({
        mail_id: '',
        // role: '',  // Role will now be a string, but will be selected from dropdown
        name: '',
        // gauge_id: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Email validation function (can be enhanced)
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validate email whenever the email field is changed
        if (name === 'mail_id' && !validateEmail(value)) {
            setError('Invalid email address'); // Show error message if invalid
        } else {
            setError(''); // Clear error if email is valid
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email one last time before submission
        if (!validateEmail(formData.mail_id)) {
            setError('Please enter a valid email address');
            return; // Prevent submission if email is invalid
        }

        try {
            // Sending all the form data to the backend
            await axios.post(CAL_MAILER_NEWENTRY_URL, formData);
            navigate('/cal_mailer_list'); // Redirect after successful submission
        } catch (error) {
            console.error('Error creating entry:', error);
        }
    };

    return (
        <div className="container">
            <h4>Create New Mailer Entry</h4>
            <form onSubmit={handleSubmit}>
                {/* Mail ID Field */}
                <div className="mb-3">
                    <label className="form-label">Mail ID</label>
                    <input
                        type="email" // Use type email for basic validation
                        name="mail_id"
                        className="form-control"
                        value={formData.mail_id}
                        onChange={handleChange}
                        required
                    />
                    {/* Error message for invalid email */}
                    {error && <div className="text-danger mt-2">{error}</div>}
                </div>

                {/* Role Dropdown */}
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                        name="role"
                        className="form-control"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                        {/* <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option> */}
                        {/* Add more roles as needed */}
                    </select>
                </div>

                {/* Name Field */}
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Gauge ID Field */}
                <div className="mb-3">
                    <label className="form-label">Gauge ID</label>
                    <input
                        type="text"
                        name="gauge_id"
                        className="form-control"
                        value={formData.gauge_id}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    );
};

export default CreateMailerEntry;
