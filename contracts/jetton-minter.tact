// ... existierender Code ...

// Eine Map, um den letzten Claim-Zeitpunkt jedes Nutzers zu speichern
const COOLDOWN: Int = 24 * 60 * 60; // 24 Stunden in Sekunden
claims: map<Address, Int as uint32>;

// Funktion zum Anfordern von Belohnungen
receive("claim") {
    let sender: Address = context().sender;
    let lastClaim: Int? = self.claims.get(sender);
    
    // Prüfen, ob der Nutzer schon einmal geclaimed hat und ob die Abkühlphase vorbei ist
    if (lastClaim != null) {
        require(lastClaim!! + COOLDOWN < now(), "Cooldown period is not over yet");
    }
    
    // Zeitstempel für diesen Claim speichern/aktualisieren
    self.claims.set(sender, now());
    
    // Eine feste Menge an neuen Token an den Nutzer minten
    let reward: Int = ton("10"); // 10 GTON als Belohnung
    self.totalSupply += reward;
    
    let walletAddress: Address = self.getWalletAddress(sender);
    send(walletAddress, self.owner, value: ton("0.05"), body: TokenTransferInternal{ amount: reward, from: sender, responseAddress: self.owner }.toCell());
}

