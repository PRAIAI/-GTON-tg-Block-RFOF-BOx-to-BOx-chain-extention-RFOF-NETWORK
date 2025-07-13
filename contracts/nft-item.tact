import "@stdlib/ownable";

// Nachricht, um das NFT an einen neuen Besitzer zu übertragen
message NftTransfer {
    newOwner: Address;
}

// Der Vertrag für ein einzelnes NFT
contract NftItem with Ownable {
    
    collectionAddress: Address; // Adresse der übergeordneten Kollektion
    index: Int as uint64;       // Einzigartiger Index innerhalb der Kollektion
    itemContent: Cell;          // Individuelle Daten dieses NFTs

    init(collectionAddress: Address, index: Int, ownerAddress: Address, itemContent: Cell) {
        self.collectionAddress = collectionAddress;
        self.index = index;
        self.owner = ownerAddress;
        self.itemContent = itemContent;
    }
    
    // Empfängt die Transfer-Nachricht
    receive(msg: NftTransfer) {
        // Nur der aktuelle Besitzer kann das NFT transferieren
        require(context().sender == self.owner, "Access denied: Only owner can transfer.");
        
        // Setze den neuen Besitzer
        self.owner = msg.newOwner;
    }

    // --- Get-Methoden ---
    get fun get_nft_data(): (Int, Address, Address, Cell) {
        return (self.index, self.collectionAddress, self.owner, self.itemContent);
    }
}
