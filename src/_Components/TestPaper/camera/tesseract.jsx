import React, { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import axios from 'axios';

function TesseractOCR({ Image, setLoading, setProgress }) {
  const [recognizedText, setRecognizedText] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [isSendingData, setIsSendingData] = useState(false);
  const [textArray, setTextArray] = useState([]);
  const [questionType, setQuestionType] = useState([]);
  const [TUPCID, setTUPCID] = useState(null);
  const [UID, setUID] = useState(null);
  const [loadingText, setLoadingText] = useState('');

  const recognizeText = async () => {
    if (Image) {
      const worker = await createWorker('eng');
      try {
        await worker.setParameters({
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
        });
  
        for (let i = 0; i < 100; i++) {
          setLoadingProgress(i);
          if (i === 1) setLoadingText('STARTING');
          if (i === 20) setLoadingText('PREPROCESSING'); 
          if (i === 90) setLoadingText('FINALIZING'); 
          if (i === 100) setLoadingText('RESULT READY!'); 
          await new Promise(resolve => setTimeout(resolve, 150));
        }
  
        setProgress(100);
  
        const { data: { text } } = await worker.recognize(Image);
  
        let array = text.split('\n');
        array = array.filter(line => line.trim() !== '');
  
        let questionTypes = [];

        for (const line of array) {
          if (line.includes('MULTIPLE CHOICE')) {
            questionTypes.push('MultipleChoice');
          } 
          if (line.includes('TRUE OR FALSE')) {
            questionTypes.push('TrueFalse');
          } 
          if (line.includes('IDENTIFICATION')) {
            questionTypes.push('Identification');
          }
        }
        
        if (array.length >= 2 && array[1].includes('NAME')) {
          array.splice(1, 1);
        }
        
        const resultsArray = array.filter((line) => {
          return (
            !questionTypes.some(type => line.includes(type)) &&
            !line.includes('MULTIPLE CHOICE') &&
            !line.includes('TRUE OR FALSE') &&
            !line.includes('IDENTIFICATION')
          );
        });
        
         
        for (const line of resultsArray) {
          if (line.includes('TUPC')) {
            const match = line.match(/TUPC(\d{2})(\d{4})/);
            if (match) {
              setTUPCID(`TUPC-${match[1]}-${match[2]}`);
            }
          } else if (line.includes('UID')) {
            const uidMatch = line.match(/UID (\d+)/);
            if (uidMatch) {
              setUID(uidMatch[1]);
            }
          }
        }

        const filteredResultsArray = resultsArray.filter((line) => {
          return !line.includes('TUPC') && !line.includes('UID');
        });
        
        setTextArray(filteredResultsArray);
        setQuestionType(questionTypes);
        setRecognizedText(text);
        setIsPopUpVisible(true);
  
        await worker.terminate();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const sendTextToServer = async () => {
    setIsSendingData(true);
    const formattedQuestionTypes = questionType.map((type, index) => ({
      type: `TYPE ${index + 1}`,
      questionType: type,
    }));

    const formattedAnswers = [];

    for (let i = 0; i < textArray.length; i++) {
      const answerType = `TYPE ${i + 1}`;
      const answers = textArray[i];
      formattedAnswers.push({ type: answerType, answers });
    }

    try {
      const response = await axios.post('http://localhost:3001/results', {
        TUPCID,
        UID,
        questionType: formattedQuestionTypes,
        answers: formattedAnswers,
      });

      console.log('Data sent to the server:', response.data);
      setLoadingProgress(100);
      setLoadingText('COMPLETE');

      setTimeout(() => {
        setLoadingText('');
      }, 5000);
    } catch (error) {
      console.error('Error sending data to the server:', error);
    } finally {
      setIsSendingData(false);
      setIsPopUpVisible(false);
      setLoading(false);
    }
  }

  const cancelAction = () => {
    setIsPopUpVisible(false);
    setLoadingText('');
  }

  useEffect(() => {
    recognizeText();
  }, [Image]);

  return (
    <div>
      {isPopUpVisible && (
        <div className="popup">
          <h2>Confirm Action</h2>
          <p>Do you want to send the data to the database?</p>
          <button onClick={sendTextToServer}>Send</button>
          <button onClick={cancelAction}>Cancel</button>
          <p>Recognized Text:</p>
          <p>{recognizedText}</p>
        </div>
      )}

      {setLoading && (
        <div>
          {isSendingData ? 'Sending data to the server...' : loadingText}
        </div>
      )}
    </div>
  );
}

export default TesseractOCR;
