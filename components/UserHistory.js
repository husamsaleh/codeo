import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase/firebase';
import { auth } from '../firebase/firebase';

export const DisplayHistory = ({ userId }) => {
  // ...
  useEffect(() => {
    const fetchHistory = async () => {
      const historyRef = firestore.collection('history').doc(userId);
      // ...
    };

    fetchHistory();
  }, [userId]);
  // ...
};

export const saveTranslationToHistory = async (userId, inputLanguage, outputLanguage, inputCode, outputCode) => {
  try {
    const historyRef = firestore.collection('history').doc(userId);
    const history = await historyRef.get();

    if (history.exists) {
      historyRef.update({
        translations: firebase.firestore.FieldValue.arrayUnion({
          inputLanguage,
          outputLanguage,
          inputCode,
          outputCode,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
      });
    } else {
      historyRef.set({
        userId,
        translations: [{
          inputLanguage,
          outputLanguage,
          inputCode,
          outputCode,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }]
      });
    }

    console.log('Translation saved to history');
  } catch (error) {
    console.error('Error saving translation to history:', error);
  }
};


function UserHistory() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Translation History</h1>
      {userId && <DisplayHistory userId={userId} />}
    </div>
  );
}

export default {saveTranslationToHistory,DisplayHistory,UserHistory} ;
