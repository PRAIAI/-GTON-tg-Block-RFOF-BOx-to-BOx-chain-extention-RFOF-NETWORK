import "@stdlib/deploy";

// Datenstruktur für jeden Staker
struct Staker {
    balance: Int as coins;
    stakedAt: Int as uint32;
}

contract StakingContract with Deployable {
    
    // Der Staking-Vertrag ist Besitzer seiner eigenen GTON-Token-Wallet
    jettonWallet: Address; 
    
    // Eine "Map" speichert die Daten für jeden einzelnen Staker
    stakers: map<Address, Staker>;

    init(jettonWallet: Address) {
        self.jettonWallet = jettonWallet;
        self.stakers = emptyMap();
    }
    
    // Wird aufgerufen, wenn der Vertrag GTON-Token empfängt (Einzahlung/Stake)
    receive(msg: TokenTransferInternal) {
        let stakerAddress: Address = msg.from;
        let current: Staker? = self.stakers.get(stakerAddress);
        
        // Speichere oder aktualisiere die Staker-Daten
        if (current == null) {
            self.stakers.set(stakerAddress, Staker{balance: msg.amount, stakedAt: now()});
        } else {
            self.stakers.set(stakerAddress, Staker{balance: current.balance + msg.amount, stakedAt: now()});
        }
    }
    
    // Funktion zum Abheben ("Unstake")
    receive("unstake") {
        // Hier käme die Logik zum Zurücksenden der Tokens an den Nutzer
        // 1. Prüfen, ob der Nutzer ein Guthaben hat
        // 2. Token vom Staking-Vertrag zurück an den Nutzer senden
    }

    // Funktion zum Abholen der Belohnungen
    receive("claim_rewards") {
        // Hier käme die Logik zur Berechnung der Belohnungen
        // 1. Berechne Belohnung basierend auf 'balance' und Zeit
        // 2. Sende Belohnungs-Token an den Nutzer
    }
}
