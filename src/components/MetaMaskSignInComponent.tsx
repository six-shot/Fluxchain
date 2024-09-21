import useWalletSignIn from "../hooks/useMetaMaskSignIn";

const WalletConnectComponent = () => {
  const {
    providers,
    selectedProvider,
    setSelectedProvider,
    account,
    error,
    connectProvider,
    predefinedWallets, // Added predefined wallets
  } = useWalletSignIn();

  // Combine predefined wallets with the detected providers
  const allProviders = predefinedWallets.map((predefined) => {
    const foundProvider = providers.find(
      (provider) => provider.info.name === predefined.name
    );
    return (
      foundProvider || {
        info: predefined, // Show predefined details if not found
        provider: null, // No provider yet if not found
      }
    );
  });

  return (
    <div>
      <h1>Connect Your Wallet</h1>

      {/* Show list of available and predefined providers */}
      <div>
        {allProviders.map((providerDetail) => (
          <div
            key={providerDetail.info.uuid}
            onClick={() =>
              providerDetail.provider
                ? setSelectedProvider(providerDetail)
                : alert(`${providerDetail.info.name} not available yet.`)
            }
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
            {!providerDetail.provider && (
              <small style={{ color: "red" }}>
                {providerDetail.info.name} not available
              </small>
            )}
          </div>
        ))}
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
