import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano, beginCell } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';
import '@ton-community/test-utils';

describe('JettonWallet', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let user2: SandboxContract<TreasuryContract>;
    let minter: SandboxContract<JettonMinter>;
    let user1Wallet: SandboxContract<JettonWallet>;
    let user2Wallet: SandboxContract<JettonWallet>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');

        const minterCode = await Blockchain.compile('JettonMinter');
        const content = beginCell().storeStringTail('Test').endCell();
        minter = blockchain.openContract(JettonMinter.createFromConfig({ owner: deployer.address, content }, minterCode));
        await minter.sendDeploy(deployer.getSender(), toNano('0.05'));
        
        // Mint tokens to user1 to enable testing transfers
        await minter.sendMint(deployer.getSender(), { toAddress: user1.address, amount: toNano('100'), value: toNano('0.1')});
        
        const user1WalletAddr = await minter.getWalletAddress(user1.address);
        const user2WalletAddr = await minter.getWalletAddress(user2.address);
        user1Wallet = blockchain.openContract(JettonWallet.createFromAddress(user1WalletAddr));
        user2Wallet = blockchain.openContract(JettonWallet.createFromAddress(user2WalletAddr));
    });

    it('should transfer tokens and apply fee', async () => {
        const initialBalance1 = await user1Wallet.getBalance();
        const initialBalance2 = await user2Wallet.getBalance();
        const transferAmount = toNano('10');
        const fee = transferAmount * 2n / 100n; // 2% fee
        const amountToReceive = transferAmount - fee;
        
        const transferResult = await user1Wallet.sendTransfer(user1.getSender(), {
            value: toNano('0.1'),
            toAddress: user2.address,
            amount: transferAmount,
        });

        expect(transferResult.transactions).toHaveTransaction({
            from: user1.address,
            to: user1Wallet.address,
            success: true,
        });

        expect(await user1Wallet.getBalance()).toEqual(initialBalance1 - transferAmount);
        expect(await user2Wallet.getBalance()).toEqual(initialBalance2 + amountToReceive);
        
        // Note: Testing the treasury fee reception would require getting the treasury wallet address
        // and checking its balance, which is omitted here for brevity.
    });

    it('should burn tokens and notify minter', async () => {
        const initialTotalSupply = await minter.getTotalSupply();
        const initialBalance = await user1Wallet.getBalance();
        const burnAmount = toNano('5');

        const burnResult = await user1Wallet.sendBurn(user1.getSender(), {
            value: toNano('0.1'),
            amount: burnAmount,
        });

        expect(burnResult.transactions).toHaveTransaction({
            from: user1Wallet.address,
            to: minter.address, // Notification to minter
            success: true,
        });

        expect(await user1Wallet.getBalance()).toEqual(initialBalance - burnAmount);
        expect(await minter.getTotalSupply()).toEqual(initialTotalSupply - burnAmount);
    });
});
