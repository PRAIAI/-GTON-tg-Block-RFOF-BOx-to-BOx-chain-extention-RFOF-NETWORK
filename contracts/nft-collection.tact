import "@stdlib/deploy";
import "./nft-item"; // Importiert den Code des einzelnen NFT-Items

// Nachricht, um ein neues NFT zu minten
message NftMint {
    itemOwner: Address; // Der zukünftige Besitzer des neuen NFTs
    itemContent: Cell;  // Die individuellen Daten/Metadaten dieses NFTs
}

// Der Hauptvertrag der Kollektion
contract NftCollection with Deployable {
    
    owner: Address;             // Der Besitzer der Kollektion
    nextItemIndex: Int as uint64; // Zähler für das nächste NFT
    collectionContent: Cell;    // Metadaten der gesamten Kollektion

    init(owner: Address, collectionContent: Cell) {
        self.owner = owner;
        self.nextItemIndex = 0;
        self.collectionContent = collectionContent;
    }

    // Empfängt die Mint-Nachricht
    receive(msg: NftMint) {
        // Nur der Besitzer der Kollektion darf neue NFTs minten
        require(context().sender == self.owner, "Access denied: Only collection owner can mint.");

        // Berechne die Adresse des zukünftigen NFT-Item-Vertrags
        let itemAddress: Address = self.getNftAddressByIndex(self.nextItemIndex);
        
        // Erstelle die Initialisierungsdaten für das neue NFT-Item
        let itemInit: StateInit = initOf NftItem(
            self.address,           // Adresse der Kollektion
            self.nextItemIndex,      // Index dieses Items
            msg.itemOwner,           // Besitzer des Items
            msg.itemContent          // Inhalt des Items
        );

        // Sende eine Nachricht, um den neuen NFT-Item-Vertrag zu deployen
        send(itemAddress, self.owner, value: ton("0.05"), body: emptyCell(), code: itemInit.code, data: itemInit.data, bounce: false);
        
        // Erhöhe den Zähler für das nächste Item
        self.nextItemIndex += 1;
    }

    // --- Get-Methoden ---
    get fun getNftAddressByIndex(index: Int): Address {
        let init: StateInit = initOf NftItem(self.address, index, self.owner, emptyCell());
        return contractAddress(init);
    }
}
