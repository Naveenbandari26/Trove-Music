import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import SongsList from '../components/SongsList';

const MainPage = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUsername(docSnap.data().username);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 sticky top-0">
        <h1 className="text-3xl font-bold">Welcome to Trove Music, {username}!</h1>
      </header>
      <section>
        <SongsList />
      </section>
    </div>
  );
};

export default MainPage;
