import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano, beginCell } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import { NftItem } from '../wrappers/NftItem'; // Wrapper für NftItem wäre auch nötig
import '@ton-community/test-utils';

describe('NFT Collection', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let collection: SandboxContract<NftCollection>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        user = await blockchain.treasury('user');

        const collectionCode = await Blockchain.compile('NftCollection');
        const collectionContent = beginCell().storeStringTail("My Test Collection").endCell();
        
        collection = blockchain.openContract(
            NftCollection.createFromConfig({ owner: deployer.address, collectionContent }, collectionCode)
        );

        await collection.sendDeploy(deployer.getSender(), toNano('0.05'));
    });

    it('should deploy and mint a new NFT', async () => {
        const itemContent = beginCell().storeStringTail("My First NFT").endCell();
        
        // Mint-Befehl senden
        const mintResult = await collection.sendMint(deployer.getSender(), {
            value: toNano('0.1'),
            itemOwner: user.address,
            itemContent,
        });
        
        // Überprüfen, ob die Transaktion erfolgreich war
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            success: true,
        });

        // Die Adresse des neuen NFTs abrufen und überprüfen, ob es deployed wurde
        const nftAddress = await collection.getNftAddressByIndex(0n);
        const nftItem = blockchain.openContract(NftItem.createFromAddress(nftAddress));
        
        // Überprüfen, ob der Besitzer des NFTs der richtige ist
        const nftData = await nftItem.getNftData();
        expect(nftData.ownerAddress).toEqualAddress(user.address);
    });
});
