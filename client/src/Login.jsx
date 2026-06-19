import React, { useState, useEffect } from "react";


export default function Login({ onLogin }) {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [error, seterror] = useState('');
    

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = USERS.find(
            (u) => u.username === username && u.password === password
        );
        if (user !== undefined) {
            seterror('');
            onLogin(user);
        }
        else{
            seterror("Incorrect username or password, please try again");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 font-sans">

            <div className="w-full max-w-md bg-blue-950/40 backdrop-blur-md border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-950/50">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400">
                        User Access
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                        className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                            Username
                        </label>
                        <input
                            type='text'
                            required
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
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
                            onChange={(e) => setpassword(e.target.value)}
                            className="w-full bg-zinc-900/60 text-white placeholder-zinc-500 border border-zinc-700 focus:border-cyan-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 font-bold py-3 px-4 rounded-lg text-sm tracking-wide uppercase transition shadow-cyan-950/50"
                    >
                        Authentication
                    </button>
                </form>
            </div>
        </div>
    )
}