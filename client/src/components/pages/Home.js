import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import Contact from '../contacts/Contacts';
import ContactForm from '../contacts/ContactForm';
import ContactFilter from '../contacts/ContactFilter';
const Home = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.loadUser();
  }, []);

  return (
    <div className='grid-2'>
      <div>
        <ContactForm />
      </div>

      <div>
        <ContactFilter />
        <Contact />
      </div>
    </div>
  );
};

export default Home;
