import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Register({ onLogin }) {
    const [email_id, setEmail_id] = useState('');
    const [password, setPassword] = useState('');
    const [contact_number, setContact_number] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');


    const [error, seterror] = useState('');
    
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post('http://localhost:5000/api/register', {
                email_id: email_id,
                password: password,
                address: address,
                contact_number: contact_number,
                name: name,
                user_type: 'employee'
            })
            console.log(response);

            const { token, data } = response.data;

            localStorage.setItem('token', token)
            // console.log(token);
            // console.log(data);

            const userData = data;

            if(userData.user_type === 'admin'){
                navigate("/admin-dashboard");
            }
            else navigate("/employee-dashboard");
        }
        catch(err){
            seterror("Incorrect email or password, please try again");
        }
        
    };

    const handleBack = () => navigate('/login')

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 font-sans">

            <div className="w-full max-w-md bg-blue-950/40 backdrop-blur-md border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-950/50">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400">
                        Register
                    </h1>
                    <p className="text-sm text-zinc-400 mt-2 font-medium">
                        Please enter your credentials
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-red-200 text-sm font-medium text-center backdrop-blur-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div >
                        <label
                        className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                            Name
                        </label>
                        <input
                            type='text'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-900/60 text-white placeholder-zinc-500 border border-zinc-700 focus:border-cyan-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                        />
                    </div>
                    <div>
                        <label
                        className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                            Email
                        </label>
                        <input
                            type='text'
                            required
                            value={email_id}
                            onChange={(e) => setEmail_id(e.target.value)}
                            className="w-full bg-zinc-900/60 text-white placeholder-zinc-500 border border-zinc-700 focus:border-cyan-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                        />
                    </div>
                    <div>
                        <label
                        className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                            Contact Number
                        </label>
                        <input
                            type='text'
                            required
                            value={email_id}
                            onChange={(e) => setContact_number(e.target.value)}
                            className="w-full bg-zinc-900/60 text-white placeholder-zinc-500 border border-zinc-700 focus:border-cyan-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                        />
                    </div>
                    <div>
                        <label
                        className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                            Address
                        </label>
                        <input
                            type='text'
                            required
                            value={email_id}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-zinc-900/60 text-white placeholder-zinc-500 border border-zinc-700 focus:border-cyan-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                        />
                    </div>
                    <div>
                        <label 
                        className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            placeholder="........"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-900/60 text-white placeholder-zinc-500 border border-zinc-700 focus:border-cyan-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="submit"
                            className="w-full mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 font-bold py-3 px-4 rounded-lg text-sm tracking-wide uppercase transition shadow-cyan-950/50"
                        >
                            Authentication
                        </button>
                        <button
                            type="button" onClick={handleBack}
                            className="w-3/5 mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 font-bold py-3 px-4 rounded-lg text-sm tracking-wide uppercase transition shadow-cyan-950/50"
                        >
                            Back
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}