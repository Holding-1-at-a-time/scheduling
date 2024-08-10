import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const ScheduleForm = () => {
    const { user } = useUser();
    const [appointmentDetails, setAppointmentDetails] = useState({
        date: '',
        time: '',
        service: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAppointmentDetails({
            ...appointmentDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/schedule', {
                userId: user.id,
                appointmentDetails,
            });
            alert('Appointment scheduled successfully!');
        } catch (error) {
            alert('Failed to schedule appointment.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                <input
                    type="date"
                    name="date"
                    value={appointmentDetails.date}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                <input
                    type="time"
                    name="time"
                    value={appointmentDetails.time}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Service</label>
                <select
                    name="service"
                    value={appointmentDetails.service}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select Service</option>
                    <option value="basic">Basic Detail</option>
                    <option value="premium">Premium Detail</option>
                    <option value="full">Full Detail</option>
                </select>
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Schedule
                </button>
            </div>
        </form>
    );
};

export default ScheduleForm;
