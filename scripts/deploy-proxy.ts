import { toNano, Address } from '@ton/core';
import { Proxy } from '../wrappers/Proxy';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    // Annahme: Die Adresse des ersten Logik-Vertrags (Minter) ist bereits bekannt oder wird hier festgelegt.
    // Für ein echtes Deployment müsstest du zuerst den Minter deployen oder seine Adresse vorab berechnen.
    const initialImplementation = Address.parse("HIER_ADRESSE_DES_JETTON_MINTERS_EINFÜGEN");

    const proxy = provider.open(
        Proxy.createFromConfig(
            {
                owner: provider.sender().address!,
                implementation: initialImplementation,
            },
            await compile('Proxy')
        )
    );

    await proxy.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(proxy.address);

    console.log('✅ Proxy deployed at address:', proxy.address);
}
