import { toNano, Address } from '@ton/core';
import { Staking } from '../wrappers/Staking';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    // Die Adresse des Minter-Vertrags ist für die Initialisierung erforderlich
    const minterAddress = Address.parse("EQDZQo1mcx8NF__NAvpMOyF5seE-R90wxTLv3pyhyKn8jdX7");

    const staking = provider.open(
        Staking.createFromConfig(
            {
                minterAddress: minterAddress
            },
            await compile('Staking')
        )
    );

    await staking.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(staking.address);

    console.log('✅ Staking Contract deployed at address:', staking.address);
}
