import { APIKeyInput } from '@/components/APIKeyInput';
import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '../components/ModelSelect';
import { OpenAIModel, TranslateBody } from '@/types/types';
import Head from 'next/head';
// import { saveTranslationToHistory, DisplayHistory } from  '../components/UserHistory';


import { useAuth } from '../context/AuthContext'

//add under sign in dec
// firebase.firestore().collection("users").doc(firebaseConfig.user.uid).set({
//   uid: firebaseConfig.user.uid,
//   email: firebaseConfig.user.email,
//   name: firebaseConfig.user.displayName,
//   provider: firebaseConfig.user.providerData[0].providerId,
//   photoUrl: firebaseConfig.user.photoURL,
// });



import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';




import Login from '../components/Login'

export default function Home() {


  const { currentUser } = useAuth();



  const [showLogin, setShowLogin] = useState(false);

  const handleButtonClick = () => {
    setShowLogin(!showLogin); // Toggle the showLogin state
  };
  const buttonText = showLogin ? 'Hide Login' : 'Log in To Translate'; // Change the button text based on the showLogin state

  

  
 
  
  

  const [inputLanguage, setInputLanguage] = useState<string>('JavaScript');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState('');

  

  
    const handleTranslate = async () => {
      const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;
  
      if (!apiKey) {
        alert('Please enter an API key.');
        return;
      }
  
      if (inputLanguage === outputLanguage) {
        alert('Please select different languages.');
        return;
      }
  
      if (!inputCode) {
        alert('Please enter some code.');
        return;
      }
  
      if (inputCode.length > maxCodeLength) {
        alert(
          `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
        );
        return;
      }
  
      setLoading(true);
      setOutputCode('');
  
      const controller = new AbortController();
  
      const body: TranslateBody = {
        inputLanguage,
        outputLanguage,
        inputCode,
        model,
        apiKey,
      };
  
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        setLoading(false);
        alert('Something went wrong.');
        return;
      }
  
      const data = response.body;
  
      if (!data) {
        setLoading(false);
        alert('Something went wrong.');
        return;
      }
  
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let code = '';
  
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
  
        code += chunkValue;
  
        setOutputCode((prevCode) => prevCode + chunkValue);
      }
  
      setLoading(false);
      setHasTranslated(true);
      copyToClipboard(code);
      // saveTranslationToHistory(userId, inputLanguage, outputLanguage, inputCode, outputCode);
    };
  useEffect(() => {
    if (hasTranslated) {
      handleTranslate();
    }
  }, [outputLanguage]);

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');

    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);
 

 
  

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);

    localStorage.setItem('apiKey', value);
  };


  const copyOutputCodeToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = outputCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setCopyStatus('Copied!');
    setTimeout(() => {
      setCopyStatus('');
    }, 96000); // Reset the copy status after 2 seconds
  };


  const callApi = async ()=> {
    
  }


  return (
    <>
      <Head>
        <title>Code Translator</title>
        <meta
          name="description"
          content="Use AI to translate code from one language to another."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex  flex-col items-center bg-black px-5  text-neutral-200 sm:px-10">
        {/* ... existing content */}
      </div>
      <div className="flex  flex-col items-center bg-black px-5  text-neutral-200 sm:px-10">
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
          <div className="text-4xl font-bold">CodeLingo: AI Code Translator</div>
          <div className="text-2xl font-bold">Please Enter Your OpenAI API Key Below</div>
        </div>

        <div className="mt-6 text-center text-sm">
          <APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <ModelSelect model={model} onChange={(value) => setModel(value)} />

          <button
  className="w-[140px] cursor-pointer rounded-md bg-black hover:bg-white hover:text-black border border-indigo-600  px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
  onClick={() => handleTranslate()}
  // disabled={loading || !currentUser}
>
  {loading ? 'Translating...' : 'Translate'}
</button>

        </div>

        <div className="mt-2 text-center text-xs">
          {loading
            ? 'Translating...'
            : hasTranslated
              ? 'Output copied to clipboard!'
              : 'Enter some code and click "Translate"'}
        </div>

        <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="flex h-full flex-col	justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Input</div>

            <LanguageSelect
              language={inputLanguage}
              onChange={(value) => {
                setInputLanguage(value);
                setHasTranslated(false);
                setInputCode('');
                setOutputCode('');
              }}
            />

            <CodeBlock
              code={inputCode}
              editable={!loading}
              onChange={(value) => {
                setInputCode(value);
                setHasTranslated(false);
              }}
            />
          </div>
          <div className="relative mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">



            <div className="text-center text-xl font-bold ">Output</div>
            <div className="flex items-center absolute right-0 bottom-0 z-50">
              <button
                className="copy-button absolute right-0 bg-black hover:bg-white hover:text-black border border-indigo-600 font-bold py-1 px-2  rounded"
                onClick={copyOutputCodeToClipboard}
              >
                <FontAwesomeIcon icon={faCopy} />


              </button>

              <span className="ml-2 absolute mb-5">{copyStatus}</span>
            </div>
            <LanguageSelect
              language={outputLanguage}
              onChange={(value) => {
                setOutputLanguage(value);
                setOutputCode('');
              }}
            />

            <CodeBlock code={outputCode} />
          </div>
        </div>
        


        <div>
      <button className='text-2xl p-5 m-5 font-semibold bg-black hover:bg-white hover:text-black border border-indigo-600' onClick={handleButtonClick}>{buttonText}</button>
      {showLogin && <Login />}
    </div>

{/* <div>
      <h1>Translation History</h1>
      {userId && <displayHistory userId={userId} />}
    </div> */}

 

      </div>

    </>
  );

}

