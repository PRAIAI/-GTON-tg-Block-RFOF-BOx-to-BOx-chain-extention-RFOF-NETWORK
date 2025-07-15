import { toNano } from '@ton/core';
import { tgBTC } from '../wrappers/tgBTC';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    
    // =================================================================
    // ### PRAIAI SICHERHEITSREGEL: NUR TESTNET DEPLOYMENT ERLAUBT ###
    if (provider.network() !== 'testnet') {
        throw new Error('FEHLER: Das tgBTC-Projekt darf nur im Testnet bereitgestellt werden!');
    }
    // ### ENDE DER SICHERHEITSREGEL ###
    // =================================================================

    const tgbtc_contract = provider.open(await tgBTC.fromInit());

    await tgbtc_contract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tgbtc_contract.address);
    console.log("tgBTC contract deployed to Testnet at:", tgbtc_contract.address);
}
