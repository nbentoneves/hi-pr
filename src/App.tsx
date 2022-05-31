import React from "react";

const App = () => {
  const [flag, setFlat] = React.useState(true);

  return (
    <div>
      <div>{flag ? "Hello" : "Bye"}</div>
      <div>
        <button onClick={() => window.api.notification("test")}>
          Click here
        </button>
      </div>
    </div>
  );
};

export default App;
