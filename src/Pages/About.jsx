import React from 'react';
import "../index.css"
const About = () => {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='max-w-3xl mx-auto p-3 text-center'>
            <h2 className='font-serif font-semibold'>About</h2>
            <h1 className='app px-2 py-1 text-lime-500 text-4xl text-center'> Blog Diary</h1>
                <img className='mx-52 mt-7 size-72 w-96' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4ckFKK2oIQbnHR-Mp44orcL6QLzdnE82bug&s' />
                <div className='text-md flex flex-col gap-6 mt-10 text-slate-500'>
                    <p className='about text-3xl text-black'>
                        welcome to Blog Diary! who loves to write about Technology,Entertainment,Education,Finance,coding, and everything .
                        on this blog you can create ,update,delete your post and  You can like, comment and share other people's posts.  
                    </p>
                    <p className='about text-3xl text-black'>
                        The blog Diary is developed using MERN (MongoDb, ExpressJS,ReactJs,NodeJs)Stack,allowing users to create,read,update and delete blog posts,including features like adding new posts and viewing exiting posts
                    </p>

                </div>

            </div>
           
        </div>
    );
};

export default About;