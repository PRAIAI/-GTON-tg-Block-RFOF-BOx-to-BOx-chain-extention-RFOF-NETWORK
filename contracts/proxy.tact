import "@stdlib/deploy";
import "@stdlib/ownable";

// Nachricht, um die Implementierung zu aktualisieren
message Upgrade {
    new_implementation: Address;
}

// Der Proxy-Vertrag, der die Logik für Upgrades enthält
contract Proxy with Deployable, Ownable {
    
    // Die Adresse des aktuellen Logik-Vertrags (z.B. der JettonMinter)
    implementation: Address;

    init(owner: Address, implementation: Address) {
        // Beim Deployen werden der Besitzer und die erste Implementierung gesetzt
        self.owner = owner;
        self.implementation = implementation;
    }
    
    // Empfängt die Upgrade-Nachricht
    receive(msg: Upgrade) {
        // Nur der Besitzer kann ein Upgrade durchführen
        require(context().sender == self.owner, "Access denied: Caller is not the owner.");
        self.implementation = msg.new_implementation;
    }
    
    // Empfängt alle anderen Nachrichten und leitet sie weiter
    receive(msg: Slice) {
        // Sende die empfangene Nachricht unverändert an den Logik-Vertrag
        send(self.implementation, 
             context().sender, 
             value: context().value, 
             bounce: context().bounce, 
             body: msg, 
             mode: SendRemainingValue + SendPayGasSeparately
        );
    }
}
