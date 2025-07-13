// ... existierender Code ...

import "@stdlib/deploy";
import "./jetton-wallet"; // Importiert den Wallet-Code

// --- Nachrichten-Definitionen ---
message Mint {
    amount: Int as coins;
    receiver: Address;
}

message BurnNotification {
    amount: Int as coins;
    owner: Address;
}

// --- Hauptvertrag: JettonMinter ---
contract JettonMinter with Deployable {
    
    owner: Address;
    totalSupply: Int as coins;
    content: Cell; // Metadaten: Name, Symbol, etc.
    walletCode: Cell;

    // Map für das Claim-System: speichert den letzten Claim-Zeitpunkt pro Adresse
    claims: map<Address, Int as uint32>; 
    const COOLDOWN: Int = 24 * 60 * 60; // 24 Stunden Abklingzeit

    init(owner: Address, content: Cell) {
        self.owner = owner;
        self.totalSupply = 0;
        self.content = content;
        self.walletCode = initCodeOf(JettonWallet);
        self.claims = emptyMap();
    }

    // --- Empfangsfunktionen ---

    // Neue Token minten (nur für den Besitzer)
    receive(msg: Mint) {
        require(context().sender == self.owner, "Access denied: Only owner can mint.");
        self.totalSupply += msg.amount;
        let walletAddress: Address = self.getWalletAddress(msg.receiver);
        send(walletAddress, self.owner, value: ton("0.05"), body: TokenTransferInternal{amount: msg.amount, from: msg.receiver}.toCell());
    }
    
    // Benachrichtigung über verbrannte Token
    receive(msg: BurnNotification) {
        self.totalSupply -= msg.amount;
    }

    // Token "claimen" (für jeden Nutzer)
    receive("claim") {
        let sender: Address = context().sender;
        let lastClaim: Int? = self.claims.get(sender);
        
        if (lastClaim != null) {
            require(lastClaim!! + COOLDOWN < now(), "Cooldown period is not over yet.");
        }
        
        self.claims.set(sender, now());
        
        let reward: Int = ton("10"); // 10 GTON Belohnung
        self.totalSupply += reward;
        
        let walletAddress: Address = self.getWalletAddress(sender);
        send(walletAddress, self.owner, value: ton("0.05"), body: TokenTransferInternal{amount: reward, from: sender}.toCell());
    }

    // --- Get-Methoden ---

    get fun getWalletAddress(ownerAddress: Address): Address {
        return contractAddress(initOf(JettonWallet, self.address, ownerAddress, self.walletCode));
    }
    
    get fun getJettonData(): (Int, Cell, Address, Cell) {
        return (self.totalSupply, self.content, self.owner, self.walletCode);
    }
}
