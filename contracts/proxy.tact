import "@stdlib/deploy";
import "@stdlib/ownable";

contract Proxy with Deployable, Ownable {
    
    implementation: Address; // Adresse des aktuellen Logik-Vertrags

    init(owner: Address, implementation: Address) {
        self.owner = owner;
        self.implementation = implementation;
    }
    
    // Als Besitzer kannst du die Implementierung ändern
    receive(msg: "upgrade", new_implementation: Address) {
        require(context().sender == self.owner, "Access denied");
        self.implementation = new_implementation;
    }
    
    // Leitet alle anderen Nachrichten an den Logik-Vertrag weiter
    receive(msg: Slice) {
        send(self.implementation, 
             context().sender, 
             value: context().value, 
             bounce: context().bounce, 
             body: msg, 
             mode: SendRemainingValue + SendPayGasSeparately
        );
    }
}
