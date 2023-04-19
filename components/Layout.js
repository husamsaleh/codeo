import React from 'react'
import Footer from './Footer'
import Header from './Header'

export default function Layout(props) {
    const { children } = props
    return (
        <div className='flex flex-col min-h-screen relative bg-gray-900 text-white'> 
       <Header /> {/* Add the Header component here */}
        <main className='flex-1 flex flex-col'>
            {children}
        </main>
        <Footer/>
        </div>
    )
}