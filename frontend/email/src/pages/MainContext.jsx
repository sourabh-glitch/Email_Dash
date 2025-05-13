import  { useState } from 'react';
import templates from '../data/template.js';
import axios from 'axios';
import { toast } from 'react-toastify';

const MainContext = () => {
    const [loading, setLoading] = useState(false);
    
    const baseUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormdata] = useState({
        subject: "",
        body: "",
        recipient: "",
        cc: "",
        bcc: ""
    });

    const handlechange = (e) => {
        setFormdata({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const sendEmail = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/send-email`, formData);
            console.log("Email Sent", response.data.message);
            toast.success('Email sent successfully!');
            setFormdata({ subject: '', body: '', recipient: '', cc: '', bcc: '' });
        } catch (error) {
            console.error("Error sending email", error);
            toast.error('Failed to send email. Try again.');
        }
        setLoading(false);
    };

    return (
        <main className="flex w-full min-h-screen bg-gray-200 p-8 gap-8">
            {/* Left side (Sidebar) */}
            <aside className="w-64 bg-white p-4 shadow-md rounded">
                <h3 className="font-semibold text-lg mb-4">Templates</h3>
                <ul className="space-y-2">
                    {Object.keys(templates).map((templateName) => (
                        <li
                            key={templateName}
                            className="cursor-pointer hover:underline"
                            onClick={() =>
                                setFormdata((prev) => ({
                                    ...prev,
                                    subject: templates[templateName].subject,
                                    body: templates[templateName].body
                                }))
                            }
                        >
                            {templateName}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Right side (Main content) */}
            <section className="flex-1 bg-white p-6 shadow-md rounded">
                <h3 className="font-semibold text-lg mb-4">Compose Email</h3>
                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Recipient"
                    value={formData.recipient}
                    onChange={handlechange}
                    name='recipient'
                />
                <input
                    type="text"
                    className="border p-2 w-full mt-2"
                    placeholder="Recipient CC"
                    value={formData.cc}
                    name='cc'
                    onChange={handlechange}
                />
                <input
                    type="text"
                    className="border p-2 w-full mt-2"
                    placeholder="Recipient BCC"
                    value={formData.bcc}
                    name='bcc'
                    onChange={handlechange}
                />
                <input
                    type="text"
                    className="border p-2 w-full mt-4"
                    placeholder="Subject"
                    value={formData.subject}
                    name='subject'
                    onChange={handlechange}
                />
                <textarea
                    className="border p-2 w-full mt-4"
                    rows="10"
                    placeholder="Email body"
                    value={formData.body}
                    name='body'
                    onChange={handlechange}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 mt-4 ml-60 rounded cursor-pointer w-50"
                    onClick={sendEmail}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </section>
        </main>
    );
};

export default MainContext;
