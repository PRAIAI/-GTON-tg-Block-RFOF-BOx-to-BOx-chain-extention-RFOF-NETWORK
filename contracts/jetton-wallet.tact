import "@stdlib/ownable";

// --- Nachrichten-Definitionen ---
message TokenTransfer {
    amount: Int as coins;
    destination: Address;
}

message TokenTransferInternal {
    amount: Int as coins;
    from: Address;
}

message TokenBurn {
    amount: Int as coins;
}

// --- Wallet-Vertrag ---
contract JettonWallet with Ownable {

    balance: Int as coins;
    minterAddress: Address;

    init(minterAddress: Address, ownerAddress: Address) {
        self.balance = 0;
        self.minterAddress = minterAddress;
        self.owner = ownerAddress; // Der Besitzer der Wallet
    }

    // Empfängt eingehende Token
    receive(msg: TokenTransferInternal) {
        self.balance += msg.amount;
    }
    
    // Sendet Token an andere (mit Gebühr)
    receive(msg: TokenTransfer) {
        require(context().sender == self.owner, "Access denied: Only wallet owner can send.");
        require(self.balance >= msg.amount, "Insufficient balance.");

        let feeRate: Int = 2; // 2% Gebühr
        let fee: Int = msg.amount * feeRate / 100;
        let amountToSend: Int = msg.amount - fee;
        let treasury: Address = address("HIER_DEINE_TREASURY_ADRESSE_EINFÜGEN");

        self.balance -= msg.amount;
        
        // Sende den Hauptbetrag an den Empfänger
        let toWallet: Address = contractAddress(initOf(JettonWallet, self.minterAddress, msg.destination, initCodeOf(JettonWallet)));
        send(toWallet, self.owner, value: ton("0.03"), body: TokenTransferInternal{amount: amountToSend, from: self.owner}.toCell());
        
        // Sende die Gebühr an die Treasury
        let treasuryWallet: Address = contractAddress(initOf(JettonWallet, self.minterAddress, treasury, initCodeOf(JettonWallet)));
        send(treasuryWallet, self.owner, value: ton("0.03"), body: TokenTransferInternal{amount: fee, from: self.owner}.toCell());
    }
    
    // Verbrennt eigene Token
    receive(msg: TokenBurn) {
        require(context().sender == self.owner, "Access denied: Only wallet owner can burn.");
        require(self.balance >= msg.amount, "Insufficient balance.");

        self.balance -= msg.amount;
        
        // Benachrichtige den Minter-Vertrag über die Vernichtung
        send(self.minterAddress, self.owner, value: ton("0.01"), body = BurnNotification{amount: msg.amount, owner: self.owner}.toCell());
    }
    
    // --- Get-Methoden ---
    get fun get_wallet_data(): (Int, Address, Address) {
        return (self.balance, self.owner, self.minterAddress);
    }
}

