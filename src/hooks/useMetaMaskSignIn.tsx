import { useEffect, useState } from "react";

//  Represents the assets needed to display a wallet
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

// Custom hook for wallet discovery and MetaMask sign-in
const useMetaMaskSignIn = () => {
  const [provider, setProvider] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // Listen for announced providers based on EIP-6963
    const handleAnnounceProvider = (
      event: CustomEvent<EIP6963ProviderDetail>
    ) => {
      const { detail } = event;
      const { info, provider } = detail;

      console.log(`Wallet provider found: ${info.name}`);
      // Automatically set the first discovered provider (MetaMask or any other injected wallet)
      if (info.name.toLowerCase().includes("metamask")) {
        setProvider(provider);
      }
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

  // Function to handle connecting to MetaMask and getting the account
  const connectMetaMask = async () => {
    if (!provider) {
      setError("MetaMask provider not found. Ensure MetaMask is installed.");
      return;
    }

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (err: any) {
      setError(err.message || "Failed to connect to MetaMask.");
    }
  };

  return { provider, account, error, connectMetaMask };
};

export default useMetaMaskSignIn;
