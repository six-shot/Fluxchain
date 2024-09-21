import { useEffect, useState } from "react";
import metamask from "../../src/assets/metamask.svg"
import coinbase from "../../src/assets/coinbase.svg"
// Represents the assets needed to display a wallet
interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

// Define the structure for provider detail as per EIP-6963
interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any; // EIP-1193 provider type
}

// Predefined wallet names
const predefinedWallets = [
  {
    name: "MetaMask",
    uuid: "",
    icon: metamask, 
  },
  {
    name: "Coinbase Wallet",
    uuid: "", 
    icon: coinbase, 
  },
];

// Custom hook for wallet discovery and MetaMask/Coinbase sign-in
const useWalletSignIn = () => {
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // Handle announced providers and avoid duplicates
    const handleAnnounceProvider = (
      event: CustomEvent<EIP6963ProviderDetail>
    ) => {
      const { detail } = event;

      // Check if the provider is already in the list
      setProviders((prevProviders) => {
        const exists = prevProviders.some(
          (provider) => provider.info.uuid === detail.info.uuid
        );
        if (exists) return prevProviders; // Don't add if it already exists

        return [...prevProviders, detail];
      });

      console.log(`Wallet provider found: ${detail.info.name}`);
    };

    // Request providers to announce themselves
    const requestProvider = () => {
      window.dispatchEvent(new Event("eip6963:requestProvider"));
    };

    // Add listener for provider announcements
    window.addEventListener(
      "eip6963:announceProvider",
      handleAnnounceProvider as EventListener
    );

    // Dispatch the request for provider discovery
    requestProvider();

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        handleAnnounceProvider as EventListener
      );
    };
  }, []);

  // Function to handle connecting to the selected provider and getting the account
  const connectProvider = async () => {
    if (!selectedProvider) {
      setError("Provider not selected. Please choose a wallet.");
      return;
    }

    try {
      const accounts = await selectedProvider.provider.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (err: any) {
      setError(err.message || "Failed to connect to provider.");
    }
  };

  return {
    providers,
    selectedProvider,
    setSelectedProvider,
    account,
    error,
    connectProvider,
    predefinedWallets, 
  };
};

export default useWalletSignIn;
