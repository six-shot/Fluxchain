
import useMetaMaskSignIn from "../hooks/useMetaMaskSignIn";

const MetaMaskSignInComponent = () => {
  const { provider, account, error, connectMetaMask } = useMetaMaskSignIn();

  return (
    <div>
      <h1>MetaMask Sign-In</h1>

      {/* Display the connection status */}
      {provider ? (
        <p>MetaMask provider found.</p>
      ) : (
        <p>MetaMask provider not found.</p>
      )}

      {/* Display the connected account */}
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <button onClick={connectMetaMask}>Connect to MetaMask</button>
      )}

      {/* Display any error messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default MetaMaskSignInComponent;
