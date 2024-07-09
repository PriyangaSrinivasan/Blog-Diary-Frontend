import React from 'react';
import { Footer } from "flowbite-react";
import { BsGithub } from "react-icons/bs";
const FooterCom = () => {
    return (
        <Footer container className='bg-slate-900'>
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div>
              <Footer.Brand
                href="https://flowbite.com"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsezmyXrVYbuEKJAyfdLbYsMp0qCihp2Evuw&s"
                alt="Blog logo"
                name={<h1 className='app px-2 py-1 text-lime-500 text-4xl flex'>Blog Diary</h1>}
              />
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <Footer.Title title="about" />
                <Footer.LinkGroup col>
                  <Footer.Link href="https://flowbite-react.com/">Flowbite</Footer.Link>
                  <Footer.Link href="https://tailwindcss.com/">Tailwind CSS</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="Follow us" />
                <Footer.LinkGroup col>
                  <Footer.Link href="https://github.com/PriyangaSrinivasan">Github</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="Legal" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Privacy Policy</Footer.Link>
                  <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href="#" by="Priyanga™" year={new Date().getFullYear()} />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Footer.Icon href="https://github.com/PriyangaSrinivasan" icon={BsGithub} />
            </div>
          </div>
        </div>
      </Footer>
    );
};

export default FooterCom;