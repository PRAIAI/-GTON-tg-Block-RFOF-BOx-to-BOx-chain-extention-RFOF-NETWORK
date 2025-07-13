import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type ProxyConfig = {
    owner: Address;
    implementation: Address;
};

export function proxyConfigToCell(config: ProxyConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeAddress(config.implementation)
        .endCell();
}

export class Proxy implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Proxy(address);
    }

    static createFromConfig(config: ProxyConfig, code: Cell, workchain = 0) {
        const data = proxyConfigToCell(config);
        const init = { code, data };
        return new Proxy(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendUpgrade(provider: ContractProvider, via: Sender, opts: {
        newImplementation: Address;
        value: bigint;
    }) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4514d116, 32) // Op-code for "Upgrade" message if you define one
                .storeAddress(opts.newImplementation)
                .endCell(),
        });
    }
}
