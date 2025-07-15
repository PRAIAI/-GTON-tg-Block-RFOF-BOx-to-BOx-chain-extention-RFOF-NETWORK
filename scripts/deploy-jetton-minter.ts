import { toNano, beginCell } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { Proxy } from '../wrappers/Proxy'; // Importiere den Proxy-Wrapper

export async function run(provider: NetworkProvider) {
    const content = beginCell()
        .storeStringTail('https://dns.tonkeeper.com/manage?v=0:b252a6f274515998ccb587a049f579b7ea74a09609574ff5f671b7ee8b734530')
        .endCell();

    const minter = provider.open(
        JettonMinter.createFromConfig(
            {
                owner: provider.sender().address!,
                content: content,
            },
            await compile('JettonMinter')
        )
    );

    await minter.sendDeploy(provider.sender(), toNano('0.1'));

    await provider.waitForDeploy(minter.address);

    console.log('✅ JettonMinter deployed at address:', minter.address);

    // --- Optional: Proxy auf diese neue Minter-Adresse aktualisieren ---
    // const proxyAddress = Address.parse("HIER_ADRESSE_DES_PROXYS_EINFÜGEN");
    // const proxy = provider.open(Proxy.createFromAddress(proxyAddress));
    // await proxy.sendUpgrade(provider.sender(), {
    //     newImplementation: minter.address,
    //     value: toNano("0.05")
    // });
    // console.log('✅ Proxy upgraded to point to new JettonMinter');
}
