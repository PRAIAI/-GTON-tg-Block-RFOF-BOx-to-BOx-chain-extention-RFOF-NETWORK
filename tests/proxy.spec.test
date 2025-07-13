import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano } from '@ton/core';
import { Proxy } from '../wrappers/Proxy';
import '@ton-community/test-utils'; // For to.be.deployed()

describe('Proxy', () => {
    let code: Cell;
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let proxy: SandboxContract<Proxy>;
    let implementationV1: SandboxContract<TreasuryContract>;
    let implementationV2: SandboxContract<TreasuryContract>;

    beforeAll(async () => {
        code = await Blockchain.compile('Proxy');
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        implementationV1 = await blockchain.treasury('implementationV1');
        implementationV2 = await blockchain.treasury('implementationV2');

        proxy = blockchain.openContract(
            Proxy.createFromConfig(
                {
                    owner: deployer.address,
                    implementation: implementationV1.address,
                },
                code
            )
        );
    });

    it('should deploy', async () => {
        const deployResult = await proxy.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: proxy.address,
            deploy: true,
            success: true,
        });
    });

    it('should forward messages to implementation V1', async () => {
        const sendResult = await blockchain.sendMessage({
            from: deployer.getSender(),
            to: proxy.address,
            value: toNano('1'),
            body: beginCell().storeUint(123, 32).endCell()
        });
        
        expect(sendResult.transactions).toHaveTransaction({
            from: proxy.address,
            to: implementationV1.address,
            body: (x) => x.beginParse().loadUint(32) === 123, // Check if body is forwarded
        });
    });

    it('should upgrade to implementation V2 by owner', async () => {
        await proxy.sendUpgrade(deployer.getSender(), {
            newImplementation: implementationV2.address,
            value: toNano('0.05'),
        });

        // Send a new message and check if it goes to V2
        const sendResult = await blockchain.sendMessage({
            from: deployer.getSender(),
            to: proxy.address,
            value: toNano('1'),
            body: beginCell().storeUint(456, 32).endCell()
        });

        expect(sendResult.transactions).toHaveTransaction({
            from: proxy.address,
            to: implementationV2.address, // Should now go to V2
            body: (x) => x.beginParse().loadUint(32) === 456,
        });
    });

    it('should not upgrade if sender is not owner', async () => {
        const notOwner = await blockchain.treasury('notOwner');
        const upgradeResult = await proxy.sendUpgrade(notOwner.getSender(), {
            newImplementation: implementationV1.address, // try to switch back
            value: toNano('0.05'),
        });

        expect(upgradeResult.transactions).toHaveTransaction({
            from: notOwner.address,
            to: proxy.address,
            success: false, // Transaction should fail
            exitCode: 4429, // Exit code for 'Access denied: Caller is not the owner.'
        });
    });
});
