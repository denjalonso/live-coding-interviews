import { useState, useEffect } from 'react';
import './App.css';

type AuthCodeInput = {
  onSumbit: () => void;
};

function AuthCodeInput({ onSumbit }: AuthCodeInput) {
  const [inputs, setInputs] = useState<string[]>(Array(6).fill(''));
  // Potentially move this to a reducer ...
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleReset() {
    // TBD
  }
  function handleSubmit() {
    onSumbit();
  }

  if (loading) {
    return <>Loading...</>;
  }

  if (errorMessage && !loading) {
    return <>Something went wrong `${errorMessage}`</>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map((v, i) => {
        return (
          <input
            type="text"
            key={i}
            maxLength={1}
            // the on change filters only digits in [0-9]
            onChange={(e) => {
              const newValue = e.target.value;
              const newInputsArray = [...inputs];
              newInputsArray[i] = newValue;
              setInputs(newInputsArray);
              if (newValue !== '') {
                // @ts-ignore
                e.target.nextSibling.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {

              }
            }}
          />
        );
      })}
      <input type="submit" className="primary" />
      <button onClick={handleReset} className="secondary">
        Reset
      </button>
      {/*// Potentially we could move this to a component*/}
      {success && <span>The OTP have succesfully send</span>}
    </form>
  );
}

function App() {
  return (
    <>
      <AuthCodeInput />
    </>
  );
}

export default App;
