import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type JettonMinterConfig = {
    owner: Address;
    content: Cell;
};

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeCoins(0) // initial totalSupply
        .storeRef(config.content)
        .storeRef(Cell.EMPTY) // Placeholder for wallet_code
        .endCell();
}

export class JettonMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonMinter(address);
    }

    static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
        const data = jettonMinterConfigToCell(config);
        const init = { code, data };
        return new JettonMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendMint(provider: ContractProvider, via: Sender, opts: {
        toAddress: Address;
        amount: bigint;
        value: bigint;
    }) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x1674b0a0, 32) // Op-code for "Mint" message
                .storeAddress(opts.toAddress)
                .storeCoins(opts.amount)
                .endCell(),
        });
    }

    async sendClaim(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x46436c61, 32) // Op-code for "claim" text message
                .endCell(),
        });
    }

    async getTotalSupply(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('get_jetton_data', []);
        return result.stack.readBigNumber();
    }
}
