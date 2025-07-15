import { Blockchain, SandboxContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { tgBTC } from '../wrappers/tgBTC';
import '@ton/test-utils';

describe('tgBTC', () => {
    let blockchain: Blockchain;
    let tgbtc: SandboxContract<tgBTC>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');
        tgbtc = blockchain.openContract(await tgBTC.fromInit());

        const deployResult = await tgbtc.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tgbtc.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy successfully', async () => {
        // Der Test ist bereits im beforeEach-Block definiert.
        // Wenn der Code hier ankommt, war das Deployment erfolgreich.
    });
    
    it('should have zero total supply initially', async () => {
        const totalSupply = await tgbtc.getTotalSupply();
        expect(totalSupply).toBe(0n); // Erwartet 0, da wir im Vertrag mit 0 initialisiert haben
    });
});
