import { toNano, Address } from '@ton/core';
import { Proxy } from '../wrappers/Proxy';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const proxyAddress = Address.parse(await ui.input('Geben Sie die Adresse des Proxy-Vertrags ein:'));
    const newImplementationAddress = Address.parse(await ui.input('Geben Sie die Adresse der NEUEN Implementierung ein:'));
    
    const proxy = provider.open(Proxy.createFromAddress(proxyAddress));

    console.log(`Aktualisiere Proxy [${proxyAddress}] auf neue Implementierung [${newImplementationAddress}]...`);

    await proxy.sendUpgrade(provider.sender(), {
        newImplementation: newImplementationAddress,
        value: toNano("0.05")
    });

    await ui.waitForConfirmation();

    console.log('✅ Upgrade-Befehl gesendet!');
}
