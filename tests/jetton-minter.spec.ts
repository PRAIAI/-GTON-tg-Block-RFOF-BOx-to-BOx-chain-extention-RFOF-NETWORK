import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano, beginCell } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';
import '@ton-community/test-utils';

describe('JettonMinter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let minter: SandboxContract<JettonMinter>;
    let walletCode: Cell;
    const COOLDOWN = 24 * 60 * 60; // Same as in contract

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        user = await blockchain.treasury('user');
        
        walletCode = await Blockchain.compile('JettonWallet');
        const minterCode = await Blockchain.compile('JettonMinter');
        
        const content = beginCell().storeStringTail('Test Token').endCell();

        minter = blockchain.openContract(
            JettonMinter.createFromConfig(
                {
                    owner: deployer.address,
                    content: content
                },
                minterCode
            )
        );

        const deployResult = await minter.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: minter.address,
            deploy: true,
        });
    });

    it('should allow owner to mint tokens', async () => {
        const initialTotalSupply = await minter.getTotalSupply();
        const mintAmount = toNano('1000');
        
        const mintResult = await minter.sendMint(deployer.getSender(), {
            toAddress: user.address,
            amount: mintAmount,
            value: toNano('0.1'),
        });

        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: minter.address,
            success: true,
        });

        expect(await minter.getTotalSupply()).toEqual(initialTotalSupply + mintAmount);

        const userWallet = blockchain.openContract(JettonWallet.createFromAddress(await minter.getWalletAddress(user.address)));
        expect(await userWallet.getBalance()).toEqual(mintAmount);
    });

    it('should not allow non-owner to mint', async () => {
        const mintResult = await minter.sendMint(user.getSender(), {
            toAddress: user.address,
            amount: toNano('1000'),
            value: toNano('0.1'),
        });

        expect(mintResult.transactions).toHaveTransaction({
            from: user.address,
            to: minter.address,
            success: false,
            exitCode: 4429, // Access denied
        });
    });

    it('should allow user to claim tokens and enforce cooldown', async () => {
        // First claim
        const claimResult = await minter.sendClaim(user.getSender(), toNano('0.05'));
        expect(claimResult.transactions).toHaveTransaction({
            from: user.address,
            to: minter.address,
            success: true,
        });

        // Second immediate claim should fail
        const secondClaimResult = await minter.sendClaim(user.getSender(), toNano('0.05'));
        expect(secondClaimResult.transactions).toHaveTransaction({
            from: user.address,
            to: minter.address,
            success: false, // Should fail due to cooldown
        });

        // Advance time beyond cooldown
        blockchain.now += COOLDOWN + 1;

        // Third claim after cooldown should succeed
        const thirdClaimResult = await minter.sendClaim(user.getSender(), toNano('0.05'));
        expect(thirdClaimResult.transactions).toHaveTransaction({
            from: user.address,
            to: minter.address,
            success: true,
        });
    });
});
