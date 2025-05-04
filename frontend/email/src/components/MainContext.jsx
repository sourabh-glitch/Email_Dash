import React, { useState } from 'react'
import templates from '../data/template.js' // Assuming you have a file with templates data

const MainContext = () => {
    const [template, settemplate] = useState("")
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

   
      

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
                            onClick={() => {setBody(templates[templateName].body);
                                setSubject(templates[templateName].subject)
                                
                            }}
                        >
                            {templateName}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Right side (Main content) */}
            <section className="flex-1 bg-white p-6 shadow-md rounded">
                <h3 className="font-semibold text-lg mb-4">Compose Email</h3>
                <input type="text" className="border p-2 w-full" placeholder="Recipient" />
                <input type="text" className="border p-2 w-full mt-2" placeholder="Recipient CC" />
                <input type="text" className="border p-2 w-full mt-2" placeholder="Recipient BCC" />
                <input type="text" className="border p-2 w-full mt-4" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <textarea
                    className="border p-2 w-full mt-4"
                    rows="10"
                    placeholder="Email body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 mt-4 ml-60 rounded cursor-pointer w-50">Send</button>
            </section>
        </main>
    )
}

export default MainContext
