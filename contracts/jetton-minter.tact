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
