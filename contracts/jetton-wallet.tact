// Hauptfunktion zum Senden von Token an andere (JETZT MIT GEBÜHR)
receive(msg: TokenTransfer) {
    require(context().sender == self.owner, "Access denied: only owner can send");
    require(self.balance >= msg.amount, "Insufficient balance");

    // --- NEUE LOGIK FÜR GEBÜHREN ---
    let feeRate: Int = 2; // 2% Gebühr
    let fee: Int = msg.amount * feeRate / 100;
    let amountToSend: Int = msg.amount - fee;
    let treasury: Address = address("DEINE_TREASURY_WALLET_ADRESSE_HIER");
    // --- ENDE NEUE LOGIK ---

    // Funktion zum Verbrennen von Token
receive(msg: TokenBurn) {
    require(context().sender == self.owner, "Access denied: only owner can burn");
    require(self.balance >= msg.amount, "Insufficient balance");

    // Reduziere das Guthaben der Wallet
    self.balance -= msg.amount;
    
    // Sende eine Benachrichtigung an den Minter-Vertrag, um totalSupply zu aktualisieren
    send(self.minterAddress, 
         self.owner, 
         value = ton("0.01"), 
         body = BurnNotification{
             amount: msg.amount,
             owner: self.owner
         }.toCell()
    );
}
    // Reduziere das Guthaben um den vollen Betrag
    self.balance -= msg.amount; 
    
    // 1. Sende den Hauptbetrag an den eigentlichen Empfänger
    let toWalletAddress: Address = contractAddress(initOf(JettonWallet, self.minterAddress, msg.destination, initCodeOf(JettonWallet)));
    send(toWalletAddress, self.owner, value: ton("0.03"), body: TokenTransferInternal{ amount: amountToSend, from: self.owner, responseAddress: self.owner }.toCell());
    
    // 2. Sende die Gebühr an die Treasury-Wallet
    let treasuryWalletAddress: Address = contractAddress(initOf(JettonWallet, self.minterAddress, treasury, initCodeOf(JettonWallet)));
    send(treasuryWalletAddress, self.owner, value: ton("0.03"), body: TokenTransferInternal{ amount: fee, from: self.owner, responseAddress: self.owner }.toCell());
}
