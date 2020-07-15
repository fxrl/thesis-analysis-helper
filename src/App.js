import React, { useState } from "react";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";

function App() {
  const [JSONtoParse, setJSONtoParse] = useState([]);
  const [csvData, setCsvData] = useState([{}]);

  const writeCSV = () => {
    const formattedData = JSONtoParse.map((entry) => {
      const newEntry = {};

      for (const property in entry) {
        const question = entry[property];
        if (typeof question === "object") {
          for (const answer in question) {
            if (question[answer] === true) {
              newEntry[property] = answer;
            }
          }
        } else {
          newEntry[property] = question;
        }
      }
      return newEntry;
    });
    setCsvData(formattedData);
  };

  const papaparseOptions = {
    header: true,
  };

  return (
    <div>
      <h1>Analysis Helper</h1>
      <CSVReader
        parserOptions={papaparseOptions}
        onFileLoaded={(data) => {
          const jsonData = [];
          data.map((submission) => {
            for (const question in submission) {
              if (submission["AssignmentStatus"] === "Approved") {
                if (question === "Answer.taskAnswers") {
                  const answerArray = submission[question];
                  const answerObject = answerArray.substring(
                    1,
                    answerArray.length - 1
                  );
                  jsonData.push(JSON.parse(answerObject));
                }
              }
            }
          });
          setJSONtoParse(jsonData);
        }}
      />
      <button onClick={writeCSV}>Analyse Results</button>
      <button>
        <CSVLink data={csvData}>Download CSV</CSVLink>
      </button>
    </div>
  );
}

export default App;
