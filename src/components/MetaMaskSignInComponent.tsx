import useWalletSignIn from "../hooks/useMetaMaskSignIn";

const WalletConnectComponent = () => {
  const {
    providers,
    selectedProvider,
    setSelectedProvider,
    account,
    error,
    connectProvider,
  } = useWalletSignIn();

  return (
    <div>
      <h1>Connect Your Wallet</h1>

      {/* Show list of available providers */}
      <div>
        {providers.length > 0 ? (
          providers.map((providerDetail) => (
            <div
              key={providerDetail.info.uuid}
              onClick={() => setSelectedProvider(providerDetail)}
              style={{
                cursor: "pointer",
                border:
                  selectedProvider?.info.uuid === providerDetail.info.uuid
                    ? "2px solid green"
                    : "1px solid gray",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <img
                src={providerDetail.info.icon}
                alt={providerDetail.info.name}
                style={{ width: "30px", height: "30px" }}
              />
              <p>{providerDetail.info.name}</p>
            </div>
          ))
        ) : (
          <p>No wallet providers found. Ensure you have installed a wallet.</p>
        )}
      </div>

      {/* Button to connect to selected provider */}
      <button onClick={connectProvider} disabled={!selectedProvider}>
        {selectedProvider
          ? `Connect to ${selectedProvider.info.name}`
          : "Select a Wallet"}
      </button>

      {/* Display the account or error */}
      {account && <p>Connected Account: {account}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default WalletConnectComponent;
