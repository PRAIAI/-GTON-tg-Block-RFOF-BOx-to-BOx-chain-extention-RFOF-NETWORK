import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type StakingConfig = {
    minterAddress: Address;
};

export function stakingConfigToCell(config: StakingConfig): Cell {
    return beginCell()
        .storeAddress(config.minterAddress)
        .storeDict(null) // initial empty dictionary for stakers
        .endCell();
}

export class Staking implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Staking(address);
    }

    static createFromConfig(config: StakingConfig, code: Cell, workchain = 0) {
        const data = stakingConfigToCell(config);
        const init = { code, data };
        return new Staking(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendUnstake(provider: ContractProvider, via: Sender, opts: {
        value: bigint;
        amount: bigint;
    }) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x756e7374, 32) // Op-code for "unstake" text message
                .storeCoins(opts.amount)
                .endCell(),
        });
    }

    async getStaker(provider: ContractProvider, address: Address) {
        const result = await provider.get('getStaker', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
        ]);
        // Note: Parsing the result depends on how the Staker struct is returned.
        // This is a simplified example.
        if (result.stack.remaining === 0) return null;
        const balance = result.stack.readBigNumber();
        const stakedAt = result.stack.readNumber();
        return { balance, stakedAt };
    }
}
